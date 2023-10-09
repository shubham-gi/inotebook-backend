const express=require('express')
const User = require('../models/User')
const router=express.Router()


//create a user using post request
router.post('/',(req,res)=>{
    const user=new User(req.body)
    user.save()
    res.json("user saved")
})
module.exports=router