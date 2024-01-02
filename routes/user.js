// requring express
const express=require("express");
// requring passprt
const passport=require("passport");
// calling router module
const router=express.Router();
// requiring controller
const Controller=require("../controllers/index")
// router for signup
router.get("/signUp",Controller.signUp);
// router for sign in
router.get("/signIn",Controller.signIn);
// router for load profile
router.get("/profile/:id",passport.checkAuthentication,Controller.profile)
// router for sign out user
router.get("/sign_out/:id",Controller.signOut);
// router for reset password
router.get("/reset_password/:id",Controller.resetPassword);
// router for update new password
router.post("/update_password/:id",Controller.updatePassword);
// router for create user
router.post("/create",Controller.create);
router.post("/post_image",Controller.postImage);
router.get("/delete_post/:postId",Controller.deletePost)
router.get("/add_like",Controller.addLike)
router.post("/add_comment",Controller.addComment)
router.get("/share_post",Controller.sharePost);
router.get("/add_friend",Controller.addFriend)
router.get("/delete_friend",Controller.deleteFriend)
// router for crease session for user using passport session
router.post("/createSession",passport.authenticate(
    'local',
    {failureRedirect:"/user/signIn"}
),Controller.createSession);
router.get("/delete/:id",Controller.delete);
// router for requesting user presense in googles database
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
// router for sign in using google profile 
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/user/sigIn'}),Controller.createSession);
// make available this router
module.exports=router

