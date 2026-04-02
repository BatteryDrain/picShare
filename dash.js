import router from ".";

export const postProfileAuth = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -googleId -createdAt -updatedAt -__v");
 
  if(!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
 
  res.status(200).json({ message: "User profile",  user });
};

export default router;