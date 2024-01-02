// requiring express
const express=require("express");
// calling express router 
const router=express.Router();
// initializing controller
const Controller=require("../controllers/index")
// router for home
router.get("/",Controller.home);
// initializing user router
router.use("/user",require("./user"));
// make available the router
module.exports=router

