const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user")


router.get("/", (req, res) => {
  res.render("users/register");
});

router.post('/', catchAsync(async (req,res)=>{
    const {email, username, password} = req.body
    const user = new User({email:email, username:username})
    const registeredUser = await User.register(user, password)
    console.log(registeredUser)
    req.flash('success','You are now registered')
    res.redirect("/campgrounds")
}))

module.exports = router
