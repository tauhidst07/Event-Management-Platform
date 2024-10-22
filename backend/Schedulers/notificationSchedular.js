const cron = require("node-cron");
const Event = require("../Model/Event");
const emailSender = require("../utility/sendMail");
const notificationSchedular = async()=>{
    cron.schedule('0 0 * * *',async()=>{
         const now = new Date(); 
         const in24hr =new Date(now); 
         in24hr.setHours(now.getHours()+24); 

         const events=await Event.find({
            date:{$gte:now,$lte:in24hr}, 
            registeredUser:{$exists:true,$ne:[]}
         }).populate({
            path:'registeredUser', 
            select:['firstName','email']
         });  
        console.log(events); 
        events.forEach((event)=>{
            event.registeredUser.forEach(async(user)=>{
                const mailInfo={
                    receiver:user.email, 
                    subject:"Event notification", 
                    message: `<div>
                    <h1>Hi ${user.firstName},</h1>
                    <p>This is a reminder for the event "${event.title}" happening on ${event.date}.</p>
                  </div>`
                } 
                await emailSender(mailInfo);

            })
        })
    
    },{
        scheduled:true, 
        timezone:'Asia/Kolkata'
    })
} 

module.exports=notificationSchedular;