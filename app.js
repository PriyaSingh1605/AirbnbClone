if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session"); //session
const MongoStore = require("connect-mongo");
const passport = require("passport"); //Passport
const LocalStrategy = require("passport-local"); //Passport
const flash = require("connect-flash"); //flash

const User = require("./models/user.js"); //Passport

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const dburl = process.env.MONGO_URL;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then((res) => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret:process.env.SECRET
  },
  touchAfter: 24*3600,
});
store.on("error",() => {
  console.log("session store error", err);
});

const sessionOptions = {
  store:store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7 * 1000,
  },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); //Passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //Passport
passport.serializeUser(User.serializeUser()); //Passport
passport.deserializeUser(User.deserializeUser()); //Passport

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; //Passport
  next();
});
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });

});

app.listen(port, (req, res) => {
  console.log("Gooo...");
});
