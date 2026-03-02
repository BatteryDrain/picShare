import express from "express";
import { noStore } from "../middleware/cache.js";

const router = express.Router();

router.post("/login", noStore, (req, res) => {
   res.send("Login Endpoint");
});
router.post("/register", noStore, (req, res) => {
    res.send("Register Endpoint");
});
router.post("/logout", noStore, (req, res) => {
    res.send("Logout Endpoint");
});
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

export default router;