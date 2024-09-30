const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createReview = async(req, res)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);       //for stored the review which came from backend
     newReview.author = req.user._id;
     console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");

  res.redirect(`/listings/${listing._id}`);
};

module.exports.destoryReview = async(req, res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: {reviews : reviewId}});
    await Review.findById(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};