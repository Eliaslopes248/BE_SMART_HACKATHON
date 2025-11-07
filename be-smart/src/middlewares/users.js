// //======================================
// // Fetch Crud
// import * as API from "../utils/api.js"

// // User types set
// export const USER_TYPES = new Set(['RESIDENT', 'DEVELOPER', 'OFFICIAL']);

// // Or if you prefer an array constant:
// // export const USER_TYPES = ['RESIDENT', 'DEVELOPER', 'OFFICIAL'];

// /***
//  * 
//  *  - get all users
//  *  - get user(s) by type RESIDENT, DEVELOPER, OFFICIAL-post request
//  *  - get user by id
//  *  - gte user by tag (@first-last)
//  * 
//  * 
//  * 
//  * 
//  */
// export async function getAllUsers(){
//     try{
//         const response = await API.post("/api/users");
//             return response.data;

//         if (response.status != 200){
//             console.error("Error fetching all users:", response);
//             return null;
//         }

//         return Array.isArray(response.data) ? response.data : [];

//     }catch(error){
//         console.error("Error fetching all users:", error);
//         return null;
//     }
// }

// export async function getUserByType(type){

//     if (!type || !USER_TYPES.has(type.toUpperCase())) {
//         console.error(`Invalid user type. Must be one of: ${Array.from(USER_TYPES).join(', ')}`);
//         return [];
//     }

//     try{
//         const response = await API.post("/api/users/type", { type: type.toUpperCase() });

//         if (response.status != 200){
//             console.error("Error fetching user by type:", response);
//             return [];
//         }

//         return Array.isArray(response.data) ? response.data : [];

//     }catch(error){
//         console.error("Error fetching user by type:", error);
//         return [];
//     }
// }

// export async function getUserById(id){
//     try{
//         const response = await API.post("/api/users/id")
//         if (response.status != 200){
//             console.error("Error fetching user by type:", response);
//             return [];
//         }

//         return response.data
//     }
//     catch(error){
//         console.error("Error fetching user by id:", error);
//         return null;
//     }
// }

// export async function getByUserTag(tag){
//     if (!tag) return null;
//     try{
//         const response = await API.post(`/api/users/`)
//         if (response.status != 200){
//             console.error("Error fetching user by tag:", response);
//             return null;
//         }

//         return response.data || null;

//         }catch(error){
//             console.error("Error fetching user by tag:", error);
//             return null;
//     }
// }