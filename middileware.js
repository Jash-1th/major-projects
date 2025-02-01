const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./util/ExpressError");
const {listingSchema,userSchema,reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req , res , next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
      // console.log(req.originalUrl);
        req.flash("error" , "You must be logged in");
      return  res.redirect("/user/login");
    }
    next();

}
module.exports.saveRedirectUrl=(req , res , next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req ,res ,next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser.id)){
      req.flash("error","You are not Owner of this listing");
      return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.listingValidation = (req , res, next)=>{
  let {error} = listingSchema.validate(req.body);
  if(error){
      throw new ExpressError(400 , error);
  }else{
      next();
  }
}

module.exports.reviewValidation= (req , res , next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
      throw new ExpressError(400 , error);
  }else{
      next();
  }
}

module.exports.isReviewOwner = async (req ,res ,next)=>{
  let {reviewId,id} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","You are not Owner of this listing");
      return res.redirect(`/listings/${id}`);
  }
  next();
}




module.exports.userValidation = (req , res , next)=>{
    let {error} = userSchema.validate(req.body);
    if(error){
        throw new ExpressError(400 , error)
    }else{
        next();
    }
}