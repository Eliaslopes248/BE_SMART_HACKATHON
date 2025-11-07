//===============================================
// HANDLES ALL GIGS-RELATED ENDPOINTS
//===============================================

// import modules
const express = require("express");
const router = express.Router();
const { RC_RESPONSE } = require('../utils/endpoint_helpers.js');
const { RC_CODES } = require('../utils/error.js');
const db = require('../wrappers/database.js');

//===============================================
// HTTP ENDPOINTS
//===============================================

// Add a new gig
router.post("/", async (req, res) => {
    try {
        const gigData = req.body;
        
        if (!gigData || typeof gigData !== 'object' || Object.keys(gigData).length === 0) {
            return res.json(RC_RESPONSE(RC_CODES.BAD_REQUEST, {
                details: "Gig data is required and must be a non-empty object"
            }));
        }

        // Build dynamic INSERT query based on provided fields
        const fields = Object.keys(gigData);
        const values = Object.values(gigData);
        const placeholders = fields.map(() => '?').join(', ');
        
        const insertQuery = `INSERT INTO gigs (${fields.join(', ')}) VALUES (${placeholders})`;
        
        // For INSERT, mysql2 returns ResultSetHeader with insertId
        // We need to use the pool directly to get the full result
        const pool = await db.getPool();
        const [result] = await pool.execute(insertQuery, values);
        
        // result is a ResultSetHeader object with insertId property
        const insertId = result.insertId;
        
        // Get the inserted gig
        const insertedGig = await db.query('SELECT * FROM gigs WHERE id = ?', [insertId]);
        
        return res.json(RC_RESPONSE(RC_CODES.SUCCESS, {
            gig: insertedGig[0],
            message: "Gig added successfully"
        }));
    } catch (error) {
        console.error("Error adding gig:", error);
        return res.json(RC_RESPONSE(RC_CODES.SERVER_ERROR, {
            details: "Error adding gig",
            error: error.message
        }));
    }
});

// Get all gigs (POST request)
router.post("/all", async (req, res) => {
    try {
        const gigs = await db.query('SELECT * FROM gigs ORDER BY created_at DESC');
        
        return res.json(RC_RESPONSE(RC_CODES.SUCCESS, {
            gigs: gigs
        }));
    } catch (error) {
        console.error("Error fetching gigs:", error);
        return res.json(RC_RESPONSE(RC_CODES.SERVER_ERROR, {
            details: "Error fetching gigs",
            error: error.message
        }));
    }
});

module.exports = router;

