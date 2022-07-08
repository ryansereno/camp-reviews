const express = require("express");
const router = express.Router({ mergeParams: true }); //must merge parameters otherwise you will not be able to access the url parameter
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { isReviewAuthor, validateReview, isLoggedIn, isAuthor } = require("../middleware");
const Review = require("../models/review");
const reviewController = require("../controllers/reviews")

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviewController.postReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
    isReviewAuthor,
  catchAsync(reviewController.deleteReview)
);

module.exports = router;
