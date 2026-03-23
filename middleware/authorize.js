export const authorize = (roles = []) => {
   
    if (typeof roles === "string") {
        roles = [roles];
    }

    return (req, res, next) => {
        const userRole = req.user?.role;

       
        if (!userRole) {
            return res.status(403).json({ message: "Forbidden: No role assigned" });
        }

        if (roles.length > 0 && !roles.includes(userRole)) {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }

        next();
    };
};
