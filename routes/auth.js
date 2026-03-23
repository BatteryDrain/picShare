import express from "express";
import { noStore} from "../middleware/cache.js";
import { authLimiter } from "../middleware/limiter.js"; 
import { authMiddleware } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { csrfProtection } from "../config/csrfConfig.js";
import {regAuth, csrfTokenAuth, loginAuth, logoutAuth, resetPasswordAuth, forgotPasswordAuth, getProfileAuth, googleAuth, googleCallbackAuth, verifyEmailAuth, adminAuth, refreshTokenAuth} from "../controllers/auth.js";
const router = express.Router();

router.post("/login", noStore, csrfProtection, authLimiter, loginAuth);
router.post("/register", noStore, regAuth);
router.post("/logout", noStore , logoutAuth);
router.post("/refresh", noStore, refreshTokenAuth);
router.post("/forgot-password", noStore, forgotPasswordAuth);
router.post("/reset-password", noStore, resetPasswordAuth);
router.post("/verify-email", noStore, verifyEmailAuth);
router.get("/profile", noStore, authMiddleware, authorize("user"), getProfileAuth);
router.get("/auth/google", noStore, googleAuth);
router.get("/auth/google/callback", noStore, googleCallbackAuth);
router.get("/admin", noStore, authMiddleware, authorize("admin"), adminAuth);
router.get("/csrf-token", noStore, csrfProtection, csrfTokenAuth);

export default router;