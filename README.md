# Secure Photo Sharing App

A secure, production-ready photo-sharing API built with Express.js, HTTPS, Helmet security headers, and optimized caching strategies.

# Project Overview

This application allows users to:

1. Create profiles
2. Upload photos with descriptions and tags
3. Like, share and comment on posts
4. Follow photographers
5. View a public feed
6. Curate favorite galleries

# SSL Configuration

Production Method
Let’s Encrypt + Certbot

Steps:


Local Development
OpenSSL Self-Signed Certificate
- install openssl
Generate:
- openssl req -nodes -new -x509 -keyout private.key -out certificate.crt

Used for local HTTPS testing only.

# Security Headers Implemented

Content-Security-Policy (CSP)
X-Frame-Options (Clickjacking prevention)
Strict-Transport-Security (HSTS)
X-Content-Type-Options
Referrer-Policy


# Caching Strategy

Before choosing caching strategies, we considered:
1. Authentication data exposure (login/signup must never cache)
2. User-specific content leaks
3. Stale content issues (likes/comments changing frequently)
4. Shared device/browser risks
5. CDN/proxy caching of sensitive responses
6. Token or session leakage

Route:
Cache Strategy used:
Why:
Security consideration:


# Trade-Offs



# Architecture

Express.js (Node.js)
HTTPS Server (Node https module)
Helmet Security Middleware
MVC Structure
Environment Config Support

# Setup Instructions

1. Install Dependencies
 - npm install
2. Configure SSL
3. Run Server
 - node server.js