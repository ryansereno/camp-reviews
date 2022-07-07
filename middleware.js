const Campground = require("./models/campground");
const { campgroundSchema, reviewSchema } = require("./joiSchemas.js");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req,res,next)=>{
    console.log('Req.user...', req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl //stores the from url in the session so that it can be used as a redirect (see user.js router)
        req.flash('error','Must be logged in')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "Must be campground author to edit");
    return res.redirect(`/campgrounds/${id}`);
  } else {
    next();
  }
};


module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
