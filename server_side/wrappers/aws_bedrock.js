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
    region: process.env.AWS_REGION || process.env.BEDROCK_REGION || 'us-east-1',
    defaultModel: process.env.BEDROCK_DEFAULT_MODEL || 'meta.llama3-8b-instruct-v1:0'
};

//=================================================
// Bedrock Client (lazy initialization)
//=================================================
let bedrockClient = null;

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
// Invoke Model
//=================================================
/**
 * Send a text prompt to AWS Bedrock and get a response
 * @param {string} prompt - The text prompt to send
 * @param {string} modelId - Optional model ID to override default (e.g., 'meta.llama3-70b-instant-v1:0')
 * @param {object} options - Optional parameters (maxTokens, temperature, etc.)
 * @returns {Promise<string>} The model's text response
 */
async function invokeModel(prompt, modelId = null, options = {}) {
    try {
        const client = getBedrockClient();
        const model = modelId || BEDROCK_CONFIG.defaultModel;

        // Default parameters
        const params = {
            max_gen_len: options.maxTokens || 512,
            temperature: options.temperature !== undefined ? options.temperature : 0.7,
            top_p: options.topP !== undefined ? options.topP : 0.9
        };

        // Prepare the request body based on model family
        let body;
        if (model.startsWith('meta.')) {
            // Llama models use this format
            body = JSON.stringify({
                prompt: prompt,
                max_gen_len: params.max_gen_len,
                temperature: params.temperature,
                top_p: params.top_p
            });
        } else if (model.startsWith('amazon.')) {
            // Titan models use this format
            body = JSON.stringify({
                inputText: prompt,
                textGenerationConfig: {
                    maxTokenCount: params.max_gen_len,
                    temperature: params.temperature,
                    topP: params.top_p
                }
            });
        } else {
            // Default format (try Llama format)
            body = JSON.stringify({
                prompt: prompt,
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

        const response = await client.send(command);
        const responseBody = JSON.parse(Buffer.from(response.body).toString());

        // Extract text from response based on model type
        let text;
        if (model.startsWith('meta.')) {
            // Llama models return: { generation: "text" }
            text = responseBody.generation || responseBody.generations?.[0]?.text || '';
        } else if (model.startsWith('amazon.')) {
            // Titan models return: { results: [{ outputText: "text" }] }
            text = responseBody.results?.[0]?.outputText || '';
        } else {
            // Try common fields
            text = responseBody.generation || responseBody.outputText || responseBody.text || JSON.stringify(responseBody);
        }

        return text.trim();
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
 * @returns {Promise<string>} The model's response
 */
async function prompt(prompt, modelId = null) {
    return await invokeModel(prompt, modelId);
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

