# Secure Photo Sharing App

A secure, photo-sharing API built with Node.js and Express.js configured with HTTPS (SSL and TLS), Security headers, middlewares, route and optimized caching strategies per route.

## Tech Stack

- Node.js
- Express.js
- Helmet
- CORS
- Compression
- Multer
- HTTPS (SSL/TLS via self-signed or trusted cert)

## Project Overview

This application allows users to:

1. Create profiles
2. Upload photos with descriptions and tags
3. Like, share and comment on posts
4. Follow photographers
5. View a public feed
6. Curate favorite galleries

## Installation & Setup

1. clone repo
2. run npm install in your terminal to install dependecies
3. setup environment configuration file .env
4. start server with "npm run dev"

## SSL Configuration

Local Development
OpenSSL Self-Signed Certificate

### Step 1: Generate Certificate

In terminal:

- openssl req -nodes -new -x509 -keyout private.key -out certificate.key

Insight:
Https ensures encryption of data in transit, protects againts attacks, and it is required for production grade authentication. This is used for local HTTPS testing only.

Strategies:

- In production:
 we will use trusted CA "Let's Encrypt + Nginx"
 we will only forward traffic to Node over http internally.

### Step 2: Configure HTTPS Server

In server.js file we imported https from node modules to handle our SSL logic for development and production mode.

## Security Headers Implemented

Content-Security-Policy (CSP)

- This restricts resource loading sources.
- It helps prevent XSS attacks.
- In other to load external script, extra configuration is needed to ensure resources are not blocked by header.

X-Frame-Options (Clickjacking prevention)

- This prevents clickjacking.

Strict-Transport-Security (HSTS)

- This forces the browser to use HTTPS if avaliable.

X-Content-Type-Options

- This prevents MIME-type sniffing.
- It stops browsers from interpreting files incorrectly.

Referrer-Policy

- This prevents leaking origin info.

Cors was clearfully configured to eliminate cross-origin resource sharing issues, so that our frontend can can make request from a different domain. This relaxes the same-origin policy allowing our frontend to communicate with our backend api.

## Caching Strategy

Before choosing caching strategies, we considered:

1. Authentication data exposure (login/signup must never cache)
2. User-specific content leaks
3. Stale content issues (likes/comments changing frequently)
4. Shared device/browser risks
5. CDN/proxy caching of sensitive responses
6. Token or session leakage

Caching was controlled using custom middleware in "cache.js"

### Routes

Auth
Cache Strategy used: no-store
Why: This routes uses credentials and senstive payloads
Security consideration: Authentication pages should never be cache in other not to expose or leak sensitive data.

User/Photos
Cache Strategy used: Some of the route uses public, private and no-store
Why: A public user profile have non-sensitive data and that is safe to cache. 120secs was used because profiles dont frequently change. it improves frontend speed that is fast rendering, reduces repeated database hits. The trade off to this might delay profile update before it reflects.

A DELETE, PUT, POST route usually modifies senstive data, we implement no-store to prevent browser caching, proxy caching, and disk storage.
Security consideration: This protects authentication state and no sensitive payloads persist. Mutations should not be cached, this prevents the system server from returning stale data.

We used a private cache for our download route because some downloads may require authentication or include metadata. Using private ensures it is cached only in the user browser and not on shared proxies or cdn. 24hours is implemented because downloads are usually bandwidth heavy and the files are not often changed when uploaded.

By caching reads correctly:

- We reduce infrastructure cost
- Improve frontend speed
- Increase scalability

## Navigating the Codebase

app.js - This has the express app configuration
server.js - This has the HTTP/HTTPS server initialization
routes/ - This defines all routes logic
middleware/ This defines middleware logic for caching, download, upload, error-handling, and rate-limiter
controllers - This defines specific routes functions.

## Running the Server

### Development

- npm run dev

### Production

- npm start

## Reflection: Challenges, Solutions & Lessons Learned

Building this backend was not simply about defining routes and returning responses. It required deliberate decisions around security, scalability, caching, and real-world production tradeoffs.

### Designing a Caching Strategy That Balances Speed & Freshness

Photo sharing systems are extremely read-heavy, however data changes unpredictably and mutations must never be cached. The main difficulty was how do we improve performance without sacrificing correctness or security?

The Solution:
We implemented route-specific cache policies, rather than a blanket caching approach. we used short TTLs to avoid stale UX and reduce database hits.

Lesson Learnt:
Caching is not about “making things fast.” We figured is it also about understanding data volatility, understanding user expectations, protecting integrity, and reducing infrastructure cost.

### Securing Sensitive Operations

Endpoints such as; Upload photo, Follow/unfollow, Add comment, Delete account handle sensitive user actions. Caching these accidentally could, replay requests,store sensitive payloads, leak authentication tokens or break data consistency.

The Solution:
All mutation routes use no-store

Lesson Learnt:
Security must always override optimization.

### Handling Media Downloads Securely & Efficiently

Downloads are bandwidth-heavy, if not cached repeated downloads hit storage repeatedly, latency and infrastructure cost increases. However some downloads may require authentication.

The Solution:
We implemented a private control policy and max-age of 86400

Lesson Learnt:
Choosing the wrong caching policy can introduce serious security risks.

### SSL Configuration & HTTPS Enforcement

Local development often ignores HTTPS.

The Solution:

- Self-signed certificates for development
- Native Node https module
- Environment-based SSL configuration
- Designed for production migration to reverse proxy (Nginx)

Lesson Learnt:
Security should be built in first not later.

### Security Headers & Browser-Level Hardening

Modern attacks include:

- XSS
- Clickjacking
- MIME-type sniffing
- Mixed content
- Referrer leakage

Simply serving HTTPS is not enough.

The Solution:
Using Helmet and custom configurations, we implemented:

- HSTS
- CSP
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

Each header was chosen intentionally.

Lesson Learnt:
Security headers:

- Reduce attack surface significantly
- Protect users even if frontend makes mistakes
- Provide defense-in-depth

### Route Organization & Scalability Thinking

As features grow routes becomes messy, caching logic gets duplicated, middleware chains get inconsistent and maintenance becomes difficult.

The Solution:

- Domain-based route separation (user, photos, auth, index )
- Middleware abstraction (publicCache, privateCache, noStore)
- Clear versioning (/api/v1)
- Logical grouping of read vs mutation routes

Lesson Learnt:
Scalable systems start with clear organization.

## Future Improvements

- Rate limiting
- Logging
- API request validation

## Ben's Reflection

 At the beginning of this project, I was under the impression that we could finish this with routes in the backend. I was heavily mistaken as we needed to see routes making connections and cashing the CSS. As the backend has no CSS. To do this, we need a front-end. We have now made a front-end and a back-end with CSS caching.

## Ben's reflection 2
 One of the things that was difficult with this phase was the time allowed I recieved section A (auth) a day before this assiognment was due. I had to ask for an extention as I had to finish section B and C, giving us enoughf time to compleate the sections.
