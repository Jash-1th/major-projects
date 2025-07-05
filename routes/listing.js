const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync");
const {isLoggedIn , isOwner, listingValidation} = require("../middileware.js");
const {country,category,index,renderNewListingForm,addListing,showListing,rendereditListingForm,updateListing,destroyListing} = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(index))
.post(isLoggedIn,upload.single("listing[image]"), listingValidation , wrapAsync(addListing));

router.get("/countryBased",wrapAsync(country));
router.get("/new" , isLoggedIn ,renderNewListingForm );

router.get("/category/:id" ,wrapAsync(category) );
router.route("/:id")
.get( wrapAsync(showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),listingValidation, wrapAsync(updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(destroyListing));

router.get("/:id/edit",isLoggedIn ,isOwner, wrapAsync(rendereditListingForm))

module.exports = router;