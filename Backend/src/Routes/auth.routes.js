const express = require('express')
const router = express.Router()
const { Register, Login, Logout,getinfo} = require('../controler/Auth.controller')
const Authmiddleware=require('../middleware1/middleware.auth')
router.post('/register', Register)
router.post('/login', Login)
router.post('/logout',Authmiddleware,Logout)
router.get('/getinfo',Authmiddleware,getinfo);


module.exports = router