const express=require('express')

const cookieParser = require("cookie-parser")
const router=require("../Routes/auth.routes")
const post=require("../Routes/post.routes") 
const notification=require("../Routes/notification.routes") 
const cors = require('cors');
const rateLimiter=require("../middleware1/rateLimiter.normal")

const app=express()
const allowedOrigins = [
  "http://localhost:5173",
  "https://full-mern-tack-ai-cation-genrator-w.vercel.app",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json())
app.use(cookieParser())
app.use(rateLimiter)
app.get('/', (req, res) => res.send("API Working"))
app.use("/api/auth",router)
app.use("/api/post",post) 
app.use("/api/notification",notification)

module.exports=app