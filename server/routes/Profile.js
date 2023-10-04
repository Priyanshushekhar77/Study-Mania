const express=require("express");
const router=express.Router();

//importing controllers
const{auth} = require("../middlewares/auth")
const{deleteAccount, updateProfile,getAllUserDetails,updateDisplayPicture,getEnrolledCourses} = require("../controllers/Profile")

//profile routing
router.delete("/deleteProfile",auth,deleteAccount)
router.put("/updateProfile",auth,updateProfile)
router.get("/getUserDetails",auth,getAllUserDetails)
//getenrolled course
router.get("/getEnrolledCourses",auth,getEnrolledCourses)
router.put("/updateDisplayPicture",auth,updateDisplayPicture)

module.exports = router