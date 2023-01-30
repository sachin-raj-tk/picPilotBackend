import express from 'express';
import { createChat, findChat, userChats } from '../Controllers/ChatController.js';
import authMiddleWare from '../MiddleWare/authMiddleWare.js';
const router = express.Router()

router.post("/",authMiddleWare,createChat)
router.get("/:userId",authMiddleWare, userChats)
router.get("/find/:firstId/:secondId",authMiddleWare,findChat)

export default router