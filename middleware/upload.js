import multer from "multer";

// const upload = multer({
//   dest: "uploads/"
// });

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "image" + ext);
  }
});

