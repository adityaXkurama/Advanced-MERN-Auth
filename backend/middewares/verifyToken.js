import jwt from 'jsonwebtoken';

export const verifyToken = (req,res,next)=>{
    const token = req.cookies.token
    console.log(`cookie token ${token}`);
    
    if(!token){
        return res.status(401).json({success:false,message:"Not authenticated"})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({success:false,message:"Not authenticated"})
        }
        req.userId = decoded.userId
        next()
    } catch (error) {
        console.log("Error in verify token",error.message);
        return res.status(401).json({success:false,message:"Not Authenticated"})
        
    }
}