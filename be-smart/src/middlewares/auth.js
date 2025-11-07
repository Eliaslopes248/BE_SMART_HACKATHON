//======================================
// HANDLE ALL SERVER COMMUNICATION
//======================================
import * as API  from "../utils/api.js"
import jwtDecode from "jwt-decode"

/**
 * sends jwt from google to be verified and then 
 * returns a new custom session token
 * @param {*} jwt 
 * @returns jwt - encoded
 */
async function invokeGoogleAuth(jwt) {
    if (!jwt) return null;
    try {
        // request for authenticated user session
        const response = await API.post(`/api/google/auth`,{ token: jwt });

        // check for status
        if (response.status != 200){
            console.error("Unable to make request:", response);
            return null;
        }
        // handle other status codes


        // handle success
        if (response.status == 200){
            // decrypt jwt
            const user = jwtDecode(response.userToken);
            // sends back to jsx file i assume to be setUser context
            return user;
        }
    } catch (error) {
        console.error("Error when requesting continue with google auth:", error);
        return null;
    }
}

/**
 * sends request to log in with username and password
 * @param {*} userData 
 * @returns user session
 */
async function invokeBasicLogin(userData) {
    if (!userData) return null;

    try {
        // send auth request to server
        const response = await API.post(`/api/auth/basic/login`, { credentials: userData });

        // check for status
        if (response.status != 200){
            console.error("Unable to make request:", response);
            return null;
        }
     
        // handle success
        if (response.status == 200){
            // sends back to jsx file I assume to be setUser context
            return response.userSession;
        }else{
            console.error("Unable to log user in:", response);
            return null;
        }
        
    } catch (error) {
        console.error("Error when trying to invoke login request:", error);
        return null;
    }
    
}

/**
 * sends request to register user
 *  with registration form data
 * @param {*} userData 
 * @returns user session
 */
async function invokeBasicRegister(userData) {
    if (!userData) return null;

    try {
        // send auth request to server
        const response = await API.post(`/api/auth/basic/register`, { credentials: userData });

        // check for status
        if (response.status != 200){
            console.error("Unable to make request:", response);
            return null;
        }
     
        // handle success
        if (response.status == 200){
            // sends back to jsx file I assume to be setUser context
            return response.userSession;
        }else{
            console.error("Unable to register user:", response);
            return null;
        }
        
    } catch (error) {
        console.error("Error when trying to invoke register request:", error);
        return null;
    }
}

