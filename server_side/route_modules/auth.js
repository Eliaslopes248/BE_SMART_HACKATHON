//===============================================
// HANDLES ALL BASIC AUTHENTICATION
//===============================================


// import modules
const express           = require("express");
const router            = express.Router();
const { OAuth2Client }  = require("google-auth-library");
const jwt               = require('jsonwebtoken');
const { RC_RESPONSE }   = require('../utils/endpoint_helpers.js');
const { RC_CODES }      = require('../utils/error.js');


//===============================================
// ENDPOINT HELPERS
//===============================================

async function authorizeLogin(req, res, next){
        next();
    
}

async function authorizeRegistration(req, res, next){
    next();
}


//===============================================
// HTTP ENDPOINTS
//===============================================

//register user with registration credentials
router.post("/basic/register", authorizeRegistration, (req, res) => {

});

// register user with google token
router.post("/google/register", authorizeRegistration, (req, res) => {

});

// login user with username and password
router.post("/basic/login", authorizeLogin, (req, res) => {

});

module.exports = router