const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const User=require("../model/schema");

passport.use(new LocalStrategy({
    usernameField:"email"
  },
  async function(email,password,done){
    try{
        const user=await User.findOne({email:email})
        if(!user || user.password != password){
            // req.flash("error","Invalid Username/Password")
            // alert("Invalid")
            console.log("Invalid Username/Password");
            return(done(null,false))
        }
        if(user){
            // req.flash("success","Super")
            return done(null,user)
        }
    }
    catch(err){        
        if(err){
            // req.flash("error",err)
            console.log("Error in finding user -> Passport");
            return done(err);
    }}
  }
));

passport.serializeUser(function(user,done){
    done(null,user.id);
});

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

passport.checkAuthentication = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    return res.redirect('/user/signIn');
}
passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}


module.exports=passport;