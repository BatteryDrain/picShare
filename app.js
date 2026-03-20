import express from "express";
import helmet from "helmet";
import compression from "compression";
import { intError, notFound } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";
import cors from "cors";
import path from "path";
import session from "express-session";
import passport from "passport";
import {GoogleOAuth} from "./config/googleOauth.js";


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());


const isDev = process.env.NODE_ENV !== "production";

if (isDev) {
  app.use(
    helmet({
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: true,
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

const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : [];

if (isDev) {
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: isDev
    ? { secure: false }
    : { secure: true, httpOnly: true, sameSite: "strict" }
}));

app.use(passport.initialize());
app.use(passport.session());

GoogleOAuth();


app.use("/uploads", express.static("uploads"));

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
