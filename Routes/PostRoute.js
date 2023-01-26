import express from 'express';
import { commentPost, createPost, deleteComment, deletePost, getPost, getReportedPosts, getTimelinePosts, likePost, reportPost, updatePost } from '../Controllers/PostController.js';
const router = express.Router();


router.post('/',createPost)
router.get('/:id',getPost)
router.put('/:id',updatePost)
router.post('/:id/delete',deletePost)
router.put('/:id/like',likePost)
router.get('/:id/timeline',getTimelinePosts)
router.put('/:id/comment',commentPost)
router.post('/:id/deleteComment',deleteComment)
router.post('/reportpost/:id',reportPost)
router.post('/getreportedposts',getReportedPosts)
export default router;