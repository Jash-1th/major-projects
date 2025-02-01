
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../util/wrapAsync.js");
const {userSchema} = require("../schema.js");
const ExpressError = require("../util/ExpressError.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middileware.js");
const {userValidation} = require("../middileware.js");
const {signUpForm,signUp,loginForm,loginPost,logout} = require("../controllers/user.js");


router.route("/signUp")
.get(signUpForm)
.post(userValidation ,wrapAsync(signUp))

router.route("/login")
.get(loginForm)
.post(saveRedirectUrl ,passport.authenticate("local" , {failureFlash:true , failureRedirect:'/user/login'}),loginPost);

router.get("/logOut" , logout)

module.exports = router;