const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtKey = 'toddle_virtual@123'; //JWT SECRET

const signin = async (req,res)=>{
    const {username,password,userType}=req.body;
    if(!username||!password||!userType){
        return res.status(301).json({msg:"Required All Fields"});
    }
   
    if(userType!== "STUDENT" && userType!=="TUTOR"){
        return res.status(301).json({msg:"Invalid user type, it should be 'STUDENT' or 'TUTOR' "});
    }
    const passwordHashed = await bcrypt.hash(password,10);
    await User.create({username,userType,password:passwordHashed},(error,object)=>{
        if(error){
            console.log("SIGNIN_ERROR:",error);
            if(error.code===11000){
                const token = jwt.sign({username,userType},jwtKey);
                return res.status(200).json({msg:'SUCESS',token});
            }
            return res.status(301).json({msg:"Something Went Wrong"});
        }else{
             const token = jwt.sign({username,userType},jwtKey);
             return res.status(200).json({msg:'SUCESS',token});
        }
    })
}

module.exports = {signin};