const express = require("express");
const User = require("../models/User");
const router = express.Router();

const { body, validationResult } = require("express-validator");
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
      // return res.send(`Hello, ${req.query.person}!`);
    }
    //check whether the user with the same email exists already
    try{
      let user = await User.findOne({email:req.body.email})
    if(user){
      console.log(user)
      return res.status(400).json({errors:"user with this email already exists"})
    }
    //create a new user
    user=await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
    res.send(user)
    }
    catch(e){
      console.log(e.message)
      res.status(500).send("some error occured")
    }
      
  }
);
module.exports = router;
