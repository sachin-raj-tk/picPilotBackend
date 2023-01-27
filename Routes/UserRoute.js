import express from 'express';
import { blockuser, deleteUser, followUser, getAllUsers, getUser, getUserData, getVerifyNotifications, isFamousRequest, makeIsFamous, savepost, unfollowUser, updateUser } from '../Controllers/UserController.js';
import authMiddleWare from '../MiddleWare/authMiddleWare.js';
const router = express.Router();

router.get('/',getAllUsers)
router.get('/:id',getUser)
router.put('/:id',authMiddleWare, updateUser)
router.delete('/:id',authMiddleWare,deleteUser)
router.put('/:id/follow', authMiddleWare,followUser)
router.put('/:id/unfollow', authMiddleWare,unfollowUser)
router.post('/getdata',getUserData)
router.post('/blockuser/:id',blockuser)
router.post('/savepostapi/:id',savepost)
router.post('/isfamousrequest/:id',isFamousRequest)
router.post('/getverifynotifications',getVerifyNotifications)
router.post('/makeisfamous/:id',makeIsFamous)

export default router;

//jwt