//===============================================
// GOOGLE CLOUD ENDPOINTS
//===============================================



// import modules
const express           = require("express");
const router            = express.Router();
const { OAuth2Client }  = require("google-auth-library");
const jwt               = require('jsonwebtoken');
const { randomUUID }    = require('crypto');
const { RC_RESPONSE }   = require('../utils/endpoint_helpers.js');
const { RC_CODES }      = require('../utils/error.js');
const { query }         = require('./database.js');

require("dotenv").config();

// google client
const clientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientId);

// helper methods----------------------------------------------------------------------

/**
 * decodes and verifies given
 * JWT, and passes to next callback()
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function decodeToken(req, res, next){
    console.log("Google auth endpoint hit");
    console.log("Request body:", req.body);
    
    const token = req.body.token || req.body.idToken || req.body;
    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: clientId,
        });

        // extract values from signed token
        const payload = ticket.getPayload();

        // add new section to http request
        req.user = {
            googleId: payload.sub,
            email: payload.email,
            fullName: payload.name,
            firstName: payload.given_name,
            lastName: payload.family_name,
            picture: payload.picture,
          };
          // go to next middleware layer
          next();

    }catch(error){
        console.error("Couldnt verify google JWT:", error);
        return res.json(RC_RESPONSE(RC_CODES.UNAUTHORIZED, {
            details: "Google JWT verification failed",
            error: error.message
        }));
    }

}

/**
 * checks users table to see if
 * user exists in the database, creates if not
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function userExists(req, res, next){
    if (!req.user) {
        return res.json(RC_RESPONSE(RC_CODES.BAD_REQUEST, {
            details: "User data not found in request"
        }));
    }

    try{
        const googleUser = req.user;
        const email = googleUser.email;

        // Check if user exists by email
        const existingUsers = await query(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );

        if (existingUsers && existingUsers.length > 0) {
            // User exists, attach to request
            const user = existingUsers[0];
            req.user = {
                uid: user.uid,
                email: user.email,
                fname: user.fname,
                lname: user.lname,
                username: user.username,
                avatar_url: user.avatar_url || googleUser.picture,
                googleId: googleUser.googleId,
                fullName: googleUser.fullName,
                firstName: googleUser.firstName,
                lastName: googleUser.lastName,
                picture: googleUser.picture
            };
            console.log('Google user found in database:', user.email);
        } else {
            // User doesn't exist, create new user
            const uid = randomUUID();
            const username = email.split('@')[0]; // Generate username from email
            const fname = googleUser.firstName || 'User';
            const lname = googleUser.lastName || '';
            
            // Insert new user (no password for Google auth users)
            await query(
                'INSERT INTO Users (uid, fname, lname, username, email, avatar_url, password, User_roles) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [uid, fname, lname, username, email, googleUser.picture || null, '', 'RESIDENT']
            );

            // Fetch the created user
            const newUsers = await query(
                'SELECT uid, fname, lname, username, email, avatar_url FROM Users WHERE uid = ?',
                [uid]
            );

            if (newUsers && newUsers.length > 0) {
                const user = newUsers[0];
                req.user = {
                    uid: user.uid,
                    email: user.email,
                    fname: user.fname,
                    lname: user.lname,
                    username: user.username,
                    avatar_url: user.avatar_url,
                    googleId: googleUser.googleId,
                    fullName: googleUser.fullName,
                    firstName: googleUser.firstName,
                    lastName: googleUser.lastName,
                    picture: googleUser.picture
                };
                console.log('Google user created in database:', user.email);
            } else {
                throw new Error('Failed to retrieve created user');
            }
        }

        // sends to next callback()
        next();
    }catch(error){
        console.error("Error finding/creating user in database:", error);
        return res.json(RC_RESPONSE(RC_CODES.SERVER_ERROR, {
            details: "Unexpected error during user lookup/creation",
            error: error.message
        }));
    }
}

/**
 * creates a custom JWT for user session
 * that allows use to not be dependent
 * on Google API after we get the first JWT
 * @param {*} token 
 * @returns custom JWT for user
 */
function createJwtForUser(userPayload){
    if (!userPayload)
        return null;

    // create json token with user data from database
    const userData = {
        uid:            userPayload.uid,
        email:          userPayload.email,
        fname:          userPayload.fname,
        lname:          userPayload.lname,
        username:       userPayload.username,
        avatar_url:     userPayload.avatar_url,
        googleId:       userPayload.googleId || null,
    };

    const secret = process.env.JWT_SECRET || "development_secret";
    console.log("Using JWT secret:", secret);
    return jwt.sign(userData, secret, { expiresIn: '7d' });
}


// ------------------------------------------------------------------------------------

router.post("/auth", decodeToken, userExists, (req, res)=>{
    try {
        console.log('creating token');

        const payload = req.user || null; // user found
        const customToken = createJwtForUser(payload);
        console.log('token completed');

        // send back response
        res.json(RC_RESPONSE(RC_CODES.SUCCESS, {
            userToken: customToken
        }));

    } catch(err){
        console.error("Error in /auth route:", err);
        res.json(RC_RESPONSE(RC_CODES.SERVER_ERROR, {
            details: "Unexpected error during authentication",
            error: err.message
        }));
    }
});


// export routes
module.exports = router;