import express from "express";
import helmet from "helmet";
import compression from "compression";
import { intError, notFound } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";
import cors from "cors";
import path from "path";

const app = express();

app.disable("x-powered-by");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());

const isDev = process.env.NODE_ENV !== "production";

if (isDev) {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );
} else {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "blob:"],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
        },
      },
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );
}

if (isDev) {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

app.get("/", (req, res) => {
  res.set("Cache-Control", "public, max-age=300");
  res.send("App Homepage");
});

app.use(express.static("dist"));
if (!isDev){
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("dist", "index.html"));
  });
}

app.use("/api/v1", routes);
app.use(notFound);
app.use(intError);

export default app;
