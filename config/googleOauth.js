import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";

export const GoogleOAuth = async () => {

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error("No email found in Google profile"), null);
        }
        
        let user = await User.findOne({ email });
       if (user) {
        if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
        }}
        else{
            user = await newUser({
                username: profile.displayName,
                email,
                googleId: profile.id,
                role: "user",
            })
        }
        return done(null, user);
        }
     catch (error) {
        return done(error, null);
    }
    }));
};