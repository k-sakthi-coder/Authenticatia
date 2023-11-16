// requring user schema
const User=require("../model/schema")
// Controller to render home
module.exports.home=function(req,res){
    return res.render("home",{
        heading:"Authenticatia"
    })
}
// controller for signup
module.exports.signUp=function(req,res){
    // redirecting to profile if user session is already created
    if(req.isAuthenticated()){
        return res.redirect(`/user/profile/${req.cookie.user_id}`)
    }
    // if not then render sign up page
    return res.render("sign_up")
}
// controller for render profile page
module.exports.profile=async function(req,res){
    // fetching user from DB
    const user=await User.findOne({"_id":req.params.id});
    return res.render("profile",{
        heading:`${user.userName} | Profile`,
        user:user
    })
}
// controller for create user in DB
module.exports.create=async function(req,res){
    // checking if password and confirm password is matching or not
    if(req.body.password != req.body.confirm_password){
        req.flash("success","Passwords does not match 🧐")
        // if not then return back
        return res.redirect("back")
    }
    // checking for user existence
    const existence=await User.findOne({email:req.body.email});
    // if user not exist already then create that user in DB
    if(!existence){
        await User.create({
            userName:req.body.name,
            email:req.body.email,
            password:req.body.password
        })
        req.flash("success","Hooray!! New user 🤗")
        return res.redirect("/user/signIn")
    }
    // if user already exist then return to home
    return res.redirect("/")
}
// controller for sign in
module.exports.signIn= async function(req,res){
    // initializing passport authentication
    if(req.isAuthenticated()){
        // once user authenticated
        return res.redirect(`/user/profile/${req.cookies.user_id}`);
    }
    return res.render("sign_in",{
        heading:"Sign In Page"
    })
}
// controller for create session when user is authenticated
module.exports.createSession=async function(req,res){
    // fetching user for flash message to use users name
    const user=await User.findOne({email:req.user.email});
    req.flash("success",`Welcome ${user.userName} 🥳`)
    // creating user id in cookie to use user id wherever we want (only when user logged in)
    res.cookie("user_id",user.id);   
    // redirect to render profile page
    return res.redirect(`/user/profile/${user.id}`)
}
// controller for render reset password page
module.exports.resetPassword=async function(req,res){
    return res.render("reset_password",{
        heading:"Resetting Password",
        id:req.params.id
    })
 
}
// controller for delete a user account details from DB
module.exports.delete=async function(req,res){
    // find and delete the user
    await User.findByIdAndDelete(req.params.id)
    // clear the session-cookie
    res.clearCookie("NodoJS_Auth_Cookie");
    req.flash("success","User account deleted 🥺")
    // render home page
    return res.redirect("/");
}
// controller for update new password
module.exports.updatePassword=async function(req,res){
    // find user and update password
    const user=await User.findById(req.params.id);
    await User.findByIdAndUpdate(req.params.id,{password:req.body.new_password});
    req.flash("success","Password reset successful 😋")
    return res.redirect(`/user/profile/${user.id}`)
}
// controller for sign out user
module.exports.signOut=async function(req,res){
    const user=await User.findById(req.params.id);
    req.logout(function(err){
        if(err){
            console.log("Error in logout",err)
            return;
        }
        req.flash("success",`Bye Bye ${user.userName}`)
        return res.redirect("/")
    })  
}
