const userSchema = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {client} =require('../Database/Redis')
const Autmiddleware=require('../middleware1/middleware.auth')

async function getinfo (req,res)
{
    try{

        const user=req.user;
         res.status(201).json({
            message: "data fatch sucessfully",
            userId: user
        });

    }
    catch{   res.status(401).json({
            message: "error on fetching data",

        });}
}

async function Register(req, res) {
    try {
        const { username, password } = req.body;

        const existuser = await userSchema.findOne({ username });

        if (existuser) {
            return res.status(409).json({
                message: "Duplicate user"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userSchema.create({
            username,
            password: hashedPassword
        });


          const token = jwt.sign(
            { id: user._id },
            process.env.JWT_token
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User created successfully",
            userId: user._id
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function Login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await userSchema.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_token
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "User logged in successfully",
            id: user._id
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function Logout(req, res) {
    const{token}=req.cookies;
    const payload=jwt.decode(token);

    await client.set(`token:${token}`,"blocked")
    await client.expire(`token:${token}`,1800);
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully"});
}

module.exports = {
    Register,
    Login,
    Logout,
    getinfo
};