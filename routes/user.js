const express =  require("express");
const {signin} = require("../controller/signin");

const router = express.Router();

router.post("/",signin);

module.exports = router;