const express=require("express")
const router = express.Router()

// importing controllers and middlewares
const{login,signup,sendotp,changePassword} = require("../controllers/Auth")

const{resetPasswordToken,resetPassword} = require("../controllers/ResetPassword")

const{auth} = require("../middlewares/auth")

//routes for login signuo and authentication

router.post("/login",login)

router.post("/signup",signup)

router.post("/sendotp",sendotp)

router.post("/changePassword",auth,changePassword)

// routes for reset password

router.post("reset-password-token",resetPasswordToken)

router.post("reset-password",resetPassword)

// exports the router to use in main applocation indexed.js
module.exports=router;