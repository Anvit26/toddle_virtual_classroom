const Submission = require("../models/Submission");
const Assignment = require("../models/Assignments");
const {decodeToken} = require("./decodeToken");

const postSubmission = async (req,res)=>{
    const {assignment,remark} = req.body;
    if(!assignment){
        return res.status(401).json({msg:"Required All Fileds"});
    }
    const user = await decodeToken(req.headers);
    if(user.username===undefined){
        return res.status(401).json({msg:user}); 
    }
    if(user.userType!=="STUDENT"){
        return res.status(401).json({msg:"Unothorized"});
    }
    // checks validity of assignmets of students submission
    await Assignment.find({ students: user.username,_id:assignment },{"_id":1,"publishedAt":1,"deadlineDate":1},
    async (error,object)=>{
        if(error){
            return res.status(200).json({msg:"Something went wrong...!"});
        }
        if(new Date()<object.publishedAt){
            return res.status(200).json({msg:"Assignment is not published yet it is only schedule"});
        }
        if(new Date()>object.deadlineDate){
            return res.status(200).json({msg:"You miss deadline of assignment... Now you can not submit assignment."});
        }
        if(object.length==0){
            return res.status(200).json({msg:"You are not assigned this assignment..."});
        }
        await Submission.create({
        assignment,remark,studentId:user.username
    },(error,submission)=>{
        if(error){
            if(error.code===11000){
                return res.status(200).json({msg:"You Alredy Submitted Assignment...You Can Not Submit...!"});
            }
            return res.status(403).json({msg:"Something Went Wrong"});
        }else{
                return res.status(200).json({msg:"SUCESS"});
            }
        })
    })
};

const getSubmissions = async (req,res)=>{
    const user = await decodeToken(req.headers);
    if(user.username===undefined){
        return res.status(401).json({msg:user}); 
    }
    if(user.userType ==="TUTOR"){
        // Get assignmetsID from assignment collection where tutor is author 
        await Assignment.find({ assignmentBy: user.username },{"_id":1},
        async(error,object)=>{
            if(error){
                return res.status(403).json({msg:"Something Went Wrong"});
            }else{
                const assignmentId = [];
            object.map(curr=>{assignmentId.push(curr._id);})
            // Get all assignments with the given assignmentId
            await Submission.find({assignment: { $in: assignmentId}},  
                (error,object)=>{
                if(error){
                    return res.status(403).json({msg:"Something Went Wrong"});
                }else{
                    return res.status(200).json({msg:object});
                }
            })
            }
        });
    }else{
    const {query} = req.body;
    // Get all assignments assighened to that student
    await Assignment.find({ students: user.username },{"_id":1,"description":1,"publishedAt":1,"deadlineDate":1},
        async(error,object)=>{
        if(error){
            return res.status(403).json({msg:"Something Went Wrong"});
        }else{
            const ass = [];
            object.map(curr=>{ass.push(curr._id);})
            // Get submissions for assignments with assignmentID of student
            await Submission.find({assignment: { $in: ass},studentId:user.username},  
                (error,object1)=>{
                    if(error){
                        return res.status(403).json({msg:"Something Went Wrong"});
                    }else{
                        const assignmentRes = JSON.parse(JSON.stringify(object));
                        const submissionStudent=[];
                            object1.map(item => {
                            const search = assignmentRes.find((curr) => {
                                const resObj ={};
                                if(curr._id === item.assignment){
                                    resObj.assignment=item.assignment;
                                    resObj.publishedAt = curr.publishedAt;
                                    resObj.description = curr.description;
                                    resObj.deadlineDate = curr.deadlineDate;
                                    resObj.remark = item.remark;
                                    resObj.studentId = item.studentId;
                                    resObj.status = "SUBMITTED";
                            }
                            submissionStudent.push(resObj);
                            return 
                        });
                        return search;
                    })
                    // mapping the assignments which are not assigned
                    assignmentRes.map(item => {
                        const search = submissionStudent.find((curr) => {return curr.assignment ===item._id})
                        if(search ==undefined){
                            const resObj ={};
                            resObj.assignment = item._id;
                            resObj.description = item.description;
                            if(new Date(item.deadlineDate)>new Date()){
                                resObj.status = "PENDING";
                            }else{
                                resObj.status = "OVERDUE";
                            }
                            submissionStudent.push(resObj);
                        }
                  
                    })
                    //Filter response accoring to query
                    const result = submissionStudent.filter((curr) =>{
                        if(query === "SUBMITTED"){
                            return(curr.status === "SUBMITTED");
                        }
                        if(query === "PENDING"){
                            return(curr.status === "PENDING");
                        }
                        if(query === "OVERDUE"){
                            return(curr.status === "OVERDUE");
                        }
                        return(curr.status === "SUBMITTED"||curr.status === "PENDING"||curr.status === "OVERDUE");
                    });
                    return res.status(200).json({msg:result});
                }
            });
        }
    })
    }
};

module.exports = {postSubmission,getSubmissions};