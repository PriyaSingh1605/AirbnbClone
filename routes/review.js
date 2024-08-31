const express = require('express');
const router=express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const reviewControler=require("../controllers/reviews");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

// reviews



// post route

router.post("/", validateReview,isLoggedIn, wrapAsync(reviewControler.createReview));

//Delete review  Route 
// router.delete("/:reviewId",isLoggedIn, wrapAsync(reviewControler.destroyReview));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewControler.destroyReview));


module.exports=router;