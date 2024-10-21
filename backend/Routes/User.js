
const express = require("express"); 
const authMiddleware = require("../Middleware/authMiddleware");
const Event = require("../Model/Event");
const router = express.Router(); 

router.get("/events",authMiddleware,async(req,res)=>{ 
    const events = await Event.find({});
    return res.json({
        events
    })
}) 

module.exports=router;