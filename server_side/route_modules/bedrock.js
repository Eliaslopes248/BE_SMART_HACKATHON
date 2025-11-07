//===============================================
// HANDLES ALL BEDROCK-RELATED ENDPOINTS
//===============================================

// import modules
const express = require("express");
const router = express.Router();
const { RC_RESPONSE } = require('../utils/endpoint_helpers.js');
const { RC_CODES } = require('../utils/error.js');
const bedrock = require('../wrappers/aws_bedrock.js');

//===============================================
// HTTP ENDPOINTS
//===============================================

// Send prompt to Bedrock for smart search
router.post("/search", async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt || typeof prompt !== 'string') {
            return res.json(RC_RESPONSE(RC_CODES.BAD_REQUEST, {
                details: "Prompt is required and must be a string",
                received: typeof prompt
            }));
        }

        // Call Bedrock with the prompt
        const response = await bedrock.prompt(prompt);
        
        return res.json(RC_RESPONSE(RC_CODES.SUCCESS, {
            response: response,
            prompt: prompt
        }));
    } catch (error) {
        console.error("Error calling Bedrock:", error);
        return res.json(RC_RESPONSE(RC_CODES.SERVER_ERROR, {
            details: "Error processing Bedrock request",
            error: error.message
        }));
    }
});

module.exports = router;

