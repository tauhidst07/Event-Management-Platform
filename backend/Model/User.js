const mongoose = require("mongoose"); 

const userSchema = mongoose.Schema({
    firstName:{
        type:String, 
        required:true,
    }, 
    lastName:String, 
    email:{
        type:String, 
        required:true
    },  
    password:{
        type:String, 
        required:true,
    },
    role:{
        type:String, 
        enum:["User","Admin"], 
        default:"User"
    }
}) 

module.exports = mongoose.model('User',userSchema);