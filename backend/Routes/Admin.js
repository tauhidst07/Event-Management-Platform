
const express = require("express"); 
const authMiddleware = require("../Middleware/authMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");
const router = express.Router(); 

router.get("/events",authMiddleware,adminMiddleware,async(req,res)=>{
    return res.json({
        adminEvents:[]
    })
}) 

module.exports=router;