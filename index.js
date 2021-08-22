const express = require("express");
const mongoose = require("mongoose");
const dbkey = require("./keys");
const info = require("./info.json");

// Routes
const assignment = require('./routes/assignment');
const user = require('./routes/user');
const submission = require('./routes/submission');

const app = express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Mongodb connection
mongoose.connect(dbkey.DB_URL,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex:true,
});
app.get("/",(req,res)=>{
    return res.status(200).json(info);
})

app.use("/signin",user);            //Sign in  routes for user signin
app.use("/assignment",assignment);  //POST:- / (add assignment) GET:- /(get assignment)(student,tutor) DELETE:- / (delete assignment)PUT:- / (update assignment)
app.use("/submission",submission);  //POST:- /submission (add submission) GET:- /submission (get sublission)

app.all('*',(req,res)=>{
    res.status(404).json("Page Not Found...!!")
});

const PORT = process.env.PORT ||5000;
app.listen(PORT,()=>{
    console.log(`application running on ${PORT}`);
})