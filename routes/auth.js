import express from "express";
import { noStore} from "../middleware/cache.js";
import { authLimiter } from "../middleware/limiter.js"; 
import { authMiddleware } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { csrfProtection } from "../config/csrfConfig.js";
import {regAuth, csrfTokenAuth, loginAuth, logoutAuth, resetPasswordAuth, forgotPasswordAuth, googleAuth, googleCallbackAuth, verifyEmailAuth, adminAuth, refreshTokenAuth, sessionAuth} from "../controllers/auth.js";
const router = express.Router();

router.post("/login", noStore, authLimiter, loginAuth);
router.post("/register", noStore, regAuth);
router.post("/logout", noStore , logoutAuth);
router.post("/refresh", noStore, refreshTokenAuth);
router.post("/forgot-password", noStore, forgotPasswordAuth);
router.post("/reset-password", noStore, resetPasswordAuth);
router.post("/verify-email", noStore, verifyEmailAuth);
router.get("/auth/google", noStore, googleAuth);
router.get("/auth/google/callback", noStore, googleCallbackAuth);
router.get("/admin", noStore, authMiddleware, authorize("admin"), adminAuth);
router.get("/csrf-token", noStore, csrfProtection, csrfTokenAuth);
router.get("/session", noStore, authMiddleware, sessionAuth);

export default router;