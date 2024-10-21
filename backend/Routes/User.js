
const express = require("express"); 
const authMiddleware = require("../Middleware/authMiddleware");
const router = express.Router(); 

router.get("/events",authMiddleware,async(req,res)=>{
    return res.json({
        userEvents:[]
    })
}) 

module.exports=router;