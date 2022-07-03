const express = require("express");
const router = express.Router({mergeParams: true}); //must merge parameters otherwise you will not be able to access the url parameter
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema, reviewSchema } = require("../schemas.js");

const Review = require("../models/review");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();

      req.flash('success', 'Review successfully posted')
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //pull operator removes the review id from the campground record; even if the review record is deleted, its id must also be separately deleted from the campground record
    await Review.findByIdAndDelete(reviewId);
      req.flash('success', 'Review successfully deleted')
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
