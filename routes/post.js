

const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.post("/upload", upload.single("image"), (req, res) => {
    res.json({
        message: "Image uploaded successfully",
        filename: req.file.filename
    });
});

module.exports = router;
