import express from 'express';
import { commentPost, createPost, deleteComment, deletePost, getPost, getReportedPosts, getTimelinePosts, likePost, reportedPostRemove, reportPost, updatePost } from '../Controllers/PostController.js';
import authMiddleWare from '../MiddleWare/authMiddleWare.js';
const router = express.Router();


router.post('/',authMiddleWare,createPost)
router.get('/:id',authMiddleWare,getPost)
router.put('/:id',authMiddleWare,updatePost)
router.post('/:id/delete',authMiddleWare,deletePost)
router.put('/:id/like',authMiddleWare,likePost)
router.get('/:id/timeline',authMiddleWare,getTimelinePosts)
router.put('/:id/comment',authMiddleWare,commentPost)
router.post('/:id/deleteComment',authMiddleWare,deleteComment)
router.post('/reportpost/:id',authMiddleWare,reportPost)
router.post('/getreportedposts',authMiddleWare,getReportedPosts)
router.post('/reportedpostremove/:id',authMiddleWare,reportedPostRemove)
export default router;