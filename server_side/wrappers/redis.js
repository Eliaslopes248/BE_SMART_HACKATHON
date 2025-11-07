//===============================================
// REDIS CACHING SYSTEM
//===============================================

// import modules
const redis     = require("redis");
const dotenv    = require("dotenv");

// access env variables
dotenv.config();

//===============================================
// CREATE REDIS CLIENT
//===============================================
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redisClient = redis.createClient({
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
});

// Connect to Redis
redisClient.connect().catch((error) => {
    console.error('Failed to connect to Redis:', error.message);
    console.error(`Redis connection: ${REDIS_HOST}:${REDIS_PORT}`);
});


//===============================================
// REDIS HELPERS
//===============================================

/**
 * Adds a key:value pair to redis cache
 * @param {*} key 
 * @param {*} value 
 * @param {*} expiration (optional) sets an expiration date of how long cached data will live in redis (in seconds)
 */
async function cacheData(key, value, expiration=null){
    try {
        if (expiration) {
            // Set with expiration in seconds
            await redisClient.setEx(key, expiration, JSON.stringify(value));
        } else {
            // Set without expiration
            await redisClient.set(key, JSON.stringify(value));
        }
        return true;
    } catch (error) {
        console.error("Error when trying to cache data:", error);
        return null;
    }
}

/**
 * checks to see if data is cached in redis
 * @param {*} key 
 * @returns data found in cache or null
 */
async function checkCache(key){
    // bad key given
    if (!key)
        return null;

    try{
        // attempt to get data from the cache
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }catch(error){
        console.error("Error when trying to get value from cache:", error);
        return null;
    }
}



// utils export
module.exports = {
    redisClient,
    cacheData,
    checkCache
}