export const publicCache = (duration = 300) => (req, res, next) => {
    res.set("Cache-Control", `public, max-age=${duration}`, "must-revalidate");
    next();
};
export const privateCache = (duration = 300) => (req, res, next) => {
    res.set("Cache-Control", `private, max-age=${duration}`, "must-revalidate");
    next();
};
export const noStore = (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
};
    function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    //please rember to add a JWT_SECRET to env before testing
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = decoded;
        next();
    });
    }
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.use('/api', authenticateToken);
