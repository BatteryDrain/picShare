export const publicCache = (duration = 300) => (req, res, next) => {
    res.set("Cache-Control", `public, max-age=${duration}`);
    next();
};
export const privateCache = (duration = 300) => (req, res, next) => {
    res.set("Cache-Control", `private, max-age=${duration}`);
    next();
};
export const noStore = (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
};