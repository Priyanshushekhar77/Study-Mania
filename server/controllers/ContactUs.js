// const { contactUsEmail} = require("../mail/templates/contactFormRes")
// const mailSender = require("../utils/mailSender")

// exports.contactUsController = async(req,res) => {
//       const{ email, firstname, lastname, message,phoneNo,countrycode} = req.body
//       console.log(req.body)
//       try{
//         const emailRes = await mailSender(
//             email,
//             "Your Data Sent Successfully",
//             contactUsEmail(email, firstname, lastname, message,phoneNo,countrycode)

//         )
//         console.log("email response",emailRes)
//         return res.json({
//             success: true,
//             message:"Email Sent Successfully"
//         })
//       }
//       catch(error){
//         console.log("error",error)
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//       }
// }