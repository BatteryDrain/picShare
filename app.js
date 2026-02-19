import express from 'express';
import helmet from "helmet";

const app = express();
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
    crossOriginEmbedderPolicy: true,
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
    res.send("App Homepage");
    });

export default app;