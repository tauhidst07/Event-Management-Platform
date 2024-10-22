
const express = require("express");
const app = express();   
const cors = require("cors");
const  dbConnect  = require("./config/db");
const cron = require('node-cron');
require("dotenv").config(); 
const PORT = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());    

const authRoute=require("./Routes/auth");  
const userRoute = require("./Routes/User"); 
const adminRoute = require("./Routes/Admin");
const notificationSchedular = require("./Schedulers/notificationSchedular");
app.use("/auth",authRoute);  
app.use("/user",userRoute); 
app.use("/admin",adminRoute);
app.get("/",(req,res)=>{
    res.send("server is up and running");
})  

notificationSchedular();

app.listen(PORT,()=>{
    console.log("server started at PORT",PORT); 
    dbConnect();
})

