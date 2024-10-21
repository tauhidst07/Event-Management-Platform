
const express = require("express");
const app = express();   
const cors = require("cors");
const  dbConnect  = require("./config/db");

require("dotenv").config(); 
const PORT = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());    

const authRoute=require("./Routes/User"); 
app.use("/auth",authRoute); 
app.get("/",(req,res)=>{
    res.send("server is up and running");
})
app.listen(PORT,()=>{
    console.log("server started at PORT",PORT); 
    dbConnect();
})

