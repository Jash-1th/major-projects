const User = require("../models/user");

module.exports.signUpForm =  (req , res)=>{
    res.render("users/signUp.ejs");
}

module.exports.signUp =async(req , res , next)=>{
    try{
        let {username , email , password} = req.body;
        let fakeUser = new User({
       username,
       email
    });

  let registeredUser = await  User.register(fakeUser , password);
  req.login(registeredUser , (err)=>{
    if(err){
         return  next(err);
    }else{
        req.flash("success" , "Welcome to WanderLust");
       return  res.redirect("/listings");
    }
  })
  
    }catch(err){
        req.flash("error" , err.message);
        res.redirect("/user/signUp");
    }
 
}

module.exports.loginForm = (req ,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginPost=(req , res)=>{
    req.flash("success" , "Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    // console.log(redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.logout = (req ,res , next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
   
    req.flash("success" , `logged out Successfully`)
    res.redirect("/listings");
    })
}