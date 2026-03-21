import User from "../models/user.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import passport from "passport";
import user from "../models/user.js";

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
      const message =
        existingUser.email === email
          ? "Email already in use"
          : "Username already taken";

      return res.status(400).json({ message });
    }
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
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

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}


export const loginAuth = async (req, res) => {
  
  try {

    const { username, password } = req.body;
    const userExist = await User.findOne({ username });
    if (!userExist)
      return res.status(400).json({ message: `${username} not found` });

    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCK_TIME = 15 * 60 * 60 * 1000;

    if (userExist && userExist.lockUntil && userExist.lockUntil > Date.now()) {
      return res.status(403).json({ message: "Account locked. Try again later." });
    } 

    const isMatch = await argon2.verify(userExist.password, password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid login credentials" });

    userExist.loginAttempts += 1;

    if (userExist.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      userExist.lockUntil = Date.now() + LOCK_TIME;
      await userExist.save();
      return res.status(400).json({ message: "Invalid login attempts. Try again later." });
    }

    userExist.loginAttempts = 0;
    userExist.lockUntil = null;

    req.session.regenerate(async (err) => {
      if (err) {
        return res.status(500).json({ message: "Session error" });
      }

      req.session.userId = userExist._id;
    

    const accessToken = generateAccessToken(userExist);
    const refreshToken = generateRefreshToken(userExist);
    
    userExist.refreshToken = refreshToken;
    await userExist.save();
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: userExist._id,
        username: userExist.username,
        role: userExist.role,
      },
      token: accessToken,
    });
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

  user.hashedPassword = await argon2.hash(newPassword);
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
        res.redirect(`/oauth-success?token=${token}`);
      });
    }
  );
};

export const getProfileAuth = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -googleId -createdAt -updatedAt -__v");

  if(!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.status(200).json({ message: "User profile",  user });
};

export const adminAuth = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -googleId -isEmailVerified -_id -createdAt -updatedAt -__v");
  res.status(200).json({ message: "Admin access granted", user });
};

export const refreshTokenAuth = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "No refresh token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== token) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const newAccessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
  res.json({ token : newAccessToken });

 } catch (err) {
    res.status(403).json({ message: "Expired refresh token" });
  }
};

export const csrfTokenAuth = (req, res) => {
  const csrfToken = req.csrfToken();
  res.json({ csrfToken });
};