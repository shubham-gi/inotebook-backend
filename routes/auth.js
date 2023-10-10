const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt=require('bcryptjs')
const { body, validationResult } = require("express-validator");
const jwt=require('jsonwebtoken')
const jwtSecret="thisisjwtsecret"
//create a user using: POST "api/auth/createuser" . No login required
router.post(
  "/createuser",
  [
    body("name", "min 3 characters required").isLength({ min: 5 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "min 3 characters required").isLength({ min: 3 }),
  ],
  async (req, res) => {
    
    //if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether the user with the same email exists already
    try{
      let user = await User.findOne({email:req.body.email})
    if(user){
      console.log(user)
      return res.status(400).json({errors:"user with this email already exists"})
    }
    const salt=await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt);
    //create a new user
    user=await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })
    const data={
      user:{
        id:user.id
      }
    }
    const authToken=jwt.sign(data,jwtSecret)
    res.json({authToken})
    }
    catch(e){
      console.log(e.message)
      res.status(500).send("some error occured")
    }
      
  }
);
module.exports = router;
