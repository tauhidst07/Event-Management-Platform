
const express = require("express"); 
const authMiddleware = require("../Middleware/authMiddleware");
const Event = require("../Model/Event");
const User = require("../Model/User");
const Feedback = require("../Model/Feedback");
const emailSender = require("../utility/sendMail");
const router = express.Router(); 


router.post("/event/feedback",authMiddleware,async(req,res)=>{
    const user = await User.findOne({email:req.email}); 
    const eventId=req.body.eventId;   
    console.log("eventId ",eventId); 
    console.log("userId",user._id);
    const isRegistered= await Event.findOne({_id:eventId,registeredUser:{$in:[user._id]}});  
    console.log(isRegistered);
    if(!isRegistered){
        return res.status(403).json({
            msg:"can't add feedback user is not registered"
        })
    }
    const feedback = await Feedback.create({
        eventId:eventId, 
        userId:user._id, 
        rating:req.body.rating, 
        comment:req.body.comment
    }) 
    res.json({
        msg:"feedback added", 
        feedback
    }
    )
})
router.post("/event/register",authMiddleware,async(req,res)=>{
    const user = await User.findOne({email:req.email});  
    console.log("user ",user)
    const eventId=req.body.eventId; 
    const event = await Event.findById(eventId); 
    if(!event){
        return res.status(400).json({
            msg:"event not found"
        })
    }  
    const alreadyRegistered = await Event.findOne({
        _id:eventId, 
        registeredUser:{$in:[user._id]}
    }) 
    if(alreadyRegistered){
        return res.status(403).json({
            msg:"user already regitered with event"
        })
    }
    await Event.findByIdAndUpdate(eventId,{
        $push:{registeredUser:user._id}
    });   
    const admin = await User.findById(event.createdBy); 
    const mailInfo={
        receiver:admin.email, 
        subject:`Registration Notification`, 
        message:`<div>
               <h1> ${user.firstName} has been registered in ${event.title}</h1>
               <h2> user info </h2> 
               <div>   
                 <p> Name: ${user.firstName} ${user.lastName}</p> 
                 <p> email: ${user.email} </p>
               </div>
        </div>
        `
    } 
    try{
        await emailSender(mailInfo); 
        res.json({
            msg:"user registered in event"
        })
    }
    catch(err){
        res.json(500).json({
            msg:"internal server error"
        })
    }
  
}) 

router.post("/event/unregister",authMiddleware,async(req,res)=>{
    const eventId=req.body.eventId; 
    const user =await  User.findOne({email:req.email});  
    const isRegistered = await Event.findOne({
        _id: eventId,
        registeredUser: { $in: [user._id] }
      });
      if (!isRegistered) {
        return res.status(400).json({ msg: "User not registered for this event" });
      } 
   const event = await Event.findByIdAndUpdate(eventId,{
        $pull:{registeredUser:user._id}
    })  
    const admin = await User.findById(event.createdBy); 
    const mailInfo={
        receiver:admin.email, 
        subject:`Registration Notification`, 
        message:`<div>
               <h1> ${user.firstName} has unregister from  ${event.title}</h1>
               <h2> user info </h2> 
               <div>   
                 <p> Name: ${user.firstName} ${user.lastName}</p> 
                 <p> email: ${user.email} </p>
               </div>
        </div>
        `
    } 
    try{
        await emailSender(mailInfo); 
        res.json({
            msg:"user has been unregistered"
        })
    } 
    catch(err){
        res.status(500).json({
            msg:"internal server error"
        })
    }
    
}) 
router.get("/registeredEvents",authMiddleware,async(req,res)=>{
    const user = await User.findOne({email:req.email});  
    const events=await Event.find({
        registeredUser:{$in:[user._id]}
    }).select(["id","title","date","createdBy"]).populate({
        path:"createdBy", 
        select:["firstName","lastName","email"]
    }) 
    return res.json({
        events
    })
})
router.get("/events",authMiddleware,async(req,res)=>{  
    const events = await Event.find({}).select(["_id","title","date","createdBy"]).populate({
        path:"createdBy", 
        select:["firstName","lastName","email"]
    })
           
    return res.json({
        events
    })
}) 

module.exports=router;