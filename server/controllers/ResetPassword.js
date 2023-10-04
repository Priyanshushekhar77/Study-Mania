const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


//resetPasswordToken
//resetpasswordtoken =>reset ke liye mail send krega link ke sath
exports.resetPasswordToken = async (req, res) => {
    try {
        //get email from req body new method
        const email = req.body.email;
        //check user for this email , email validation
        const user = await User.findOne({email: email});
        if(!user) {
            return res.json({success:false,
            message:'Your Email is not registered with us'
        });
        }
        //generate token 
        // const token  = crypto.randomUUID();
        const token = crypto.randomBytes(20).toString("hex");
        //update necessary user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
                                        {email:email},//email ke according search kye hai
                                        {
                                            token:token,//add kiye hai indono ko db me
                                            resetPasswordExpires: Date.now() + 3600000,
                                        },
                                        {new:true});//isse updatied document return honge response me
        //create url
        const url = `http://localhost:3000/update-password/${token}`
        //send mail containing the url
        await mailSender(email, 
                        "Password Reset Link",
                        `Password Reset Link: ${url}`);
        //return response
        return res.json({
            success:true,
            message:'Email sent successfully, please check email and change password',
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset password link'
        })
    }  
}


//reset password =>jo update hoke db me store hoga new password 
//resetPassword\

exports.resetPassword = async (req, res) => {
    try {
          //data fetch
        const {password, confirmPassword, token} = req.body;
        //validation
        if(password !== confirmPassword) {
            return res.json({
                success:false,
                message:'Password not matching',
            });
        }
        //get userdetails from db using token
        const userDetails = await User.findOne({token: token});
        //if no entry - invalid token
        if(!userDetails) {
            return res.json({
                success:false,
                message:'Token is invalid',
            });
        }
        //token time check 
        if( userDetails.resetPasswordExpires > Date.now()  ) {
                return res.json({
                    success:false,
                    message:'Token is expired, please regenerate your token',
                });
        }
        //hash pwd
        const hashedPassword = await bcrypt.hash(password, 10);

        //password update
        await User.findOneAndUpdate(
            {token:token},//finding using token;
            {password:hashedPassword},
            {new:true},
        );
        //return response
        return res.status(200).json({
            success:true,
            message:'Password reset successful',
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset pwd mail'
        })
    }
}