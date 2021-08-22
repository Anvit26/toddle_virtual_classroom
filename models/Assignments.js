const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema(
    {
        description:{type:String,required:true},
        assignmentId:{type:String,required:false},
        publishedAt:{type:Date,require:true},
        deadlineDate:{type:Date,require:true},
        students:[{type:String}],
        assignmentBy:{type:String,required:true},
    },
    {collection:'assignments'}
)

const model = mongoose.model('assignments',AssignmentSchema);

module.exports = model;