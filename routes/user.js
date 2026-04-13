import express from "express";
import { publicCache, noStore } from "../middleware/cache.js";
import { getProfile, deleteUser, updateProfile } from "../controllers/user.js";
import { authMiddleware } from "../middleware/auth.js";
import { apiLimiter } from "../middleware/limiter.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.get("/profile", authMiddleware, publicCache(120), getProfile);

router.patch(
  "/profile",
  authMiddleware,
  apiLimiter,
  noStore,
  updateProfile
);

router.delete(
  "/profile",
  authMiddleware,
  authorize("admin"),
  apiLimiter,
  noStore,
  deleteUser
);
router.get("/:id/photos", authMiddleware, publicCache(120), (req, res) => {
  res.send("Get User Photos");
});
router.get("/:id/followers", publicCache(120), (req, res) => {
  res.send("Get User Followers");
});
router.get("/:id/following", publicCache(120), (req, res) => {
  res.send("Get User Following");
});
router.post("/:id/follow", authMiddleware, apiLimiter, (req, res) => {
  res.send("Follow User");
});
router.post("/:id/unfollow", noStore, (req, res) => {
  res.send("Unfollow User");
});


export default router;