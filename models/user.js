import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
  
    password: {
        type: String,
        required: function() {
            return !this.googleId;
        },
    },
   
    googleId: {
        type: String,
        unique: true,
        sparse: true, 
    },
    avatar: {
        type: String,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    loginAttempts: {
        type: Number,
        default: 0,
    },
    lockUntil: {
        type: Number,
    },
}, { timestamps: true });

export default mongoose.model("User", userSchema);