const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.addReview = async(req , res , next)=>{
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    console.log(req.body);
    review.author = req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success" , "New Review Added Successfully");
    res.redirect(`/listings/${listing.id}`);
}

module.exports.destroyReview = async(req , res , next)=>{
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}