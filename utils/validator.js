import validator from "validator";
import xss from "xss";

export const validateAndSanitize = (data) => {
  let { username, email, bio } = data;

  // Trim
  username = username?.trim();
  email = email?.trim();
  bio = bio?.trim();

  // Validate Name
  if (!/^[A-Za-z\s]{3,50}$/.test(username)) {
    throw new Error("Invalid username");
  }

  // Validate Email
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  // Validate Bio
  if (bio.length > 500) {
    throw new Error("Bio too long");
  }

  if (/<[^>]*>?/.test(bio)) {
    throw new Error("HTML not allowed");
  }

  if (!/^[a-zA-Z0-9\s.,!?'-]*$/.test(bio)) {
    throw new Error("Invalid characters in bio");
  }

  // Sanitize (remove XSS payloads)
  username = xss(username);
  email = xss(email);
  bio = xss(bio);

  return { username, email, bio };
};