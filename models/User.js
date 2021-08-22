const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        userType:{type:String,required:true,default:"STUDENT"}
    },
    {collection:'users'},{upsert:true}
);

const model = mongoose.model('users',UserSchema);

module.exports = model;
