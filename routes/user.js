const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users");

router
  .route("/signup")
  .get((req, res) => {
    res.render("user/signup.ejs");
  })
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get((req, res) => {
    res.render("user/login.ejs");
  })
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;
