import express from "express";
import { loginUser, registerUser,  resendotp,  verifyotp } from "../Controllers/AuthController.js";

const router = express.Router();


router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/verifyotp',verifyotp)
router.post('/resendotp',resendotp)


export default router;