// requiring passport js
const passport=require("passport");
// initializing passport local strategy
const LocalStrategy=require("passport-local").Strategy;
// requiring user schema
const User=require("../model/schema");
// using passports local strategy
passport.use(new LocalStrategy({
    usernameField:"email",
    passReqToCallback:true
  },
  async function(req,email,password,done){
    try{
        // try to finding user in DB
        const user=await User.findOne({email:email})
        // if user not found in DB or password is not matching
        if(!user || user.password != password){
            req.flash("success","Invalid Username/Password 🤨")
            console.log("Invalid Username/Password");
            return(done(null,false))
        }
        // if user found the initialize authentication
        if(user){
            return done(null,user)
        }
    }
    catch(err){        
        if(err){
            console.log("Error in finding user -> Passport");
            return done(err);
    }}
  }
));

// serializing the user to decide which key needs to kept in cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});
// deserializing the user from the key in the cookie
passport.deserializeUser(function(id,done){
    try {
        const user = User.findById(id)
        if(user){
            return done(null,user);
        }
    }
    catch(err){
        console.log("Error in finding user");
        return done(err);
    }
});

// for checking if user is authenticated
passport.checkAuthentication = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    return res.redirect('/user/signIn');
}
// for authenticate the user
passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}
module.exports=passport;