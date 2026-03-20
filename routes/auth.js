import express from "express";
import { noStore, privateCache } from "../middleware/cache.js";
import { authLimiter } from "../middleware/limiter.js"; 
import { authMiddleware } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import {regAuth, loginAuth, logoutAuth, resetPasswordAuth, forgotPasswordAuth, getProfileAuth, googleAuth, googleCallbackAuth, verifyEmailAuth, adminAuth} from "../controllers/auth.js";
const router = express.Router();

router.post("/login", noStore, loginAuth, authLimiter);
router.post("/register", noStore, regAuth);
router.post("/logout", noStore , logoutAuth);
router.post("/refresh", noStore, (req, res) => {
    res.send("Refresh Token Endpoint");
});
router.post("/forgot-password", noStore, forgotPasswordAuth);
router.post("/reset-password", noStore, resetPasswordAuth);
router.post("/verify-email", noStore, verifyEmailAuth);
router.get("/profile", noStore, getProfileAuth);
router.get("/auth/google", noStore, googleAuth);
router.get("/auth/google/callback", noStore, googleCallbackAuth);
router.get("/admin", privateCache, authMiddleware, authorize("admin"), adminAuth);

export default router;