import User from "../models/user.js";
import argon2 from "argon2";

export const regAuth = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const Hpass = await argon2.hash(password);
    const newUser = new User({ username, email, password: Hpass });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginAuth = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExist = await User.findOne({username });
    if (!userExist)
      return res.status(400).json({ message: `${username} not found` });

    const isMatch = await argon2.verify(userExist.password, password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
