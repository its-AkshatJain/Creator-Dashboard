import express from 'express';
import { fetchRedditPosts, fetchTwitterPosts } from '../controllers/feedController.js';

const router = express.Router();

// Get Reddit Posts
router.get('/reddit', fetchRedditPosts);

// Get Twitter Posts
router.get('/twitter', fetchTwitterPosts);

export default router;
