const express = require("express");
const app = express();
const users = require("./routes/users.js");
const posts = require("./routes/posts.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

const sessionOptions = {secret : "mysupersecretstring", 
    resave:false , 
    saveUninitialized : true
};

app.use(session(sessionOptions));    //middleware to send session id as a cookies
app.use(flash());

//2nd trika for sending flashmsg through middleware
app.use((req, res, next)=>{
     res.locals.successMsg = req.flash("success");
     res.locals.errorMsg = req.flash("error");
     next();                      
})

//storing and using session info
//using coonect_flash msg that appears at once
app.get("/register", (req, res)=>{
    let { name = "anonymous"} = req.query;
    req.session.name = name;
    if(name == "anonymous"){
        req.flash("error", "user not Registerd yet");
    }else{
    req.flash("success", "user register successfuly");
    }
  
    res.redirect("/hello");
});

app.get("/hello",(req, res)=>{
    // res.send(`hello! ${req.session.name}`);
    //2nd trika for sending flashmsg
    // res.locals.successMsg = req.flash("success");
    // res.locals.errorMsg = req.flash("error");
    res.render("page.ejs", {name : req.session.name,});// msg: req.flash("success")});   //1st trika for sending flashmsg
});





app.get("/reqconnect", (req, res)=>{
    if( req.session.count){
        req.session.count++;
    }else{
    req.session.count = 1;
    }
    res.send(`You sent a request ${req.session.count}times`);
});

app.get("/test", (req, res)=>{
    res.send("test successful");
});
// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie",(req, res)=>{
//     res.cookie("made-In", "India", {signed : true});
//     res.send("signed cookie sent");
// });

// app.get("/verify", (req, res)=>{
//     console.log(req.signedCookies);
//     res.send("Verified");
// })

// //sending cookies
// //cookies is nothing but the set of information that we send and recieve
// app.get("/getcookies",(req, res)=>{
//     res.cookie("greet", "hello");
//     res.cookie("madeIn", "Maharashtra");
//     res.send("cookies send succesfully");
// });

// app.get("/greet", (req, res)=>{
//     let{ name = "Anonymous"} = req.cookies;
//     res.send(`Hi, ${name}`);                //sending name as response through cookies
// })

// app.get("/" , (req, res)=>{
//     console.log(req.cookies);
//     res.send("Hi I am root!")
// });

// app.use("/users", users);
// app.use("/posts", posts);



app.listen(3000, ()=>{
    console.log("server is listining to 3000");
});