
const mongoose = require("mongoose"); 

const eventSchema = mongoose.Schema({
    title:{
        type:String, 
        required:true
    },
    description:{
        type:String, 
        required:true
    }, 
    date:{
        type:Date, 
        required:true
    }, 
    createdBy:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User"
    }
}) 

module.exports=mongoose.model("Event",eventSchema);