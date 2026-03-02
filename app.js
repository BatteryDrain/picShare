const express = require("express");
const cors = require("cors");

const postRoutes = require("./routes/post");

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use("/uploads", express.static("uploads"));

app.use("/api", postRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
