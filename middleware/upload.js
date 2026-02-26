import multer from "multer";
import path from "path";

const dirName = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(dirName, "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "image" + ext);
  }
});

export const upload = multer({
    storage,
});