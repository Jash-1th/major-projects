if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
    
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./util/ExpressError");
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const users = require("./routes/users.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



// const MONGOOSE_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbURL = process.env.db_URL;



const app = express();

main()
.then(()=>{
    console.log("connection successfully made");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
   await mongoose.connect(dbURL);
}


const port = 8080;

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "/views")); 


app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(methodOverride("_method"));

app.engine("ejs" , ejsMate);

app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));

const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter : 24*3600,
})
store.on("error",()=>{
    console.log("Error in Mongo session store",err);
})
const sessionOptions = {
    store,
    secret :process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser= req.user;
    
    next();
})



app.use("/listings",listings);
app.use("/listings/:id/review",reviews);
app.use("/user" , users);



app.all("*",(req,res)=>{
    throw new ExpressError(404 , "page not found");
})

app.use((err , req ,res , next)=>{
    let {statusCode = 500 , message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
})
app.listen(port , ()=>{
    console.log("app is listening at port number",port);
})