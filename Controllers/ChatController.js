import ChatModel from "../Models/ChatModel.js";

export const createChat = async(req,res)=>{
    

    try {
        const chatExist = await await ChatModel.findOne({
            members:{$all:[req.body.senderId,req.body.receiverId]}
        })
        if(chatExist){
            return res.status(400).json({message:"chat already exist"})
        }
        const newChat = new ChatModel({
            members: [req.body.senderId,req.body.receiverId]
        })
        const result = await newChat.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error)
    }
}

export const userChats = async(req,res)=>{
    try {
        const chat = await ChatModel.find({
            members:{$in:[req.params.userId]}
        })
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const findChat = async(req,res)=>{
    try {
        const chat = await ChatModel.findOne({
            members:{$all:[req.params.firstId,req.params.secondId]}
        })
        console.log(chat,'chatcontroller findchat')
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
}