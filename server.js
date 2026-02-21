import http from "http";
import https from "https";
import fs from "fs";
import app from "./app.js";
import path from "path";
import { fileURLToPath } from "url";

const dirName = path.dirname(fileURLToPath(import.meta.url));

// Serving http/https based on environment
const PORT = process.env.PORT || 3000;

const isDev = process.env.NODE_ENV !== "production";

if (isDev) {
  try {
    const sslOptions = {
      key: fs.readFileSync(path.resolve(dirName,"ssl","server.key")),
      cert: fs.readFileSync(path.resolve(dirName,"ssl","server.cert")),
    };

    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`Development Server running on https://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("SSL certificates not found.", err);
    http.createServer(app).listen(PORT, () => {
      console.log(`Development Server running on http://localhost:${PORT}`);
    });
  }
} else {
  http.createServer(app).listen(PORT, () => {
    console.log(`Production Server running on ${PORT}`);
  });
}
