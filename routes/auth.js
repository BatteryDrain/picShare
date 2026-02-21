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

export default router;