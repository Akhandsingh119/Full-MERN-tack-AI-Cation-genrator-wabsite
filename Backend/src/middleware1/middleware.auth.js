const jwt=require('jsonwebtoken')
const userSchema = require('../Model/user.model')
const {client}=require('../Database/Redis')

const Auth=async(req,res,next)=>{
    const token=req.cookies.token



    if(!token){ 
        return res.status(401).json({
            message:"unautharized access ,please login Agin"
        }) 
    }

     const isBlocked = await client.get(`token:${token}`);

        if (isBlocked === "blocked") {
            return res.status(401).json({ message: "Invalid token" });
        }

    try {
        
        const decode= jwt.verify(token,process.env.JWT_token)


        const user=await userSchema.findOne({
            _id:decode.id
        })




        if(!user){
            return res.status(401).json({
                message:"Token was expired Login it Again"
            })
        }
        
        

        req.user=user

        next()
    } catch (error) {
        return res.status(401).json({
            message:error.message
        })
    }
}

module.exports=Auth

