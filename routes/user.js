const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");
const passport = require('passport')

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email: email, username: username });
      const registeredUser = await User.register(user, password);
      req.flash("success", "You are now registered");
      res.redirect("/campgrounds");
    } catch (e) {
      // handles error if duplicate user; error message is given by passportLocalMongoose
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", async (req, res) => {
  res.render("users/login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
      req.flash('success','You are logged in')
      res.redirect('/campgrounds')
  }
);

module.exports = router;
