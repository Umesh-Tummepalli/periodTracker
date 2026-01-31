import jwt from "jsonwebtoken";
import Session from "../models/Session";
export function UserAuth(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
   try{
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const session = await Session.findOne({ token });
    if(!session){
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
    if(session.expiresAt < Date.now()){
        await Session.deleteOne({ token:decodedToken.token });
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
    req.userId = session.userId;
    next();
   }
   catch(error){
    console.log("Error authenticating user", error);
    res.status(500).json({ message: "Error authenticating user", success: false });
   }
}