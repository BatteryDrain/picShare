import fs from "fs";
import path from "path";

/**
 * downloadPhoto middleware
 * Requires:
 *   req.photo (attached earlier by a findPhoto middleware)
 *   req.user (optional if protected)
 */
export const downloadPhoto = () => {
  return async (req, res, next) => {
    try {
      const photo = req.photo;

      if (!photo) {
        return res.status(404).json({ msg: "Photo not found" });
      }

      /* ---------- Authorization Check ---------- */

      if (photo.isPrivate) {
        if (!req.user || photo.owner.toString() !== req.user.id) {
          return res.status(403).json({ msg: "Forbidden" });
        }
      }

      /* ---------- Resolve Safe File Path ---------- */

      const uploadsDir = path.resolve("uploads/photos");
      const filePath = path.resolve(uploadsDir, photo.filename);

      // Prevent path traversal attack
      if (!filePath.startsWith(uploadsDir)) {
        return res.status(400).json({ msg: "Invalid file path" });
      }

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ msg: "File not found on server" });
      }

      /* ---------- Set Headers ---------- */

      res.setHeader("Content-Type", photo.mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${photo.filename}"`
      );

      /* ---------- Stream File ---------- */

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);

      stream.on("error", (err) => {
        next(err);
      });

    } catch (error) {
      next(error);
    }
  };
};