
const mongoose = require("mongoose");
const Review = require("./review.js");
const ListingSchema = new mongoose.Schema({
    title :{
        type: String,
        required:true

    },
    description :{
        type: String,
        required:true
    },
    image :{
      url : {
        type : String
      },
      filename : {
        type : String
      }
    },
    price :{
        type: Number,
       
        min : 100
    },
    location :{
        type: String,
        required:true
    },
    country :{
        type: String,
        required:true
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry : {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          // required: true
        },
        coordinates: {
          type: [Number],
          // required: true
        }
      },
      categories:{
        type : String,
        enum : ["Trending" , "Rooms","Iconic cities", "Mountains","Castles","Amazing Pool","Camping","Arctic","others"],
        default : "others"
      }

})

ListingSchema.post("findOneAndDelete" , async(listing)=>{

    if(listing){
        
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

const Listing = new mongoose.model("Listing" , ListingSchema);

module.exports = Listing;

