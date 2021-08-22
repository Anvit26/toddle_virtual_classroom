const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
    {
        studentId:{type:String,required:true},
        assignment:{type:String,required:true},
        remark:{type:String,required:false}
    },
    
    {collection:'submission'}
);
SubmissionSchema.index({ studentId: 1, assignment: 1 }, { unique: true })

const model = mongoose.model('submission',SubmissionSchema);

module.exports = model;
