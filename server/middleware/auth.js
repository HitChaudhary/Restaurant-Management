import jwt from 'jsonwebtoken'

export const auth = (req,res,next)=>{
    const token = req.headers.authorization

    try {
        jwt.verify(token,process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.json({sucees:false, Message: "Invalid token"})
    }
}