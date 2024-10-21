
const express = require("express"); 
const authMiddleware = require("../Middleware/authMiddleware");
const Event = require("../Model/Event");
const User = require("../Model/User");
const router = express.Router(); 


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
    res.json({
        msg:"user registered in event"
    })
})
router.get("/events",authMiddleware,async(req,res)=>{ 
    const events = await Event.find({});
    return res.json({
        events
    })
}) 

module.exports=router;