const Listing = require("../models/listing");

const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken = process.env.MAP_API_Token;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.country = async(req , res )=>{
    let {country} = req.query;
    if(country == ""){
        return res.redirect("/listings");
    }
    country = country.toUpperCase();
    console.log(country)
    let allListings = await Listing.find({country : country});
    console.log(allListings);
    res.render("listings/category.ejs", {allListings, categorieName:country});
}

module.exports.category = async(req, res , next)=>{
    let {id} = req.params;
    let categorieName = id.replace("-", " ");
    console.log(categorieName);
    const allListings = await Listing.find({categories : categorieName});
    console.log(allListings);
    res.render("listings/category.ejs", {allListings,categorieName});
}
module.exports.index=async(req , res , next)=>{

    const allListings = await Listing.find({});
    
    res.render("listings/index.ejs" , {allListings})
    
};

module.exports.renderNewListingForm = (req ,res)=>{
    res.render("listings/new.ejs")
}
module.exports.addListing=async(req,res , next)=>{
    // console.log(req.file);
    let response = await  geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send();
    let url = req.file.path;
    let filename =req.file.filename
    let newListing = new Listing(req.body.listing);
    newListing.country = newListing.country.toUpperCase();
    newListing.image={url , filename};
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
     let savedListing = await newListing.save();
     console.log(newListing);
    req.flash("success" , "new Listing Added sucessfully");
    res.redirect("/listings");
}
module.exports.showListing=async(req, res,next)=>{
    let {id} = req.params;
    // console.log(id);
    let listing = await Listing.findById(id)
    .populate(
        {path : "reviews",
            populate : {
                path : "author"
            }
        }
    )
    .populate("owner");
    // console.log(listing);
    if(!listing){
        req.flash("error" , "Listing you requested is not existing");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs",{listing});
    }

}

module.exports.rendereditListingForm =async(req, res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    console.log(listing);

    if(!listing){
        req.flash("error" , "Listing you requested is not existing");
        res.redirect("/listings");
    }
    else{
        let originalListingImageUrl = listing.image.url;
       originalListingImageUrl= originalListingImageUrl.replace("/upload","/upload/,w_250");
        console.log(originalListingImageUrl);
        res.render("listings/edit.ejs",{listing , originalListingImageUrl});

    }

}

module.exports.updateListing=async(req, res,next)=>{
    let {id} = req.params;
    let listing = req.body.listing
    listing.country = listing.country.toUpperCase();
   let updatedListing= await Listing.findByIdAndUpdate(id , {...listing , id});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename =req.file.filename
        updatedListing.image= {url , filename};
        await updatedListing.save();
    }
    
    req.flash("success" , " Listing Updated sucessfully");
    res.redirect(`/listings/${id}`);

}

module.exports.destroyListing = async(req, res,next)=>{
    let {id} = req.params;
  let deletedListing =  await Listing.findByIdAndDelete(id);
  req.flash("success" , " Listing Deleted sucessfully");
    res.redirect("/listings");
}


    
    