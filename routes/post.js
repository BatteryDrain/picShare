import express from "express";
import {upload} from "../middleware/upload.js";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const app = express();
const PORT = 3000;

router.post("/uploads", upload, (req, res) => {
    res.send('your uploads');
});

// app.get("/download", (req, res) => {
//     const filePath = path.join(__dirname, "uploads", "image.png");

//     res.download(filePath, "downloaded-image.png", (err) => {
//         if (err) {
//             console.error(err);
//             res.status(404).send("File not found");
//         }
//     });
// });

export default router;
