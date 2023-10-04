const User = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();





//sendOTP
exports.sendotp = async (req, res) =>  {

    try {
        //fetch email from request ki body
        const {email} = req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({email});

        ///if user already exist , then return a response
        if(checkUserPresent) {
            return res.status(401).json({
                success:false,
                message:'User already registered',
            })
        }

        //generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        

        //check unique otp or not
        const result = await OTP.findOne({otp: otp});

        console.log("OTP generated: ", otp );
        console.log("result: ", result);

        while(result) {
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};

        //create an entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log("otpbody:", otpBody);

        //return response successful
         return res.status(200).json({
            success:true,
            message:'OTP Sent Successfully',
            otp,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }


};

//signUp
exports.signUp = async (req, res) => {
    try {

        //data fetch from request ki body
        const {
            firstName,
            lastName, 
            email,
            contactNumber,
            password,
            confirmPassword,
            accountType,
            otp,
        } = req.body;
        //validate krlo
        if(!firstName || !lastName || !email || !contactNumber || !password || !confirmPassword ||!accountType
            || !otp) {
                return res.status(403).json({
                    success:false,
                    message:"All fields are required",
                })
        }


        //2 password match krlo
        if(password !== confirmPassword) {
            return res.status(400).json({
                success:false,
                message:'Password and ConfirmPassword Value does not match, please try again',
            });
        }

        //check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success:false,
                message:'User is already registered',
            });
        }

        //find most recent OTP stored for the user with the help of email
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1); //togetotp=>recentOtp.otp
        console.log(recentOtp);
        //validate OTP
        if(recentOtp.length == 0) {
            //OTP not found
            return res.status(400).json({
                success:false,
                message:'OTP not Found',
            })
        } else if(otp !== recentOtp[0].otp) {
            //Invalid OTP
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            });
        }


        //Hash password  using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

        //entry create in DB initially
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth: null,
            about:null,
            contactNumer:null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType:accountType,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastName}`,
        })

        //return res
        return res.status(200).json({
            success:true,
            message:'User is registered Successfully',
            user,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registrered. Please try again",
        })
    }

}

//Login controller for auth. user
exports.login = async (req, res) => {
    try {
        //get data from req body
        const {email, password} = req.body;
        // validation data
        if(!email || !password) {
            return res.status(403). json({
                success:false,
                message:'All fields are required, please try again',
            });
        }
        //user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails");//YE ADDITIONAL DETAILS SATH ME AA JAYEGA
        //if user not found
        if(!user) {
            return res.status(401).json({
                success:false,
                message:"User is not registrered, please signup first",
            });
        }
        //generate JWT token, after password matching
        if(await bcrypt.compare(password, user.password)) {

            // const token = jwt.sign(
			// 	{ email: user.email, id: user._id, role: user.role },
			// 	process.env.JWT_SECRET,
			// 	{
			// 		expiresIn: "24h",
			// 	}
			// );


            const payload = {
                email: user.email,
                id: user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            });
            user.token = token;
            user.password= undefined;

            //create cookie and send response
            const options = {
                expires: new Date(Date.now() + 1*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'Logged in successfully',
            })

        }
        else {
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            });
        }
        
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure, please try again',
        });
    }
};


//controller for changing password
exports.changePassword = async (req, res) => {
    try{
         //get data from req body
    const {email} = req.body;
    const validUser = await User.findOne({email});
    if(!validUser){
        return res.status(401).json({
            success:false,
            message:"User is not registrered, please signup first",
        });
    }
    //get oldPassword, newPassword, confirmNewPassowrd
    const {oldPassword, newPassword, confirmNewPassowrd} = req.body;

    //validation
    if(!oldPassword || !newPassword || !confirmNewPassowrd){
        return res.status(403). json({
            success:false,
            message:'All fields are required, please try again',
        });
    }

    // Match new password and confirm new password
		if (newPassword !==confirmNewPassowrd) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}


    //another mathod

    //  Get user data from req.user by finding;
		const userDetails = await User.findById(req.user.id);

	// 	 Get old password, new password, and confirm new password from req.body
	// 	const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}



    //update pwd in DB
    const updatedPassword = await bcrypt.hash(newPassword, 10);
    const updatedDetails = await User.findOneAndUpdate(
      //  {email:email},email ke according search kye hai
         req.user.id,//req.user.id ke according find kiye hai phir update kiye;
       {password:updatedPassword},
    
        {new:true});//isse updatied document return honge response me


    //send notification mail - Password updated
    try{
   const emailResponse =  await mailSender(
        updatedDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
            updatedDetails.email,
            `Password updated successfully for ${ updatedDetails.firstName} ${ updatedDetails.lastName}`
        )
   );
        console.log("Email sent successfully:", emailResponse.response);
       
        
   }
//return response
catch (error) {
    // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while sending email:", error);
    return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
    });
}

// Return success response
return res
    .status(200)
    .json({ success: true, message: "Password updated successfully" });
} catch (error) {
// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
console.error("Error occurred while updating password:", error);
return res.status(500).json({
    success: false,
    message: "Error occurred while updating password",
    error: error.message,
});
}
       
    
 

};