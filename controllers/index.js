const User=require("../model/schema")

module.exports.home=function(req,res){
    return res.render("home",{
        heading:"NodeJS Authendication"
    })
}
module.exports.signUp=function(req,res){
    
    if(req.isAuthenticated()){
        return res.redirect(`/user/profile/${req.cookie.user_id}`)
    }
    return res.render("sign_up",{
        heading:"Sign Up Page"
    })
}
module.exports.profile=async function(req,res){
    const user=await User.findOne({"_id":req.params.id});
    return res.render("profile",{
        heading:` ${user.userName} | Profile`,
        user:user
    })
    // if(req.cookies.user_id){
    //     const user=User.findById(req.cookies.user_id);
    //     if(user){
    //         return res.render("profile",{
    //             heading:`${user.userName} | Profile`,
    //             user:user
    //         });
    //     }
    //     return res.redirect("/user/signIn")
    // }else{
    //     return res.redirect("/user/signIn")
    // }
}
module.exports.create=async function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect("back")
    }
    const existence=await User.findOne({email:req.body.email});
    if(!existence){
        await User.create({
            userName:req.body.name,
            email:req.body.email,
            password:req.body.password
        })
        return res.render("sign_in")
    }
    return res.redirect("/")
}

module.exports.update=async function(req,res){
    const user=await User.findByIdAndUpdate(req.params.id,{userName:req.body.newName});
    return res.redirect("back")

}
module.exports.signIn= async function(req,res){
    console.log("Here i am")
    const user=await User.findById(req.cookies.user_id)
    if(req.isAuthenticated()){
        return res.redirect(`/user/profile/${user.id}`);
    }
    return res.render("sign_in",{
        heading:"Sign In Page"
    })
}

module.exports.createSession=async function(req,res){
    // console.log(req.cookies)
    const user=await User.findOne({email:req.body.email});
    // if(user){
    //     if(user.password != req.body.password){
    //         return res.redirect("back")
    //     }
    //     res.cookie("user_id",user.id);
    //     return res.redirect(`/user/profile/${user.id}`)
    // }
    res.cookie("user_id",user.id);
    // req.flash("success","Logged in Successfully")
    // alert("Logged in Successfully")
    return res.redirect(`/user/profile/${user.id}`)
}

module.exports.forgotPassword=async function(req,res){
    return res.render("forgot_password",{
        heading:"Forgot Password"
    })
 
}
module.exports.delete=async function(req,res){
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie("NodoJS_Auth_Cookie");
    return res.render("home",{
        heading:"NodeJS Authendication"
    })

}
module.exports.resetPassword=async function(req,res){
    const user=await User.findOne({email:req.body.email});
    console.log(req.body.new_password)
    if(user){
        await User.findOneAndUpdate({email:req.body.email},{password:req.body.new_password});
        res.redirect("/user/signIn")
    }

}
module.exports.signOut=async function(req,res){
    req.logout(function(err){
        if(err){
            console.log("Error in logout",err)
            return;
        }
        // req.flash("success","Logged out Successfully")
        // alert("Logged out Successfully")
        return res.redirect("/")
    })  
}