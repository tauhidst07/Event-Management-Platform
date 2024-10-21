
const adminMiddleware = async(req,res,next)=>{
    if(req.role!=="Admin"){
        return res.status(400).json({
           msg:"only accessible to admins"
        }) 
    } 
    next();
}