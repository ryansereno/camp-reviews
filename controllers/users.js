module.exports.renderRegister = (req, res) => {
  res.render("users/register");
}

module.exports.register = async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email: email, username: username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "You are now registered");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      // handles error if duplicate user; error message is given by passportLocalMongoose
      req.flash("error", e.message);
      res.redirect("/register");
    }
  }
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
}

module.exports.login = (req, res) => {
    req.flash("success", "You are logged in");
    const redirectUrl = req.session.returnTo || "/campgrounds"; //checks id there is a returnTo url stored in the session (see middleware.js)
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You are now logged out");
  res.redirect("/campgrounds");
}
