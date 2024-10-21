
const express = require("express"); 
const authMiddleware = require("../Middleware/authMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");
const router = express.Router();   
const zod = require("zod");
const User = require("../Model/User");
const Event = require("../Model/Event");

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
    const user = await User.findOne({email:req.email}); 
    const adminId =user._id;  
    const events = await Event.find({createdBy:adminId});
    return res.json({
        events
    })
}) 

module.exports=router;