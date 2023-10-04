const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");
//configuring dotenv to load environment variable from .env file
dotenv.config();
//auth
exports.auth = async(req,res,next) => {
    try{
       //token extracting multiple methods
       const token = req.cookies.token 
       || req.body.token 
       || req.header("Authorisation").replace("Bearer ", "");//good 

//if token missing, then return response
         if(!token) {
          return res.status(401).json({
          success:false,
          message:'TOken is missing',
            });
          }

          //verifying the token 
          try{
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode; //request ke under role ko add kar diya hai user ke sath kyki decode ke pas token hai
          }
          catch(err){
             //verification - issue
             return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
          }
          next();

    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}

//isstudent
exports.isStudent = async (req, res, next) => {
    try{
        //const userDetails=await User.findOne({email:req.user}); if accounttype is not passed with token 
           if(req.user.accountType !== "Student") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Students only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }



//isinstructor

exports.isInstructor = async (req, res, next) => {
    try{
         //const userDetails=await User.findOne({email:req.user}); if accounttype is not passed with token 
           if(req.user.accountType !== "Instructor") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Instructor only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }

//isAdmin

exports.isAdmin = async (req, res, next) => {
    try{
           if(req.user.accountType !== "Admin") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Admin only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }
