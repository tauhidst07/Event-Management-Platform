const jwt = require("jsonwebtoken"); 
require('dotenv').config();
const authMiddleware = async(req,res,next)=>{
    if(!req.headers.authorization){
        return res.status(400).json({
            msg:"header is reuiqred"
        }) 
    } 
    const token = req.headers.authorization.split(" ")[1];  
    try{
       const decode = jwt.verify(token,process.env.JWT_SECRET);  
       req.email=decode.userEmail; 
       req.role=decode.role; 
       next();
    } 
    catch(err){
       return res.status(400).json({
        msg:"invalid token"
       })
    }
    
} 

module.exports=authMiddleware;