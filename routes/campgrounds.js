const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgroundController = require("../controllers/campgrounds");
router
  .route("/")
  .get(catchAsync(campgroundController.index)) // do not add () to controller; it will cause the function to execute on its own; let the router execute the function
  .post(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgroundController.postNewcamp)
  );

router.get("/new", isLoggedIn, catchAsync(campgroundController.newcamp));

router
  .route("/:id")
  .get(catchAsync(campgroundController.getCampId))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgroundController.putCampEdit)
  ).delete(
    isLoggedIn,
  isAuthor,
  catchAsync(campgroundController.deleteCamp)
);


router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundController.getCampEdit)
);

module.exports = router;
