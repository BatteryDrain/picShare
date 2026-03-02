const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, "image.png");
    }
});

