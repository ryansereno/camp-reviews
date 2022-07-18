const Campground = require("../models/campground");
const {cloudinary} = require("../cloudinary")

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.getNewcamp = async (req, res) => {
  res.render("campgrounds/new");
};

module.exports.postNewcamp = async (req, res, next) => {
  const campground = new Campground(req.body.campground); //req.body will be empty. Must router.use express URLencoded, above
  campground.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "New campground successfully made");
  res.redirect(`campgrounds/${campground._id}`);
};

module.exports.getCampId = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    }) //populate all reviews on campsite, then populate the author on EACH review
    .populate("author");
  console.log(campground.images);
  if (!campground) {
    req.flash("error", "This campground has been deleted");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.getCampEdit = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "This campground has been deleted");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.putCampEdit = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.images.push(...images);
  await campground.save();
  if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages){
          await cloudinary.uploader.destroy(filename)
      }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Campground successfully edited");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCamp = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);

  req.flash("success", "Campground successfully deleted");
  res.redirect(`/campgrounds`);
};
