import express from 'express';
import { publicCache } from '../middleware/cache.js';

const router = express.Router();

router.get('/photos?q=:query', publicCache(30), (req, res) => {
    res.send("Search Photos Endpoint");
});
router.get('/users?q=:query', publicCache(30), (req, res) => {   
    res.send("Search Users Endpoint");
});
