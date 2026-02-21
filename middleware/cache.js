export const publicCache = (duration = 300) => (req, res) => {
    res.set("Cache-Control", `public, max-age=${duration}`);
};
export const privateCache = (duration = 300) => (req, res) => {
    res.set("Cache-Control", `public, max-age=${duration}`);
};
export const noStore = (req, res) => {
    res.set("Cache-Control", "no-store");
};