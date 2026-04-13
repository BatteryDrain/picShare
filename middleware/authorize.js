export const authorize = (roles = []) => {
    // 1. Prepare the allowed roles list once when the route loads
    const allowedRoles = (typeof roles === "string" ? [roles] : roles)
        .map(role => role.toLowerCase());

    return (req, res, next) => {
        // 2. Get the role from the decoded JWT 
        const userRole = req.user?.role?.toLowerCase();

        console.log("--- Authorization Check ---");
        console.log("User Role from Token:", userRole);
        console.log("Required Roles for Route:", allowedRoles);

        if (!userRole) {
            return res.status(403).json({ 
                message: "Forbidden: No role assigned to this user" 
            });
        }

        // 3. Check if the user's role is in the allowed list
        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
            console.warn(`Access Denied: ${userRole} tried to access an ${allowedRoles} route.`);
            return res.status(403).json({ 
                message: "Forbidden: Insufficient permissions" 
            });
        }

        // 4. Success! Move to the controller
        next();
    };
};