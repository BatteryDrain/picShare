import express from 'express';
import { publicCache, privateCache, noStore } from '../middleware/cache.js';
import { uploadPhoto } from '../middleware/upload.js';
import { downloadPhoto } from '../middleware/download.js';
import { uploadPhotoController } from '../controllers/photo.js';

const router = express.Router();


router.get('/feed', publicCache(60), (req, res) => {
    res.send("Get Photo Feed Endpoint");
});

router.get('/explore', publicCache(60), (req, res) => {
    res.send("Get Explore Photos Endpoint");
});

router.post('/', noStore, uploadPhoto.single('photo'), uploadPhotoController ); 

router.get('/:id/download', privateCache(86400), downloadPhoto, (req, res) => {
    res.send("Download Photo Endpoint");
});

router.get('/:id/comments', publicCache(60), (req, res) => {
    res.send("Get Photo Comments Endpoint");
});

router.post('/:id/comments', noStore, (req, res) => {
    res.send("Add Comment to Photo Endpoint");
});

router.delete('/:id/comments/:commentId', noStore, (req, res) => {
    res.send("Delete Comment from Photo Endpoint");
});

router.get('/:id/likes', publicCache(30), (req, res) => {
    res.send("Get Photo Likes Endpoint");
});

router.post('/:id/likes', noStore, (req, res) => {
    res.send("Like Photo Endpoint");
});

router.delete('/:id/likes', noStore, (req, res) => {
    res.send("Unlike Photo Endpoint");
});

router.get('/:id', publicCache(120), (req, res) => {
    res.send("Get Photo Endpoint");
});

router.put('/:id', noStore, (req, res) => {
    res.send("Update Photo Endpoint");
});

router.delete('/:id', noStore, (req, res) => {
    res.send("Delete Photo Endpoint");
});

export default router;