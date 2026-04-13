import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import path from "path";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";
import { intError, notFound } from "./middleware/errorHandler.js";
import googleOAuth from "./config/googleOauth.js";
import { publicCache } from "./middleware/cache.js";

const app = express();

const isDev = process.env.NODE_ENV !== "production";

app.set("trust proxy", 1);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(compression());
app.use(cookieParser());


if (isDev) {
  app.use(
    helmet({
      contentSecurityPolicy: true, 
    })
  );
} else {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "blob:"],
          connectSrc: ["'self'"],
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


const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true, 
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 1 * 24 * 60 * 60,  
    }),
    cookie: {
      secure: !isDev,
      httpOnly: true,
      sameSite: isDev ? "lax" : "strict",
      maxAge: 15 * 60 * 1000,
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());

googleOAuth();


app.use("/uploads", express.static("uploads", publicCache(7 * 24 * 60 * 60)));


app.use("/api/v1", routes);


if (!isDev) {
  app.use(express.static("dist"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve("dist", "index.html"));
  });
}


app.use(notFound);
app.use(intError);

export default app;