import express from 'express';
import { addMessage, getMessages } from '../Controllers/MessageController.js';
import authMiddleWare from '../MiddleWare/authMiddleWare.js';
const router = express.Router()


router.post('/',authMiddleWare,addMessage)
router.get('/:chatId',authMiddleWare,getMessages)

export default router