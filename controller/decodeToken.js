// This function will going to decode the jwt token and return decoded token,
// which contains username and userType field

const jwt = require('jsonwebtoken');

const jwtKey = 'toddle_virtual@123'; //JWT SECRET

const decodeToken = (headers) =>{
    const token = headers['authorization'];
    if(token===undefined){
        return ("Error: Missing Token");
    }
    const tokenBody = token.slice(7);

    return new Promise((resolve,reject)=>{
        jwt.verify(tokenBody,jwtKey,(err,decoded)=>{
            if(err){
                console.log(`JWT Error: ${err}`);
                reject("Error: Access Denied");
            }
            resolve(decoded);
        }); 
    })
}
module.exports = {decodeToken};