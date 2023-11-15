// requiring passport
const passport = require('passport');
// requiring google oauth strategy
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
// requiring crypto to generate random password
const crypto = require('crypto');
const User = require('../model/schema');

//use google oauth strategy for google login
passport.use(new googleStrategy({
        clientID: "1055056926898-rdjd8h8e45caekien726bt10jheqmel3.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://adventurous-red-top-coat.cyclic.app/user/auth/google/callback",
    },

    async function(accessToken, refreshToken, profile, done){
        // find a user
        await User.findOne({email: profile.emails[0].value}).exec(async function(err, user){
            if (err){
                console.log('error in google strategy-passport', err); return;
            }
            if (user){
                // if found, set this user as req.user
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user
                await User.create({
                    userName: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if (err){
                        console.log('error in creating user google strategy-passport', err); return;
                    }
                    return done(null, user);
                });
            }

        }); 
    }
));
module.exports = passport;
