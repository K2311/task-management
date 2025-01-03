const verifyRole = (requiredRole)=>{
    return (req,res,next)=>{
        const user = req.user;
        if(user.role === requiredRole){
            next();
        }else{
            res.status(403).json({message:"You are not allowed to access this route"})
        }
    }
}
module.exports = verifyRole;