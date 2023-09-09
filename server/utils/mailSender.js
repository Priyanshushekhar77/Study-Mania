const nodemailer = require("nodemailer");

const mailSender = async(email,title,body) => {
    try{
        // CREATING TRANSPORTER 
         let transporter= nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
         })
        //  MAIL SEND KARTE HAI 
        let info= await transporter.sendMail({
            from: 'Study-Mania => study with Priyanshu',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log(info);//printing
        return info; //optional
    }
    catch{
        console.log(error.message);
    }
}
module.exports = mailSender;