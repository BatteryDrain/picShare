# Secure Photo Sharing App

A secure, production-ready photo-sharing API built with Express.js, HTTPS, Helmet security headers, and optimized caching strategies.

# Project Overview

This application allows users to:

1. Create profiles
2. Upload photos with descriptions and tags
3. Like and comment on posts
4. Follow photographers
5. View a public feed
6. Curate favorite galleries

# SSL Configuration

Production Method
Let’s Encrypt + Certbot

Steps:
Point domain to server IP.
Install Certbot:
sudo apt install certbot
Run:
sudo certbot --nginx
Certificates auto-renew every 90 days.

Local Development
OpenSSL Self-Signed Certificate

Generate:
openssl req -nodes -new -x509 -keyout private.key -out certificate.crt

Used for local HTTPS testing only.

# Security Headers Implemented

Content-Security-Policy (CSP)
X-Frame-Options (Clickjacking prevention)
Strict-Transport-Security (HSTS)
X-Content-Type-Options
Referrer-Policy

# Caching Strategy

GET /posts uses 5 min + stale to improve feed performance
GET /posts/:id uses 5 min to reduce database load
POST routes	uses no-store to prevent sensitive caching
GET /users/:id/profile uses 10 min because this is a safe public data

# Trade-Offs

Short caching window balances freshness and performance.
Avoided caching authenticated routes to prevent data leaks.
Used stale-while-revalidate to improve perceived speed.

# Architecture

Express.js (Node.js)
HTTPS Server (Node https module)
Helmet Security Middleware + manual headers
MVC Structure
Environment Config Support

# Setup Instructions

1. Install Dependencies
npm install
2. Configure SSL
3. Run Server
node server.js