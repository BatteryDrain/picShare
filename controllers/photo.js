export const uploadPhotoController = async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          msg: "No photo file uploaded"
        });
      }
  
      res.status(201).json({
        msg: "Photo uploaded successfully",
        file: req.file.filename
      });
  
    } catch (error) {
      next(error);
    }
  };