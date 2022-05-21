const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync")

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    //useCreateIndex:true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); //provides absolute path to avoid errors, if script is executed from outside of this directory
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//--------------------------------------------------------------------

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", async (req, res) => {
    res.render("campgrounds/new");
});

app.post("/campgrounds", catchAsync(async (req, res, next) => {
        const campground = new Campground(req.body.campground); //req.body will be empty. Must app.use express URLencoded, above
        await campground.save();
        res.redirect(`campgrounds/${campground._id}`);
}));

app.get("/campgrounds/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        res.render("campgrounds/show", { campground });
    } catch (e) {
        next(e);
    }
});

app.get("/campgrounds/:id/edit", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
});

app.use((err, req, res, next) => {
    res.send("Test error handler");
});

app.listen(3000, () => {
    console.log("Connected");
});
