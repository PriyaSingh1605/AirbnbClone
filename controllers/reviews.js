const Review = require("../models/review");
const Listing=require('../models/listing');

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
newReview.author = req.user._id;
console.log(newReview);
  listing.reviews.push(newReview);
console.log(listing._id);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpadate(reviewId).thenDelete;
  await Review.findById(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};