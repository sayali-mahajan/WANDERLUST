const express = require("express");
const  router = express.Router({ mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");




//Review route
//POST Route
router.post("/",isLoggedIn, validateReview, wrapAsync (reviewController.createReview));

//Delete review route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor,wrapAsync( reviewController.destoryReview));

module.exports = router;