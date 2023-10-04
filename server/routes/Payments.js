const express=require("express");
const router=express.Router();
//importing controllers
const{capturePayment, verifySignature} = require("../controllers/Payments")
const{auth,isInstructor,isAdmin,isStudent} = require("../middlewares/auth")

//routing
router.post("/capturePayment",auth,isStudent,capturePayment)
router.post("/verifySignature",verifySignature)

module.exports=router
