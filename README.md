# Secure Authentication System

## Overview

This project implements an authentication system using modern security practices while maintaining a smooth user experience. It supports:

* Local authentication (username & password)
* Secure password hashing with Argon2
* JWT-based authentication (access + refresh tokens)
* Google OAuth (SSO)
* Role-based access control (RBAC)
* CSRF protection
* Rate limiting & account lockout
* Session fixation prevention
* Secure cookie handling

---

## Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB (Atlas) & Compass
* **Authentication:** JWT, Passport (Google OAuth)
* **Security:** Argon2, Helmet, CSRF, Rate Limiting
* **Session Store:** MongoDB (connect-mongo)

---

## Installation & Setup

## 1. Clone the Repository

```bash
git clone <repo-url>
cd <project-folder>
```

---

## 2. Install Dependencies

```bash
npm install
```

### Key Dependencies Used

express mongoose dotenv cors helmet compression
argon2 jsonwebtoken passport passport-google-oauth20
express-session connect-mongo
csurf cookie-parser
express-rate-limit

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
---

## 3. Environment Variables

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection
SESSION_SECRET=your_session_secret

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

```

---

## 4. Run the Application

```bash
npm run dev
```

or

```bash
npm start
```

---

## Authentication Architecture

## Token Strategy

| Token Type    | Storage         | Expiry     |
| Access Token  | localStorage    | 15 minutes |
| Refresh Token | HttpOnly Cookie | 7 days     |

---

## Flow

1. User logs in, receives access token + refresh token cookie
2. Access token used for API requests
3. When expired, frontend calls `/refresh`
4. Backend validates refresh token and issues new access token

---

## Security Features

## Password Security

* Argon2 hashing
* No plaintext password storage

## Local Authentication (Username & Password)

**Flow**
User submits credentials (username + password)
Server validates input
Server retrieves user from database
Password is verified using hashing
Tokens are issued upon successful authentication

**Password Hashing with Argon2**
Passwords are never stored in plaintext. Instead, they are hashed using Argon2, a modern and secure hashing algorithm designed to resist brute-force and GPU-based attacks.

**Security Benefits**
Prevents password exposure if database is compromised
Protects against rainbow table attacks
Ensures each password hash is unique

## Single Sign-On (SSO)

The system integrates SSO using Google OAuth 2.0, allowing users to authenticate via their Google accounts.

**OAuth Flow**
User clicks “Continue with Google”
Redirected to Google login page
Google authenticates user
Callback returns user profile
Server:
Finds or creates user
Issues JWT
User is redirected back to frontend

## OAuth Integration

* Google OAuth using Passport
* Users are created automatically if they don’t exist
* JWT issued after successful authentication

**Security Benefits**
No password storage required for SSO users
Delegates authentication to trusted provider
Reduces risk of credential theft

---

## Session Security

* Session ID regeneration after login
* Prevents session fixation attacks

---

## CSRF Protection

Because cookies are used, the system implements Cross-Site Request Forgery (CSRF) protection.

* Implemented using `csurf`
* Applied only to sensitive routes
* Token fetched via `/csrf-token`
* Server generates a CSRF token
* Frontend includes token in requests
* Server validates token before processing

### Security Benefit

Prevents attackers from:
Forcing users to perform actions unknowingly
Exploiting authenticated sessions

---

## Cookie Security

```js
httpOnly: true
secure: true (production)
sameSite: "strict"
```

---

## Rate Limiting & Account Lockout

* 10 requests per 15 minutes (IP-based)
* Account locked after 5 failed attempts
* Lock duration: 15 minutes

---

## Anti-Enumeration

Generic error messages:

```json
"Invalid username or password"
```

---

## Role-Based Access Control

Roles:

* `user`
* `admin`

Access is controlled via JWT payload and middleware.

**User Role**
Permissions:
Access personal dashboard
Perform authenticated user actions

Restrictions:
Cannot access admin routes

**Admin Role**
Permissions:
Access admin dashboard

Restrictions:
Cannot access a user dashboard as admin

### RBAC Middleware Design

Authorization is enforced using middleware that:
Verifies the JWT
Extracts user role
Checks if role has permission
Grants or denies access

RBAC is also enforced on our frontend as well.

---

## Testing Strategy

## Approach

* Manual API testing using Postman
* Simulated edge cases:

  * Invalid login attempts
  * Token expiration
  * Missing/invalid refresh tokens
  * CSRF token absence

---

## Issues Found & Fixes

| Issue               | Fix                                 |
| ------------------- | ----------------------------------- |
| Token mismatch      | Unified access token strategy       |
| CSRF errors         | Scoped middleware correctly         |
| Session fixation    | Added session regeneration          |

---

## Tejiri's Reflection Checkpoint

### Authentication Method Choice

I chose a hybrid authentication system combining JWT and session-based authentication. JWT was used for stateless authentication and scalability, while sessions were retained for OAuth flows. My decision was influenced by prior experience with SPA applications where JWT simplifies API communication, and OAuth requires session handling for secure third-party authentication.

---

## Access Control Structure

I implemented a role-based access control (RBAC) system with two roles: `user` and `admin`. This approach was chosen for simplicity and scalability. The main challenge was ensuring role validation remained consistent across both JWT-protected routes and frontend routing without duplicating logic.

---

## Security vs User Experience Trade-offs

A key trade-off was between security and seamless user experience. Short-lived access tokens improve security but can interrupt users if not handled properly. To solve this, I implemented a refresh token system that silently renews access tokens without requiring re-login. The challenge was ensuring this flow remained secure while being invisible to the user.

---

## Token Storage Strategy

I used a hybrid storage approach:

* Access tokens in localStorage (for ease of use)
* Refresh tokens in HttpOnly cookies (for security)

This decision balances usability with protection against XSS attacks. One challenge was managing CORS and cookie configurations correctly across environments.

---

## Security Risks & Mitigation

### Identified Risks

* XSS attacks
* CSRF attacks
* Brute-force login attempts
* Session fixation
* Token theft

### Mitigations

* HttpOnly cookies for refresh tokens
* CSRF middleware protection
* Rate limiting + account lockout
* Session regeneration after login
* Generic error messages to prevent enumeration

---

## Session Security & Usability

To secure sessions, I:

* Regenerated session IDs after login
* Limited token lifespan
* Used secure cookie attributes

The challenge was ensuring these measures did not disrupt the user experience. The refresh token system helped maintain continuity without forcing frequent logins.

---

## Testing & Robustness

I tested the system by simulating:

* Expired tokens
* Invalid credentials
* Multiple failed login attempts
* Missing CSRF tokens

### Vulnerabilities Found

* Duplicate response handling
* Incorrect token flow
* CSRF misconfiguration

All were resolved by restructuring middleware and enforcing strict validation.

---

**Author:** Tejiri Makele
