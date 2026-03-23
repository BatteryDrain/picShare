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

---

## Session Security

* Session ID regeneration after login
* Prevents session fixation attacks

---

## CSRF Protection

* Implemented using `csurf`
* Applied only to sensitive routes
* Token fetched via `/csrf-token`

---

## ✅ Cookie Security

```js
httpOnly: true
secure: true (production)
sameSite: "strict"
```

---

## ✅ Rate Limiting & Account Lockout

* 10 requests per 15 minutes (IP-based)
* Account locked after 5 failed attempts
* Lock duration: 15 minutes

---

## ✅ Anti-Enumeration

Generic error messages:

```json
"Invalid username or password"
```

---

## ✅ Role-Based Access Control

Roles:

* `user`
* `admin`

Access is controlled via JWT payload and middleware.

---

## ✅ OAuth Integration

* Google OAuth using Passport
* Users are created automatically if they don’t exist
* JWT issued after successful authentication

---

# 📁 Project Structure (Simplified)

```
/config
  googleOauth.js

/controllers
  auth.js

/middleware
  authMiddleware.js
  errorHandler.js

/models
  user.js

/routes
  auth.js
  index.js

/app.js
/server.js
```

---

# 🧪 Testing Strategy

## 🔍 Approach

* Manual API testing using Postman
* Simulated edge cases:

  * Invalid login attempts
  * Token expiration
  * Missing/invalid refresh tokens
  * CSRF token absence

---

## 🐛 Issues Found & Fixes

| Issue               | Fix                                 |
| ------------------- | ----------------------------------- |
| Duplicate responses | Ensured single response per request |
| Token mismatch      | Unified access token strategy       |
| CSRF errors         | Scoped middleware correctly         |
| Session fixation    | Added session regeneration          |

---

## 🧠 Prioritization Strategy

1. Critical security vulnerabilities (auth bypass, token leaks)
2. Authentication logic bugs
3. UX issues (unnecessary redirects, errors)
4. Performance & cleanup

---

# 🧠 Reflection Checkpoint

## 🔹 Authentication Method Choice

I chose a **hybrid authentication system combining JWT and session-based authentication**. JWT was used for stateless authentication and scalability, while sessions were retained for OAuth flows. My decision was influenced by prior experience with SPA applications where JWT simplifies API communication, and OAuth requires session handling for secure third-party authentication.

---

## 🔹 Access Control Structure

I implemented a **role-based access control (RBAC)** system with two roles: `user` and `admin`. This approach was chosen for simplicity and scalability. The main challenge was ensuring role validation remained consistent across both JWT-protected routes and frontend routing without duplicating logic.

---

## 🔹 Security vs User Experience Trade-offs

A key trade-off was between **security and seamless user experience**. Short-lived access tokens improve security but can interrupt users if not handled properly. To solve this, I implemented a **refresh token system** that silently renews access tokens without requiring re-login. The challenge was ensuring this flow remained secure while being invisible to the user.

---

## 🔹 Token Storage Strategy

I used a **hybrid storage approach**:

* Access tokens in localStorage (for ease of use)
* Refresh tokens in HttpOnly cookies (for security)

This decision balances usability with protection against XSS attacks. One challenge was managing CORS and cookie configurations correctly across environments.

---

## 🔹 Security Risks & Mitigation

### Identified Risks:

* XSS attacks
* CSRF attacks
* Brute-force login attempts
* Session fixation
* Token theft

### Mitigations:

* HttpOnly cookies for refresh tokens
* CSRF middleware protection
* Rate limiting + account lockout
* Session regeneration after login
* Generic error messages to prevent enumeration

---

## 🔹 Session Security & Usability

To secure sessions, I:

* Regenerated session IDs after login
* Limited token lifespan
* Used secure cookie attributes

The challenge was ensuring these measures did not disrupt the user experience. The refresh token system helped maintain continuity without forcing frequent logins.

---

## 🔹 Testing & Robustness

I tested the system by simulating:

* Expired tokens
* Invalid credentials
* Multiple failed login attempts
* Missing CSRF tokens

### Vulnerabilities Found:

* Duplicate response handling
* Incorrect token flow
* CSRF misconfiguration

All were resolved by restructuring middleware and enforcing strict validation.

---

# 🚀 Conclusion

This project demonstrates a **secure, scalable, and user-friendly authentication system** that follows modern best practices. It balances:

* 🔐 Security (token strategy, CSRF, rate limiting)
* ⚡ Performance (stateless JWT)
* 👤 User Experience (silent refresh, OAuth)

---

# 📌 Future Improvements

* Refresh token rotation
* Device/session tracking
* Multi-factor authentication (MFA)
* Audit logs for security monitoring

---

**Author:** Your Name
**Project:** Secure Authentication System
