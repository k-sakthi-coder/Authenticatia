// requring user schema
const User=require("../model/schema")
const Post=require("../model/post")
const { create } = require("connect-mongo")
const fs =require("fs")
// Controller to render home
module.exports.home=function(req,res){
    return res.render("home",{
        heading:"Authendicatia"
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
    const posts=await Post.find();
    const users=await User.find();
    console.log(user.friendList)
    return res.render("profile",{
        heading:`${user.userName} | Profile`,
        user:user,
        posts:posts,
        usersList:users
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
    req.flash("success",`User already exist`)
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
    return res.redirect("/")
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
        req.flash("success",`Bye Bye ${user.userName} 😁`)
        return res.redirect("/")
    })  
}
module.exports.postImage=async function (req,res){
    await Post.uploadedPost(req,res,function(err){
        if(err){
            console.log("Multer error",err)
        }
        const date=new Date()
        const dataInString= date.toLocaleString("en-US",{
            year:"numeric",
            month:"long",
            day:"numeric",
            hour:"numeric",
            minute:"numeric",
            second:"numeric",
            hour12:true
        });
        if(req.file){
            Post.create({
                content:req.body.content,
                user:req.query.posted_user,
                userId:req.query.posted_user_id,
                // saving the path of the uploaded file into the photo field in the post schema
                photo:Post.postPath + "/" + req.file.filename,
                postedAt:dataInString,
                filename:req.file.filename
            })
            return res.redirect("back")
        }
        else{
            Post.create({
                content:req.body.content,
                user:req.query.posted_user,
                userId:req.query.posted_user_id,
                postedAt:dataInString,
            })
            return res.redirect("back")
        }
    })
    
}
module.exports.deletePost=async function(req,res){
    "../uploads/posts/photo-1704008680388"
    const post=await Post.findById(req.params.postId);
    
    fs.unlink("F:/EDUCATIONAL/CODING_NINJA/BACKEND SKILL TEST/NodeJS auth/uploads/posts/"+post.filename,(err)=>{
        if(err){
            console.log("File does not exist")
        }
        else{
            console.log("File deleted")
            
        }

    })
    await Post.deleteOne(post)
    req.flash("success",`Post deleted successfully`)
    return res.redirect("back")
}
module.exports.addLike=async function(req,res){
    const post=await Post.findById(req.query.post_id);
    const user=await post.likes.indexOf(req.query.user_id)
    if (user===-1){
        post.likes.push([req.query.user_name,req.query.user_id])
        await Post.findByIdAndUpdate(req.query.post_id,{likes:post.likes})
        req.flash("success",`Like added`)
        return res.redirect("back")
    }
    else{
        console.log("User already liked")
        req.flash("success",`Already liked`)
        return res.redirect("back")
    }

}

module.exports.addComment= async function(req,res){
    const post=await Post.findById(req.query.post_id)
    post.comments.push([req.query.commented_user,req.body.comment]);
    await Post.findByIdAndUpdate(req.query.post_id,{comments:post.comments})
    req.flash("success",`Comment added`)
    return res.redirect("back")
    
}
module.exports.sharePost= async function(req,res){
    req.flash("success",`Temporarily unavailable`)
    return res.redirect("back")
    
}
module.exports.addFriend= async function(req,res){
    console.log(req.query.user_id,req.query.user_name)
    const user = await User.findById(req.query.user_id)
    const is_friendship_exist=user.friendList.findIndex((ele)=>ele[1]===req.query.friend_id)
    if (is_friendship_exist===-1){
        user.friendList.push([req.query.user_name,req.query.friend_id])
        await User.findByIdAndUpdate(req.query.user_id,{friendList:user.friendList})
        req.flash("success",`Added friend`)
        return res.redirect("back")
    }else{
        req.flash("success",`Already in friend list`)
        return res.redirect("back")
    }
}
module.exports.deleteFriend= async function(req,res){
    const user = await User.findById(req.query.user_id)
    const newFriendList = user.friendList.filter((ele)=>ele[1]!=req.query.friend_id)
    console.log("new friend list",newFriendList,req.query.friend_id)
    await User.findByIdAndUpdate(req.query.user_id,{friendList:newFriendList})
    req.flash("success",`Friend deleted successfully`)
    return res.redirect("back")
}
