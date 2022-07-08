const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgroundController = require("../controllers/campgrounds");

router.get(
  "/",
  catchAsync(campgroundController.index) // do not add () to controller; it will cause the function to execute on its own; let the router execute the function
);

router.get("/new", isLoggedIn, catchAsync(campgroundController.newcamp));

router.post(
  "/",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgroundController.postNewcamp)
);

router.get("/:id", catchAsync(campgroundController.getCampId));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundController.getCampEdit)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgroundController.putCampEdit)
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundController.deleteCamp)
);

module.exports = router;
