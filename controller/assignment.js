const { v4: uuidv4 } = require("uuid");
const Assignment = require("../models/Assignments");
const {decodeToken} = require("./decodeToken");
const {sendNotification} = require("./notifications");

// Tutor can create add new assignment  
const addAssignment = async (req,res)=>{
    const user = await decodeToken(req.headers);
    if(user.username===undefined){
        return res.status(401).json({msg:user}); 
    }
    if(user.userType!=="TUTOR"){
        return res.status(401).json({msg:"Unothorized"});
    }
    const {description,students,publishedAt,deadlineDate} = req.body;
    if(!description || !students||!publishedAt||!deadlineDate){
        return res.status(401).json({msg:"Required All Fileds"});
    }
    if(students.leangth==0){
        return res.status(401).json({msg:"Enter student list in ex.: ['abc@abc.com','xyz@xyz.com']"});
    }
    await Assignment.create({
        assignmentBy:user.username,
        students,
        description,
        publishedAt:new Date(publishedAt),
        deadlineDate:new Date(deadlineDate),
    },(error,assignment)=>{
        if(error){
            console.log("ADD_ASSIGNMENT_ERROR: ",error);
            return res.status(403).json({msg:"Something Went Wrong"});
        }else{
            let message = `Hello, \n \tyour tutor ${user.username} has scheduled an assignment from ${publishedAt} please check toddle for further information.\nRegards,\nToddle Team \nvisit https://www.toddleapp.com/ for more information`; 
            sendNotification(students,"New Assignment(Toddle)",message);
            return res.status(200).json({msg:"SUCESS"});
        }
    })
};

const getAssignment = async (req,res)=>{
    const user = await decodeToken(req.headers);
    if(user.username===undefined){
        return res.status(401).json({msg:user}); 
    }

    if(user.userType!=="TUTOR" &&user.userType!="STUDENT"){
        return res.status(401).json({msg:"Unothorized"});
    }
    if(user.userType ==="TUTOR"){
        await Assignment.find({ assignmentBy: user.username },{
            "description":1,
            "publishedAt":1,
            "deadlineDate":1,
            "students":1,
            "_id": 1
        },(error,object)=>{
            if(error){
                console.log("TUTOR_GET_ASSIGNMENT_ERROR: ",error);
                return res.status(403).json({msg:"Something Went Wrong"});
            }else{
                const feed = object.map(item => {
                    const op ={};
                    op._id=item._id,
                    op.description = item.description;
                    op.deadlineDate = item.deadlineDate;
                    op.publishedAt = item.publishedAt;
                    if(item.publishedAt>new Date()){        //Assigning assignment status based on published date 
                        op.status = "SCHEDULED";
                    }else{
                        op.status = "ONGOING";
                    }
                    return op
                })

                if(req.body.publishedFilter==="ONGOING" ||req.body.publishedFilter==="SCHEDULED" ){
                    const filter = feed.filter(publishFilter)
                    function publishFilter(curr) {
                        return curr.status == req.body.publishedFilter;
                    }
                    return res.status(200).json({msg:filter});
                }
                return res.status(200).json({msg:feed});
            }
        })
    }else{
        await Assignment.find({ students: user.username },{
            "description":1,
            "publishedAt":1,
            "deadlineDate":1,
            "_id": 1},
            (error,object)=>{
            if(error){
                console.log("STUDENT_GET_ASSIGNMENT_ERROR: ",error);
                return res.status(403).json({msg:"Something Went Wrong"});
            }else{
                const feed = object.map(item => {
                    const op ={};
                    op._id=item._id,
                    op.description = item.description;
                    op.deadlineDate = item.deadlineDate;
                    op.publishedAt = item.publishedAt;
                   
                    if(item.publishedAt>new Date()){
                        op.status = "SCHEDULED";
                    }else{
                        op.status = "ONGOING";
                    }
                return op;
                })
                if(req.body.publishedFilter==="ONGOING" ||req.body.publishedFilter==="SCHEDULED" ){
                    const filter = feed.filter(publishFilter)
                    function publishFilter(curr) {
                        return curr.status == req.body.publishedFilter;
                    }
                    return res.status(200).json({msg:filter});
                }
                return res.status(200).json({msg:feed});
            }
        })
    }
}

const updateAssignment = async(req,res) =>{
    const user = await decodeToken(req.headers);
    if(user.username===undefined){
        return res.status(401).json({msg:user}); 
    }

    if(user.userType!=="TUTOR"){
        return res.status(401).json({msg:"Unothorized"});
    }
    const {assignment,description,students,publishedAt,deadlineDate} = req.body;
    
    if(!assignment||!description || !students||!publishedAt||!deadlineDate){
        return res.status(401).json({msg:"Required All Fileds"});
    }
    await Assignment.find({  _id:assignment  },async(error,object)=>{
        if(error){
            return res.status(200).json({msg:"Error"});
        }else{
            if(object[0].assignmentBy === user.username){ 
                await Assignment.updateOne({ _id:assignment },{$set:{
                    description,
                    students,
                    publishedAt,
                    deadlineDate
                }},(error,object)=>{
                    if(error){
                        return res.status(200).json({msg:"Error"});
                    }else{
                        return res.status(200).json({msg:"Updated"});
                    }
            })
        }else{
            return res.status(401).json({msg:"Unothorized"});
        }
        }
    })
   
}

const deleteAssignment = async(req,res) =>{
    const user = await decodeToken(req.headers);
    if(user.username===undefined){
        return res.status(401).json({msg:user}); 
    }
    
    if(user.userType!=="TUTOR"){
        return res.status(401).json({msg:"Unothorized"});
    }
    const {assignment}=req.body;
    await Assignment.find({  _id:assignment  },async(error,object)=>{
        if(error){
            return res.status(200).json({msg:"Error"});
        }else{
            if(object[0].assignmentBy === user.username){
                await Assignment.deleteOne({ _id:assignment },(error,object)=>{
                    if(error){
                        return res.status(200).json({msg:"Error"});
                    }else{
                        return res.status(200).json({msg:"Deleted"});
                    }
            })
        }else{
            return res.status(401).json({msg:"Unothorized"});
        }
        }
    })
}

module.exports = {addAssignment,getAssignment,deleteAssignment,updateAssignment};