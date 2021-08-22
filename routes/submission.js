const express = require("express");
const {postSubmission,getSubmissions} = require("../controller/submission");

const router = express.Router();

router.post("/",postSubmission);
router.get("/",getSubmissions);
// router.get("/status",submissionStatus);

module.exports = router;