import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    desc: String,
    likes: [],
    image: String,
    comments:[{
        commentedUser:{
            type:String,
            required: true
        },
        comment:{
            type:String,
            required:true
        },
        time:{
            type: Date,
            required: true
        },
        user:{
            type:String,
            required:true
        }
    }],
    reports:[{
        reportedUser:{
            type:String,
            required:true
        },
        reason:{
            type:String,
            required:true
        }
    }]
},{
    timestamps: true
})

var PostModel = mongoose.model("Posts",postSchema);
export default PostModel; 