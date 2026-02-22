import express from "express";
import { publicCache, noStore } from "../middleware/cache.js";

const router = express.Router();

router.get("/:id", publicCache(120), (req, res) => {
  res.send("User Profile");
});
router.put("/:id", noStore, (req, res) => {
  res.send("Update User Profile");
});
router.get("/:id/photos", publicCache(120), (req, res) => {
  res.send("Get User Photos");
});


export default router;