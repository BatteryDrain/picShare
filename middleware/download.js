import fs from "fs";
import path from "path";

export const downloadPhoto = async (req, res, next) => {
  try {
    const photo = req.photo;

    if (!photo) {
      return res.status(404).json({ msg: "Photo not found" });
    }

    const uploadsDir = path.resolve("uploads");
    const filePath = path.resolve(uploadsDir, photo.filename);

    if (!filePath.startsWith(uploadsDir)) {
      return res.status(400).json({ msg: "Invalid file path" });
    }

    try {
        await fs.promises.access(filePath);
      } catch {
        return res.status(404).json({ msg: "File not found on server" });
      }

    return res.download(filePath, photo.filename);
  } catch (error) {
    next(error);
  }
};
