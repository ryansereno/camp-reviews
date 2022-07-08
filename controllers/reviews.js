const Review = require("../models/review");

module.exports.postReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
      review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();

    req.flash("success", "Review successfully posted");
    res.redirect(`/campgrounds/${campground._id}`);
  }

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //pull operator removes the review id from the campground record; even if the review record is deleted, its id must also be separately deleted from the campground record
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review successfully deleted");
    res.redirect(`/campgrounds/${id}`);
  }
