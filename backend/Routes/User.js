const express = require("express"); 
const router = express.Router(); 
const zod = require("zod"); 
const User = require("../Model/User"); 
const bcrypt = require("bcrypt");

 
const registerSchema = zod.object({
    firstName:zod.string(), 
    lastName:zod.string().optional(), 
    email:zod.string().email(),  
    password:zod.string().min(6),
    role:zod.enum(["User","Admin"]).optional()
})
router.post("/register",async (req,res)=>{
   const userData = req.body; 
   const response= registerSchema.safeParse(userData); 
   if(!response.success){ 
    console.log("res",response.error); 
    console.log("user ",userData)
    return res.status(400).json({
        msg:"Invalid input"
    })
   } 
   const hashedPassword = await bcrypt.hash(userData.password,10);
   const user = await User.create({
    firstName:userData.firstName, 
    lastName:userData.lastName, 
    email:userData.email, 
    role:userData.role, 
    password:hashedPassword
   }) 
   res.json({
    msg:"User created successfully", 
    user
   })
}) 

const loginSchema = zod.object({
    email:zod.string().email(), 
    password:zod.string().min(6)
})
router.post("/login",async(req,res)=>{
  const loginData= req.body; 
  const result = loginSchema.safeParse(loginData); 
  if(!result.success){
    return res.status(400).json({
        msg:"Invalid input"
    })
  } 
  const user = await User.findOne({email:loginData.email}); 
  if(!user){
    return res.status(404).json({
        msg:"user not registered sign up first"
    })
  } 
  if(!(await bcrypt.compare(loginData.password,user.password))){
    return res.status(401).json({
        msg:"invalid password"
    })
  } 
  res.json({
    msg:"logged in success"
  })
}) 

module.exports=router