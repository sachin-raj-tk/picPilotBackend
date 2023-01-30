import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_KEY;
const authMiddleWare = async(req,res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        if(token){
            const decoded = jwt.verify(token, secret);
            console.log(decoded,'decoded');
            if(decoded){
                req.body._id = decoded?.id;
                console.log(Date.now());
                next();    
            }
            
        }
    }catch (error){
        console.log(error);
        res.status(500).json("token expired")
    }

}

export default authMiddleWare;
