import express from 'express';
// import post from './post.js';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import photoRoutes from './photos.js';

const router = express.Router();

router.use('/', authRoutes);
router.use('/user', userRoutes);
router.use('/photos', photoRoutes);

export default router;