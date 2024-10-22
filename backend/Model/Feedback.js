const mongoose = require("mongoose"); 
const { number } = require("zod");

const feedbackSchema = mongoose.Schema({
    eventId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"Event", 
        required:true
    }, 
    userId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User", 
        required:true
    }, 
    rating:{
        type:Number,  
    }, 
    comment:{
        type:String, 
        required:true
    }
}) 

module.exports= mongoose.model('Feedback',feedbackSchema);