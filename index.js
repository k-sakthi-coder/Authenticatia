const express=require("express");
const port=5000;
const app=express();
const cookieParser = require('cookie-parser');
// const MongoStore = require("connect-mongo").default;
// const mongoose = require('mongoose');


const db = require('./config/mongoose');

const session = require('express-session');
const passport = require('passport');
// const sassMiddleware = require('node-sass-middleware');


const passportLocal = require('./config/passport-local');
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const customMware = require('./config/notification');
app.use(express.urlencoded());
app.use(cookieParser());

app.set("views","./views");
app.set("view engine","ejs");

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
            mongoUrl:"mongodb://127.0.0.1/NodeJS_Auth"
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

const passportGoogle=require("./config/social_auth")
app.use(passport.setAuthenticatedUser);


app.use(customMware.setFlash);
app.use("/", require("./routes"));

app.listen(port,function(err){
    if(err){
        console.log("Error in running server",err);
        return;
    }
    console.log("Server running successfully on port no:",port);
})