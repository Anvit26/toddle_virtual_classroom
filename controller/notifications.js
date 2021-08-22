const aws = require('aws-sdk');
const ak = require('../keys');
// const ses = new aws.SES({accessKeyId:ak.accessKeyId,secretAccessKey:ak.secretAccessKey,region:'ap-south-1'});
const ses = new aws.SES({region:'ap-south-1'});

// Send Quick Text Mail
const sendNotification = (mailList,subject,message) =>{
    textMail(mailList,subject,message);
    return ;
}
// Send Text Mail
const textMail = (mailList,subject,message) =>{
    let params ={
        Destination:{
            ToAddresses:mailList
        },
        Source:"daveanvit@gmail.com",
        Message: {
            Body: {
             Text: {Charset: "UTF-8", Data: message}
            }, 
            Subject: {Charset: "UTF-8",Data: subject}
           }, 
    };
    ses.sendEmail(params,(error,data)=>{
        if(error){
            console.log("SEND_MAIL_ERROR: ",error);
        }else{
            console.log("SEND_MAIL_DATA: SUCESS");
        }
    });
}

module.exports = {sendNotification};