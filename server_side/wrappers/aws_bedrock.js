//=================================================
// AWS Bedrock Client Wrapper
//=================================================
// Simple interface to send text prompts to AWS Bedrock models
// Supports model override with Llama as default
//=================================================

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { fromNodeProviderChain }                    = require('@aws-sdk/credential-providers');

//=================================================
// Configuration from environment variables
//=================================================
const BEDROCK_CONFIG = {
    region: process.env.AWS_REGION || process.env.BEDROCK_REGION || 'us-east-2',
    defaultModel: process.env.BEDROCK_DEFAULT_MODEL || 'anthropic.claude-3-haiku-20240307-v1:0'
};

//=================================================
// Bedrock Client (lazy initialization)
//=================================================
let bedrockClient = null;



//=================================================
// BEDROCK PROMPT TAILORING
//=================================================


const schemas = `
    CREATE TABLE \`Users\` (
  \`uid\` varchar(36) NOT NULL,
  \`fname\` varchar(80) NOT NULL,
  \`lname\` varchar(80) NOT NULL,
  \`username\` varchar(160) NOT NULL,
  \`email\` varchar(255) NOT NULL,
  \`avatar_url\` varchar(512) DEFAULT NULL,
  \`User_roles\` enum('RESIDENT','R&D','OFFICIAL') NOT NULL,
  \`address_hash\` char(64) DEFAULT NULL,
  \`password\` varchar(255) NOT NULL,
  PRIMARY KEY (\`uid\`),
  UNIQUE KEY \`username\` (\`username\`),
  UNIQUE KEY \`email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`gigs\` (
  \`uid\` varchar(225) NOT NULL,
  \`gig_owner\` varchar(225) NOT NULL,
  \`gig_name\` varchar(225) NOT NULL,
  \`gig_address\` varchar(100) NOT NULL,
  \`paid\` tinyint(1) NOT NULL DEFAULT '0',
  \`gig_created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`gig_description\` varchar(500) NOT NULL DEFAULT 'no desc',
  \`gig_tag\` enum('REAL_ESTATE','VOLUNTEERING','INFRASTRUCTURE','HOSPITALITY') NOT NULL,
  \`gig_urgency\` enum('LOW','MEDIUM','HIGH') NOT NULL DEFAULT 'LOW',
  PRIMARY KEY (\`uid\`),
  KEY \`gig_owner\` (\`gig_owner\`),
  CONSTRAINT \`gigs_ibfk_1\` FOREIGN KEY (\`gig_owner\`) REFERENCES \`Users\` (\`uid\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

// Enhanced mode-specific prompts with stronger instructions
const bedrock_modes = {
    "chat-mode": `You are an assistant for a Greensboro, NC gig platform. 

ABSOLUTE RULES - DO NOT VIOLATE:
0. YOU DO NOT KNOW ANYTHING ABOUT FIVER ONLY RE:GREENSBORO
1. ONLY list gigs that EXACTLY MATCH the names in the database below
2. DO NOT create, invent, suggest, or mention ANY gigs that are NOT in the database list
3. DO NOT use generic categories like "music gigs", "event planning gigs" - ONLY use exact gig names from database
4. If no matching gigs in database, say ONLY: "No matching gigs found"
5. NEVER mention Fiverr, Upwork, TaskRabbit, Uber, Lyft, or ANY other platform - this is FORBIDDEN
6. DO NOT say "According to [platform]" or "On [platform]" - NEVER reference other platforms
7. Keep response under 40 words - be extremely brief
8. Format: List ONLY the exact gig names from database that match, one per line

The database below contains ALL available gigs. You CANNOT mention anything not in that list. NEVER mention Fiverr or any other platform.`,

    "smart-search": `You are a SQL query generation expert. Your task is to convert natural language search requests into valid MySQL SELECT queries.

DATABASE SCHEMA:
${schemas}

INSTRUCTIONS:
1. Analyze the user's search request carefully
2. Generate a valid MySQL SELECT query that searches the \`gigs\` table
3. Use appropriate WHERE clauses to match:
   - \`gig_name\` (partial matches using LIKE)
   - \`gig_description\` (partial matches using LIKE)
   - \`gig_tag\` (exact matches: 'REAL_ESTATE', 'VOLUNTEERING', 'INFRASTRUCTURE', 'HOSPITALITY')
   - \`gig_urgency\` (exact matches: 'LOW', 'MEDIUM', 'HIGH')
   - \`paid\` (boolean: 0 for unpaid, 1 for paid)
   - \`gig_address\` (partial matches using LIKE)
4. If the search terms don't clearly match any specific fields, create a query that searches across multiple relevant fields using OR conditions
5. Always return a valid SQL query - never return ['none'] or empty results
6. Use proper SQL syntax with backticks for table and column names
7. Return ONLY the SQL query, nothing else - no explanations, no markdown formatting, just the raw SQL

Example format: SELECT * FROM \`gigs\` WHERE \`gig_tag\` = 'VOLUNTEERING' AND \`paid\` = 0;

Generate the SQL query now:`
};


//=================================================
// Initialize Bedrock Client
//=================================================
function getBedrockClient() {
    if (!bedrockClient) {
        bedrockClient = new BedrockRuntimeClient({
            region: BEDROCK_CONFIG.region,
            credentials: fromNodeProviderChain() // Uses default credential chain: env vars, ~/.aws/credentials, instance profile, etc.
        });
    }
    return bedrockClient;
}

//=================================================
// Format Gigs Data for Prompt
//=================================================
/**
 * Formats gigs data into a readable string for the prompt
 * @param {Array} gigsData - Array of gig objects from database
 * @returns {string} Formatted string of gigs data
 */
function formatGigsData(gigsData) {
    if (!gigsData || gigsData.length === 0) {
        return 'No gigs are currently available in the database.';
    }
    
    let formatted = `\nACTUAL GIGS IN DATABASE (${gigsData.length} total):\n\n`;
    
    gigsData.forEach((gig, index) => {
        formatted += `[GIG ${index + 1}]\n`;
        formatted += `Name: "${gig.gig_name || 'N/A'}"\n`;
        formatted += `Description: "${gig.gig_description || 'N/A'}"\n`;
        formatted += `Category: ${gig.gig_tag || 'N/A'}\n`;
        formatted += `Urgency: ${gig.gig_urgency || 'N/A'}\n`;
        formatted += `Paid: ${gig.paid === 1 ? 'Yes' : 'No'}\n`;
        formatted += `Location: ${gig.gig_address || 'N/A'}\n`;
        formatted += `---\n\n`;
    });
    
    return formatted;
}

//=================================================
// Build Enhanced Prompt with Mode
//=================================================
/**
 * Builds an enhanced prompt by prepending mode-specific instructions
 * @param {string} userPrompt - The user's original prompt
 * @param {string} mode - The mode to use ('chat-mode' or 'smart-search')
 * @param {Array} gigsData - Array of gig objects from database
 * @returns {string} The enhanced prompt with mode instructions and gigs data
 */
function buildPromptWithMode(userPrompt, mode = 'chat-mode', gigsData = []) {
    const modePrompt = bedrock_modes[mode] || bedrock_modes['chat-mode'];
    const gigsInfo = formatGigsData(gigsData);
    
    // Extract all gig names for validation
    const gigNames = gigsData.map(gig => (gig.gig_name || '').toLowerCase().trim()).filter(name => name);
    
    if (mode === 'smart-search') {
        // For smart-search, include schema, gigs data, and instructions
        return `${modePrompt}\n\n${gigsInfo}\n\nIMPORTANT: Use the actual gigs data above to generate a SQL query that will return relevant results. The query should match the user's search request against the actual data in the database.\n\nUser search request: ${userPrompt}`;
    } else {
        // For chat-mode, include gigs data FIRST, then instructions, then user prompt
        return `${modePrompt}\n\n${gigsInfo}\n\nVALID GIG NAMES (ONLY USE THESE): ${gigNames.join(', ')}\n\nYou MUST ONLY list gigs from the names above. DO NOT create new gig names.\n\nUser: ${userPrompt}\n\nAssistant:`;
    }
}

//=================================================
// Clean Response - Remove User's Question
//=================================================
/**
 * Removes the user's original prompt/question from the response
 * @param {string} response - The raw response from the model
 * @param {string} userPrompt - The user's original prompt/question
 * @param {string} mode - The mode used ('chat-mode' or 'smart-search')
 * @returns {string} The cleaned response without the user's question
 */
function cleanResponse(response, userPrompt, mode = 'chat-mode') {
    if (!response || !userPrompt) return response;
    
    let cleaned = response;
    const promptEscaped = userPrompt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Remove "Assistant:" prefix if present (chat-mode)
    if (mode === 'chat-mode') {
        cleaned = cleaned.replace(/^Assistant:\s*/i, '').trim();
    }
    
    // Remove the user's prompt if it appears at the very start (exact match)
    const promptLower = userPrompt.toLowerCase().trim();
    const responseLower = cleaned.toLowerCase().trim();
    
    if (responseLower.startsWith(promptLower)) {
        // Remove the question and any following punctuation/whitespace
        cleaned = cleaned.substring(userPrompt.length).trim();
        cleaned = cleaned.replace(/^[:\-\n\r\s]+/, '').trim();
    }
    
    // Remove patterns like "User: [question]" or "[question]?" only at the start
    const startPattern = new RegExp(`^\\s*(User:\\s*)?${promptEscaped}\\s*[:\n\r]?\\s*`, 'i');
    cleaned = cleaned.replace(startPattern, '').trim();
    
    // Remove the question if it appears as a standalone line at the start
    const standalonePattern = new RegExp(`^${promptEscaped}\\s*[?]?\\s*[\n\r]+`, 'i');
    cleaned = cleaned.replace(standalonePattern, '').trim();
    
    // Remove any duplicate newlines and clean up whitespace
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
    
    return cleaned || response; // Return original if cleaning removed everything
}

//=================================================
// Invoke Model
//=================================================
/**
 * Send a text prompt to AWS Bedrock and get a response
 * @param {string} prompt - The text prompt to send
 * @param {string} modelId - Optional model ID to override default (e.g., 'meta.llama3-70b-instant-v1:0')
 * @param {object} options - Optional parameters (maxTokens, temperature, mode, etc.)
 *   - mode: 'chat-mode' (default) or 'smart-search'
 * @returns {Promise<string>} The model's text response
 */
async function invokeModel(prompt, modelId = null, options = {}) {
    try {
        const client = getBedrockClient();
        const model = modelId || BEDROCK_CONFIG.defaultModel;
        
        // Get mode from options, default to 'chat-mode'
        const mode = options.mode || 'chat-mode';
        
        // Get gigs data from options
        const gigsData = options.gigsData || [];
        
        // Store original user prompt for cleaning
        const userPrompt = prompt;
        
        // Extract valid gig names for post-processing validation
        const validGigNames = gigsData.map(gig => (gig.gig_name || '').toLowerCase().trim()).filter(name => name);
        
        // Build enhanced prompt with mode-specific instructions and gigs data
        const enhancedPrompt = buildPromptWithMode(prompt, mode, gigsData);

        // Default parameters - adjust for smart-search mode
        // For chat-mode, use low max tokens for ultra-concise responses (60 tokens = ~40 words for Claude)
        const params = {
            max_gen_len: options.maxTokens || (mode === 'smart-search' ? 256 : 60),
            temperature: options.temperature !== undefined ? options.temperature : (mode === 'smart-search' ? 0.3 : 0.3),
            top_p: options.topP !== undefined ? options.topP : 0.9
        };

        // Prepare the request body based on model family
        let body;
        if (model.startsWith('anthropic.claude')) {
            // Claude models use messages format
            body = JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: params.max_gen_len,
                temperature: params.temperature,
                top_p: params.top_p,
                messages: [
                    {
                        role: "user",
                        content: enhancedPrompt
                    }
                ]
            });
        } else if (model.startsWith('meta.')) {
            // Llama models use this format
            body = JSON.stringify({
                prompt: enhancedPrompt,
                max_gen_len: params.max_gen_len,
                temperature: params.temperature,
                top_p: params.top_p
            });
        } else if (model.startsWith('amazon.')) {
            // Titan models use this format
            body = JSON.stringify({
                inputText: enhancedPrompt,
                textGenerationConfig: {
                    maxTokenCount: params.max_gen_len,
                    temperature: params.temperature,
                    topP: params.top_p
                }
            });
        } else {
            // Default format (try Llama format)
            body = JSON.stringify({
                prompt: enhancedPrompt,
                max_gen_len: params.max_gen_len,
                temperature: params.temperature,
                top_p: params.top_p
            });
        }

        const command = new InvokeModelCommand({
            modelId: model,
            contentType: 'application/json',
            accept: 'application/json',
            body: body
        });

        const response      = await client.send(command);
        const responseBody  = JSON.parse(Buffer.from(response.body).toString());

        // get text from response based on model type
        let text;
        if (model.startsWith('anthropic.claude')) {
            // Claude models return: { content: [{ type: "text", text: "..." }] }
            if (responseBody.content && Array.isArray(responseBody.content)) {
                text = responseBody.content
                    .filter(item => item.type === 'text')
                    .map(item => item.text)
                    .join('');
            } else {
                text = responseBody.text || '';
            }
        } else if (model.startsWith('meta.')) {
            // Llama models return: { generation: "text" }
            text = responseBody.generation || responseBody.generations?.[0]?.text || '';
        } else if (model.startsWith('amazon.')) {
            // Titan models return: { results: [{ outputText: "text" }] }
            text = responseBody.results?.[0]?.outputText || '';
        } else {
            // Try common fields
            text = responseBody.generation || responseBody.outputText || responseBody.text || JSON.stringify(responseBody);
        }

        // Clean the response to remove user's question
        let cleanedText = cleanResponse(text.trim(), userPrompt, mode);
        
        // For chat-mode, enforce 50-word limit, remove platform mentions, and validate gig names
        if (mode === 'chat-mode') {
            // Check if response contains forbidden platform names - if so, reject it
            const forbiddenPlatforms = [
                'fiverr', 'fiver', 'upwork', 'freelancer', 'taskrabbit', 'uber', 'lyft',
                'doordash', 'postmates', 'shipt', 'instacart', 'grubhub', 'caviar',
                'thumbtack', 'handy', 'gigwalk', 'rover', 'wag', 'turo', 'getaround',
                'airbnb', 'booking.com', 'care.com', 'angie', 'craigslist', 'gumtree'
            ];
            
            const responseLower = cleanedText.toLowerCase();
            const containsForbiddenPlatform = forbiddenPlatforms.some(platform => 
                responseLower.includes(platform)
            );
            
            // If response mentions forbidden platforms, replace with error message
            if (containsForbiddenPlatform) {
                console.warn('[Bedrock] Response contained forbidden platform mention - rejecting');
                cleanedText = "No matching gigs found";
            } else {
                // Also check for phrases like "According to Fiverr", "On Fiverr", etc.
                const platformPhrases = [
                    /according\s+to\s+(fiverr|upwork|taskrabbit|uber|lyft|any\s+platform)/gi,
                    /on\s+(fiverr|upwork|taskrabbit|uber|lyft)/gi,
                    /(fiverr|upwork|taskrabbit|uber|lyft)\s+(says|reports|shows)/gi,
                    /(fiverr|upwork|taskrabbit|uber|lyft)\s+data/gi,
                    /platforms?\s+like\s+(fiverr|upwork)/gi
                ];
                
                platformPhrases.forEach(pattern => {
                    if (pattern.test(cleanedText)) {
                        console.warn('[Bedrock] Response contained platform phrase - rejecting');
                        cleanedText = "No matching gigs found";
                        return;
                    }
                });
                // Remove mentions of other platforms (case-insensitive) - comprehensive list
                const platformPatterns = [
                    /\b(Uber|Lyft|TaskRabbit|Fiverr|Fiver|Upwork|Freelancer|DoorDash|Postmates|Shipt|GigWalk|Instacart|Grubhub|Caviar|Thumbtack|Handy|Angie|Care\.com|Rover|Wag|Turo|Getaround|Airbnb|Booking\.com|Craigslist|Gumtree)\b/gi,
                    /\baccording\s+to\s+(fiverr|upwork|taskrabbit|uber|lyft|any\s+platform|platforms?)/gi,
                    /\bon\s+(fiverr|upwork|taskrabbit|uber|lyft|platforms?)/gi,
                    /\b(fiverr|upwork|taskrabbit|uber|lyft)\s+(says|reports|shows|data|according)/gi,
                    /\bgig economy platforms?\b/gi,
                    /\bother platforms?\b/gi,
                    /\bplatforms? like\b/gi,
                    /\bsign up with\s+(a\s+)?(gig\s+)?(economy\s+)?platform/gi,
                    /\b(gig\s+)?(economy\s+)?platforms?\s+(like|such as|including)/gi,
                    /\bcheck out\s+(other\s+)?(gig\s+)?(economy\s+)?platforms?/gi,
                    /\bconsider\s+(other\s+)?(gig\s+)?(economy\s+)?platforms?/gi,
                    /\byou can also\s+(try|use|check|find)/gi,
                    /\bwebsites?\s+like\b/gi,
                    /\bapps?\s+like\b/gi,
                    /\b(online|web)\s+(gig\s+)?(economy\s+)?platforms?/gi
                ];
                
                platformPatterns.forEach(pattern => {
                    cleanedText = cleanedText.replace(pattern, '');
                });
                
                // Remove sentences that mention platforms or other cities
                const sentences = cleanedText.split(/[.!?]+/);
                cleanedText = sentences.filter(sentence => {
                    const sentLower = sentence.toLowerCase();
                    const hasForbiddenPlatform = forbiddenPlatforms.some(platform => sentLower.includes(platform));
                    const hasPlatformWords = sentLower.includes('platform') || sentLower.includes('website') || sentLower.includes('app');
                    // Filter out mentions of other cities (but keep Greensboro)
                    const hasOtherCities = /(charlotte|raleigh|durham|winston|asheville|wilmington|fayetteville|cary|high point|concord|gastonia|hickory|jacksonville|chapel hill|burlington|kannapolis|wilson|goldsboro|thomasville|rocky mount)/i.test(sentLower) && !sentLower.includes('greensboro');
                    
                    return !hasForbiddenPlatform && !hasPlatformWords && !hasOtherCities;
                }).join('. ').trim();
            }
            
            // Validate that only actual gig names from database are mentioned
            if (validGigNames.length > 0) {
                const lines = cleanedText.split('\n');
                const validLines = [];
                
                for (const line of lines) {
                    const lineLower = line.toLowerCase().trim();
                    // Check if line contains any valid gig name
                    const containsValidGig = validGigNames.some(gigName => lineLower.includes(gigName));
                    // Check if line is just "no matching gigs" or similar
                    const isNoMatchMessage = /no\s+(matching\s+)?gigs?/i.test(lineLower);
                    
                    if (containsValidGig || isNoMatchMessage) {
                        validLines.push(line);
                    }
                }
                
                // If we filtered out everything and there are valid gigs, return no match message
                if (validLines.length === 0 && cleanedText.toLowerCase().includes('no')) {
                    cleanedText = "No matching gigs found";
                } else if (validLines.length === 0) {
                    // If response doesn't contain valid gigs, replace with no match
                    cleanedText = "No matching gigs found";
                } else {
                    cleanedText = validLines.join('\n');
                }
            }
            
            // Clean up extra spaces and punctuation
            cleanedText = cleanedText.replace(/\s+/g, ' ').replace(/\s*,\s*,/g, ',').trim();
            
            // Enforce 40-word limit (ultra-concise)
            const words = cleanedText.split(/\s+/);
            if (words.length > 40) {
                // Truncate to 40 words
                cleanedText = words.slice(0, 40).join(' ');
            }
        }
        
        return cleanedText;
    } catch (error) {
        console.error('AWS Bedrock error:', error);
        throw new Error(`Bedrock invocation failed: ${error.message}`);
    }
}

//=================================================
// Simple Prompt (alias for invokeModel)
//=================================================
/**
 * Simple function to send a prompt and get a response
 * @param {string} prompt - The text prompt
 * @param {string} modelId - Optional model override
 * @param {object} options - Optional parameters (mode, maxTokens, temperature, etc.)
 * @returns {Promise<string>} The model's response
 */
async function prompt(prompt, modelId = null, options = {}) {
    return await invokeModel(prompt, modelId, options);
}

//=================================================
// Test Connection
//=================================================
/**
 * Test if Bedrock is accessible with a simple prompt
 * @returns {Promise<boolean>} True if connection is successful
 */
async function testConnection() {
    try {
        const response = await invokeModel('Hello', null, { maxTokens: 10 });
        return response.length > 0;
    } catch (error) {
        console.error('Bedrock connection test failed:', error);
        return false;
    }
}

//=================================================
// Module Exports
//=================================================
module.exports = {
    invokeModel,
    prompt,
    testConnection,
    getBedrockClient
};

