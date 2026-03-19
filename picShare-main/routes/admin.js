import express from require("express");
import authorize from require("../middleware/authorize");
import authMiddleware from require("../middleware/auth");
import router from express.Router();

router.get("/protected", authMiddleware, authorize("admin"), (req, res) => {
  res.status(200).json({ message: "Welcome admin user" });
});

export default router;