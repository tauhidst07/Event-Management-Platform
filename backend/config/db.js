const mongoose = require("mongoose"); 
require("dotenv").config();
const dbConnect = async ()=>{
    try{
       await mongoose.connect(process.env.DB_URL); 
       console.log("Database connected..");
    } 
    catch(err){
        console.log("db error ",err);
    }
}  

module.exports=dbConnect

