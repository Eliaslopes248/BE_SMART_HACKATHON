//===============================================
// GOOGLE CLOUD ENDPOINTS
//===============================================



// import modules
const express           = require("express");
const router            = express.Router();
const { OAuth2Client }  = require("google-auth-library");
const jwt               = require('jsonwebtoken');
const { RC_RESPONSE }   = require('../utils/endpoint_helpers.js');
const { RC_CODES }      = require('../utils/error.js');

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
 * user exists in the database
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

        //========================================
        // MAKE REQUEST TO RDS TO FIND USER
        //========================================

        // sends to next callback()
        next();
    }catch(error){
        console.error("Error finding user in database:", error);
        return res.json(RC_RESPONSE(RC_CODES.SERVER_ERROR, {
            details: "Unexpected error during user lookup",
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
function createJwtForUser(googlePayload){
    if (!googlePayload)
        return null;

    // create json token
    const userData = {
        googleId:       googlePayload.googleId,
        email:          googlePayload.email,
        name:           googlePayload.name,
        first_name:     googlePayload.firstName,
        lastName:       googlePayload.lastName,
        picture:        googlePayload.picture,
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