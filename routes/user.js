import express from "express";
import { publicCache, noStore } from "../middleware/cache.js";

const router = express.Router();

router.get("/:id", publicCache(120), (req, res) => {
  res.send("User Public Profile");
});
router.put("/:id", noStore, (req, res) => {
  res.send("Update User Profile");
});
router.delete("/:id", noStore, (req, res) => {
  res.send("Delete User Account");
});
router.get("/:id/photos", publicCache(120), (req, res) => {
  res.send("Get User Photos");
});
router.get("/:id/followers", publicCache(120), (req, res) => {
  res.send("Get User Followers");
});
router.get("/:id/following", publicCache(120), (req, res) => {
  res.send("Get User Following");
});
router.post("/:id/follow", noStore, (req, res) => {
  res.send("Follow User");
});
router.post("/:id/unfollow", noStore, (req, res) => {
  res.send("Unfollow User");
});





export default router;