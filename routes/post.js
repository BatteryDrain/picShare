import express from "express";
import {storage} from "../middleware/upload.js";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

router.post("/uploads", storage, (req, res) => {
    res.send('your uploads');
});

export default router;
