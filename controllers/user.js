import User from "../models/user.js";
import { validateAndSanitize } from "../utils/validator.js";
import { encrypt, decrypt } from "../utils/crypt.js";

export const updateProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { username, email, bio } = validateAndSanitize(req.body);

    if (!username && !email && !bio) {
      return res.status(400).json({ message: "No data provided" });
    }

    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = encrypt(email);
    if (bio) updateData.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -googleId -__v");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id.toString(),
        username: updatedUser.username,
      }
    });

  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const safeDecrypt = (value) => {
  if (!value || typeof value !== "string") return "";

  try {
    return decrypt(value);
  } catch (err) {
    console.error("Decryption failed for value:", value, "Error:", err.message);
    return value;
  }
};

export const getProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id)
      .select("-password -googleId -__v")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User profile",
      user: {
        id: user._id.toString(),
        username: user.username,
        email: safeDecrypt(user?.email),
        bio: user.bio,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof req.logout === "function") {
      req.logout(() => {});
    }

    res.clearCookie("sid", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
