const express = require("express");
const {addAssignment,getAssignment,updateAssignment,deleteAssignment} = require("../controller/assignment");

const router = express.Router();

// Add new assignment (protected tutor)
router.post("/",addAssignment);

// Get Assignment (protected tutor,student)
router.get("/",getAssignment);

// Update Assignment (protected tutor)
router.put("/",updateAssignment);

// Delete Assignment (protected tutor)
router.delete("/",deleteAssignment);

module.exports = router;