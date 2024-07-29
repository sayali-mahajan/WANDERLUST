if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/users.js");

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL;       //connect through mongodbatlas

main().then(()=>{
    console.log("connected to DB");
})
.catch(err =>{
    console.log(err);
});
async function main() {
    // await mongoose.connect (MONGO_URL);
    await mongoose.connect (dbUrl);
}

//setting for views and ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret : process.env.SECRET, 
    },
    touchAfter: 24 * 3600, //secs
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET, 
    resave:false , 
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,       //days,hours,mins,sec,milisec
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};

//connetions request to APIs
// app.get("/", (req, res)=>{
//     res.send("Hi root is working");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();                      
});


// app.get("/demo", async (req, res)=>{
//     let fakeUser = new User({
//         email: "student12@gmail.com",
//         username: "student_riya",
//     });
    
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

   



// app.get("/testListing", async (req, res)=>{
//     let sampleListing = new Listing ({
//       title : "My New Villa",
//       description : "Garden",
//       price : 1200,
//       location : "calangute, Goa",
//       country : "India",

// });
//   await sampleListing.save();
//   console.log ("sample saved ");
//   res.send("successful");
// });

//Error Handling through middleware

app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "Page not found!"));
});


app.use((err, req, res, next)=>{
    let{statusCode = 500, message = "something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    console.log(message);
});

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});