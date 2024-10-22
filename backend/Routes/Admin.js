
const express = require("express"); 
const authMiddleware = require("../Middleware/authMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");
const router = express.Router();   
const zod = require("zod");
const User = require("../Model/User");
const Event = require("../Model/Event"); 
const Feedback = require("../Model/Feedback");


router.get("/event/feedback/:eventId",authMiddleware,adminMiddleware,async(req,res)=>{
    const feedbacks = await Feedback.find({eventId:req.params.eventId}).populate({
        path:"userId", 
        select:["firstName"]
    }); 
    res.json({
       feedbacks
    })
})
router.get("/event/:id",authMiddleware,adminMiddleware,async(req,res)=>{
    const eventId = req.params.id; 
    const events = await Event.findById(eventId).populate({
        path:"registeredUser", 
        select:["firstName","email","lastName"]
    }); 
    res.json({
        events
    })
})
const eventSchema = zod.object({
    title:zod.string(), 
    description:zod.string(), 
    date:zod.string().date()
})
router.post("/event",authMiddleware,adminMiddleware,async(req,res)=>{
   const eventInput = req.body; 
   const result = eventSchema.safeParse(eventInput); 
   if(!result.success){
     return res.status(400).json({
        msg:"invalid input"
     })
   } 
   const user = await User.findOne({email:req.email}); 
   const adminId=user._id;    
   const event = await Event.create({
    title:eventInput.title, 
    description:eventInput.description, 
    date:eventInput.date, 
    createdBy:adminId
   })
   res.json({
    msg:"event created successfully", 
    event
   })

}) 

router.get("/events",authMiddleware,adminMiddleware,async(req,res)=>{   
    const events = await Event.find({}).populate({
        path:"registeredUser", 
        select:["firstName","email","lastName"]
    });
    return res.json({
        events
    })
}) 

module.exports=router;