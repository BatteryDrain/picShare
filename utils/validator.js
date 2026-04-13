export const validateAndSanitize = (data) => {
  let { username, email, bio } = data;

  username = username?.trim();
  email = email?.trim();
  bio = bio?.trim();

  // USERNAME (optional)
  if (username && !/^[a-zA-Z0-9._-]{3,30}$/.test(username)) {
    throw new Error("Invalid username");
  }

  // EMAIL (optional)
  if (email && !validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  // BIO (optional)
  if (bio) {
    if (bio.length > 500) {
      throw new Error("Bio too long");
    }

    if (/<[^>]*>?/.test(bio)) {
      throw new Error("HTML not allowed");
    }

    if (!/^[a-zA-Z0-9\s.,!?'-]*$/.test(bio)) {
      throw new Error("Invalid characters in bio");
    }
  }

  // SANITIZE
  return {
    username: username ? xss(username) : undefined,
    email: email ? xss(email) : undefined,
    bio: bio ? xss(bio) : undefined,
  };
};