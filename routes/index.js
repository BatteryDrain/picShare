import express from 'express';
import post from './post.js';
import authRoutes from './auth.js';
import userRoutes from './user.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('post', post);


export default router;