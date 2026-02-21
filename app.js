import express from "express";
import helmet from "helmet";
import compression from "compression";
import { intError, notFound } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";


const app = express();

app.disable("x-powered-by");

app.use(express.json());
app.use(compression());

const isDev = process.env.NODE_ENV !== "production";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: {
      policy: "same-origin",
    },
    crossOriginResourcePolicy: {
      policy: "same-origin",
    },
    referrerPolicy: {
      policy: "no-referrer",
    },
    strictTransportSecurity: isDev
      ? false
      : {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        },
    xContentTypeOptions: true,
    xDnsPrefetchControl: {
      allow: true,
    },
    xFrameOptions: {
      action: "DENY",
    },
    xPoweredBy: false,
  })
);

app.get("/", (req, res) => {
  res.set("Cache-Control", "public, max-age=300");
  res.send("App Homepage");
});

app.use("/api/v1", routes);
app.use(notFound);
app.use(intError);

export default app;
