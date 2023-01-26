import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";
import router from "../Routes/PostRoute.js";


//Create new Post

export const createPost = async(req,res)=>{
    const newPost = new PostModel(req.body);
    try {
        await newPost.save()
        res.status(200).json(newPost)
    } catch (error) {
        res.status(500).json(error)
    }

}

//get a post

export const getPost = async(req,res)=>{
    const id = req.params.id
    try {
        const post = await PostModel.findById(id)
        res.status(200).json(post)
    } catch (error) {
        
    }
}

//Update a post

export const updatePost = async(req,res) =>{
    const postId = req.params.id
    const {userId} = req.body;
    try {
        const post = await PostModel.findById(postId)
        if(post.userId === userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("post udpdated")
        }else{
            res.status(403).json("Action forbidden")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


//Delete a post

export const deletePost = async(req,res)=> {
    const id = req.params.id
    console.log(id)
    const userId = req.body.currentUser;
    console.log(userId,'deletePost');
    try {
        const post = await PostModel.findById(id)
        if(post.userId === userId){
            await post.deleteOne();
            res.status(200).json("Post deleted successfully")
        }else{
            res.status(403).json("Action forbidden")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//Like a post

export const likePost = async(req,res)=>{
    const id = req.params.id;
    const {userId} = req.body
    try {
        const post = await PostModel.findById(id)
        if(!post.likes.includes(userId)){
            await post.updateOne({$push:{likes:userId}})
            res.status(200).json("Post liked")
        }else{
            await post.updateOne({$pull:{likes:userId}})
            res.status(200).json("Post unliked")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


//Get Timeline Posts
export const getTimelinePosts = async(req,res)=>{
    const userId = req.params.id

    try {
        const currentUserPosts = await PostModel.find({userId: userId})
        const followingPosts = await UserModel.aggregate([
            {
                $match:{
                    _id : new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup:{
                    from : "posts",
                    localField:"following",
                    foreignField:"userId",
                    as:"followingPosts"
                }
            },
            {
                $project:{
                    followingPosts : 1,
                    _id: 0
                }
            }
        ])

        res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPosts).sort((a,b)=>{
            return b.createdAt - a.createdAt;
        }))
    } catch (error) {
        res.status(500).json(error)
    }
}


// add a comment

export const commentPost = async(req,res) =>{
    const comment = req.body;
    console.log(req.params.id);
    console.log(comment);
    const post = await PostModel.findById(req.params.id)
    const commentData = await post.updateOne({$push:{comments:comment}})
    console.log(commentData);
}


// delete a comment

export const deleteComment = async(req,res)=>{
    const {commentId} = req.body
    console.log(commentId,'hei')
    const post = await PostModel.findById(req.params.id)
    console.log(post)
    const removeComment = await post.updateOne({$pull:{comments:{_id:commentId}}})
}


export const reportPost = async(req,res) =>{
    const id = req.params.id
    console.log(id,'heloo')
    console.log(req.body,'report post')
    
    const response = await PostModel.findByIdAndUpdate(id,{$push:{reports:req.body}})
}

export const getReportedPosts = async(req,res) =>{
    const posts = await PostModel.find()
    const reportedPosts = posts.filter((post)=>post.reports.length > 0)
    console.log(posts,'posts',reportedPosts,'posts with reports')
    res.status(200).json(reportedPosts)
}