import express from "express";
import { noStore } from "../middleware/cache.js";
import {regAuth, loginAuth} from "../controllers/auth.js";


const router = express.Router();

router.post("/login", noStore, loginAuth);
router.post("/register", noStore, regAuth);
router.post("/logout", noStore );
router.post("/refresh", noStore, (req, res) => {
    res.send("Refresh Token Endpoint");
});
router.post("/forgot-password", noStore, (req, res) => {
    res.send("Forgot Password Endpoint");
});
router.post("/reset-password", noStore, (req, res) => {
    res.send("Reset Password Endpoint");
});
router.post("/verify-email", noStore, (req, res) => {
    res.send("Verify Email Endpoint");
});
router.get("/profile", noStore, (req, res) => {
    res.send("Get User Profile Endpoint");
});

app.post('/login', async (req, res) => {

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token });
});

export default router;