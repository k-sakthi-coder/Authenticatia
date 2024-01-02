const mongoose= require("mongoose");

const multer=require("multer");
const path=require("path");
const POST=path.join("http://localhost:5000/uploads/posts")

const postSchema= new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    photo:{
        type:String
    },
    filename:{
        type:String
    },
    postedAt:{
        type:String
    },
    likes:{
        type:Array,
        default:[]
    },
    comments:{
        type:Array,
        default:[]
    },
    shares:{
        type:Array,
        default:[]
    }
},{
    timestamps:true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', POST));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
});

postSchema.statics.uploadedPost=multer({storage}).single("photo");
postSchema.statics.postPath=POST;

const Post = mongoose.model("Post",postSchema);
module.exports=Post;

