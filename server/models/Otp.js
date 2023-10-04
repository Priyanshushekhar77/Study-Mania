const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
	// Create a transporter to send emails

	// Define the email options

	// Send the email
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
// const mongoose = require("mongoose");
// const mailSender = require("../utils/mailSender");
// const emailTemplate = require("../mail/templates/emailVerificationTemplate");
// const OtpSchema = new mongoose.Schema({
//     email:{
//         type:String,
//         required:true,
//     },
//     otp:{
//         type:String,
//         required:true,
//     },
//     createdAt:{
//         type:Date,
//         default:Date.now(),
//         expires: 5*60, //automatically deleted after 5 min
//     }
// });

// //  apke user ke db me entry save hone se phle otp jayega mail pe aur agr otp sahi hui toh db me entry hogi
// // use of pre middlewares 
// // otp wale model ke under mail send ka code likh dete hai ->ffrom nodemailer utils code to here

// //function ->to sending emails
// async function sendVerificiationEmail(email,otp){
//     try{
//       const mailResponse = await mailSender(email,"Verification Email from Study-Mania",emailTemplate(otp));
//       console.log("Email sent Successfully",mailResponse);
//     }
//     catch{
//          console.log("error occurred while sending mail");
//          throw error;
//     }
// }
// // document save hone se phle ek verificiation mail jayega ,uske verify baad aage jayenge aur db me store hoga
// //defining a post save hook to send email after the document has been saved
// OtpSchema.pre("save", async function(next){
//     console.log("New document saved to db");

//     //only send an email when a new document is created
//     if(this.isNew){
//     await sendVerificiationEmail(this.email, this.otp);
//     }
//     next();
// });

// module.exports = mongoose.model("Otp",OtpSchema);

