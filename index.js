// requiring express
const express=require("express");
// port number for server to run
const port=5000;
// calling express as function
const app=express();
// requiring cookie parser
const cookieParser = require('cookie-parser');
// requiring database
const db = require('./config/mongoose');
// requiring express session 
const session = require('express-session');
// requirng passport js
const passport = require('passport');
// requiring social auth strategy
const passportGoogle=require("./config/social_auth")
// requirng local strategy from passpoer js
const passportLocal = require('./config/passport-local');
// requring connect mongo to store sessions
const MongoStore = require('connect-mongo');
// requirng connect flash for flash messages 
const flash = require("connect-flash")
// custom middleware for shifting flash msg from request to response
const customMware = require('./config/notification');
// middleware for put data into body
app.use(express.urlencoded());
// initializing cookie parser
app.use(cookieParser());
// setting EJS view engine
app.set("views","./views");
app.set("view engine","ejs");
// creating session cookie
app.use(session({
    name:"NodoJS_Auth_Cookie",
    secret:"Ragasiyam",
    saveUninitialized:false,
    resave:false,
    cookie:{
        makeAge:(1000*60*100)
    },
    store: new MongoStore(
        {
            mongooseConnection:db,
            autoRemove: 'disabled',
            mongoUrl:"mongodb+srv://mechonsakthi44:klsalkthi333@cluster0.ulg7oer.mongodb.net/"
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));
// initializing passport
app.use(passport.initialize());
// initializing passport session
app.use(passport.session());
// passport set authentication
app.use(passport.setAuthenticatedUser);
// initializing flash messages
app.use(flash());
// initializing setflash custom middleware
app.use(customMware.setFlash);
// initializing routes
app.use("/", require("./routes"));
// make server run on desired port number
app.listen(port,function(err){
    if(err){
        console.log("Error in running server",err);
        return;
    }
    console.log("Server running successfully on port no:",port);
})
