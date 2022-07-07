const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require('connect-flash')
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const Review = require("./models/review");
const session = require('express-session')
const campgroundsRouter = require('./routes/campgrounds')
const reviewsRouter = require('./routes/reviews')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const userRouter = require('./routes/user')
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
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
app.use(express.urlencoded({ extended: true })); //parses request body, so body or params can be used as variables
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")))
const sessionConfig ={
    secret: 'privateKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) =>{ // this function allows us to add the .locals parameter to the res object so that ALL responses hold parameters that can be used by ejs, flash, etc.
    res.locals.currentUser = req.user   //.user is a method automatically added to req by passport, and holds the deserialized user info like email and username; setting local.currentUser to req.user allows the the ejs templates to determine if the user is logged in (true) or not logged in (false), and populate the login or logout buttons accordingly (see navbar.ejs)
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})


app.use("/campgrounds", campgroundsRouter)
app.use('/campgrounds/:id/reviews', reviewsRouter)
app.use('/', userRouter) //user / route because userRouter contains more than one endpoint; if endpoint is specified on this file, it will always go to the first endpoint on the router
//--------------------------------------------------------------------

app.get("/", (req, res) => {
  res.render("home");
});


app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Connected");
});
