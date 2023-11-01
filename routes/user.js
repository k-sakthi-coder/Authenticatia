const express=require("express");
const passport=require("passport");

const router=express.Router();

const Controller=require("../controllers/index")
// const userAPI=require("../controllers/users_api")

router.get("/signUp",Controller.signUp);
router.get("/signIn",Controller.signIn);

router.get("/profile/:id",passport.checkAuthentication,Controller.profile)

router.get("/sign_out",Controller.signOut);

router.get("/forgot_password",Controller.forgotPassword);
router.post("/reset_password",Controller.resetPassword);

router.post("/update/:id",Controller.update)

router.post("/create",Controller.create);
// router.post("/createSession",Controller.createSession)
router.post("/createSession",passport.authenticate(
    'local',
    {failureRedirect:"/user/signIn"}
),Controller.createSession);
router.get("/delete/:id",Controller.delete);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign_in'}),Controller.createSession);

// Left at create session issue , returns to the home once complete valid sign in please check
// Try to analyze the path of request goes , i think its not authenticated while coming signin controller

// session cookie has been created, please refer notbook i left just before. passing user data and limiting topic

module.exports=router

