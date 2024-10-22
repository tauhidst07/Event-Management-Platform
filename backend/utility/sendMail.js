
const nodemailer = require("nodemailer"); 
 
require("dotenv").config();
const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com', 
    auth:{
        user:process.env.EMAIL, 
        pass:process.env.EMAIL_PASS
    }
})

const emailSender = async(mailInfo)=>{
   const info = await transporter.sendMail({
      from:process.env.EMAIL, 
      to:mailInfo.receiver, 
      subject:mailInfo.subject, 
      html:mailInfo.message
   })
} 

module.exports=emailSender;