const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../util/ExpressError");
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const wrapAsync = require("../util/wrapAsync");
const {reviewSchema } = require("../schema.js");
const {reviewValidation,isLoggedIn,isReviewOwner} = require("../middileware.js");
const {addReview,destroyReview} = require("../controllers/review.js");



router.post("/" ,isLoggedIn,reviewValidation ,wrapAsync(addReview))

router.delete("/:reviewId" ,isLoggedIn,isReviewOwner,wrapAsync(destroyReview));

module.exports=router;