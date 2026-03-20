import User from "../models/user.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import passport from "passport";

export const regAuth = async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, email, password: hashedPassword, role});
    await newUser.save();
    res
      .status(201)
      .json({
        message: "User registered successfully",
        newUser: {
          id: newUser._id,
          email: newUser.email,
          username: newUser.username,
        },
      });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginAuth = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExist = await User.findOne({ username });
    if (!userExist)
      return res.status(400).json({ message: `${username} not found` });

    const isMatch = await argon2.verify(userExist.password, password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: userExist._id, role: userExist.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({
        message: "Login successful",
        userExist: { id: userExist._id, username: userExist.username },
        token,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutAuth = async (req, res) => {

    res.status(200).json({ message: "Logout successful" });
 
};

export const forgotPasswordAuth = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 60;
  await user.save();

  res.status(200).json({ message: "Password reset token generated", token });
};

export const resetPasswordAuth = async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.Hpass = await argon2.hash(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};

export const verifyEmailAuth = async (req, res) => {
  res.status(200).json({ message: "Email verification endpoint" });
};

export const googleAuth = async (req, res) => {
  passport.authenticate(
    "google",
    { scope: ["profile", "email"] },
    (err, user, info) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Authentication error", error: err });
      }
      if (!user) {
        return res.status(401).json({ message: "Authentication failed", info });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login error", error: err });
        }
        res.status(200).json({ message: "Authentication successful", user });
      });
    }
  )(req, res);
};

export const googleCallbackAuth = async (req, res) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    (err, user) => {
      if (err || !user) {
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.redirect("/login");
        }
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.redirect(`/profile?token=${token}`);
      });
    }
  );
};

export const getProfileAuth = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(200).json({ message: "User profile", user: req.user });
};

export const adminAuth = async (req, res) => {
  res.status(200).json({ message: "Admin access granted" });
};