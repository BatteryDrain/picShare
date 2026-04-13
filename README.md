# Secure User Profile System

## Overview

This project is a full-stack web application implementing secure user authentication, profile management, and data protection techniques. It emphasizes input validation, output encoding, encryption, and secure session management.

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

<<<<<<<<< Temporary merge branch 1
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
=========
Create .env files in both server and client directories.

```env
PORT=3001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
ENCRYPTION_KEY=your_encryption_key
```

## 4. Run the Application

```bash
npm run dev
```

or

```bash
npm start
```

## Application Access

Frontend: http://localhost:3000
Backend API: http://localhost:3001/api/v1

Input Validation Techniques

All incoming data is validated and sanitized using:

validateAndSanitize(req.body)

| Field    | Rule                        |
| -------- | --------------------------- |
| Email    | Must match regex format     |
| Username | Required, trimmed           |
| Bio      | Max 500 chars, no HTML tags |

Techniques Used
Regex validation
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

HTML stripping
/<[^>]*>?/

Length restriction
bio.length <= 500

## Attack Mitigation

| Attack Type     | Mitigation         |
| --------------- | ------------------ |
| XSS             | HTML filtering     |
| SQL Injection   | Mongoose ORM       |
| NoSQL Injection | Input sanitization |
| Data Pollution  | Strict validation  |

Edge Cases Handled
Empty inputs → rejected
Long payloads → rejected
Script tags → stripped
Invalid emails → blocked

## Output Encoding Methods

### Backend

Sensitive fields are decrypted safely:

email: safeDecrypt(user.email)

### Frontend

React automatically escapes output:

<p>{user.bio}</p>

Example

Input:

<script>alert("XSS")</script>

Rendered Output:

<script>alert("XSS")</script>

Displayed safely, NOT executed

## Protection Summary

| Scenario         | Protection       |
| ---------------- | ---------------- |
| Script injection | Rendered as text |
| HTML payload     | Escaped          |
| Stored XSS       | Neutralized      |

Libraries / Mechanisms
React (auto-escaping JSX)
Custom safeDecrypt
No dangerouslySetInnerHTML

## Encryption Techniques

Sensitive data is encrypted before storage:

updateData.email = encrypt(email);
updateData.bio = encrypt(bio);

## Encryption Flow

User submits data
Data validated
Data encrypted
Stored in DB
Decrypted when needed

## Strategy

AES-based symmetric encryption

Applied to:

- Email
- Bio

## Security Benefits

| Benefit         | Description             |
| --------------- | ----------------------- |
| Data at rest    | Encrypted               |
| Confidentiality | Protected               |
| Secure access   | Backend-only decryption |

## Dependency Management

Tools Used

- Express
- Mongoose
- JWT Authentication
- Custom Encryption Utilities

## Best Practices

Lock versions (package-lock.json)
Run audits:
npm audit fix
Avoid deprecated packages
Minimize dependencies

## Risks Managed

| Risk                 | Mitigation     |
| -------------------- | -------------- |
| Vulnerable packages  | Regular audits |
| Supply chain attacks | Minimal deps   |
| Version conflicts    | Lockfiles      |

## Vulnerabilities from Improper Validation

1. XSS

`<script>alert(1)</script>`

1. NoSQL Injection
`{ "email": { "$ne": null } }`

1. DoS

Large payloads overload server

1. Data Integrity Issues

Malformed data breaks logic

1. Mass Assignment
{ "role": "admin" }

## Mitigation Strategies

Regex validation
Sanitization
Payload limits
Field whitelisting

## Output Encoding (Deep Dive)

Concept

Encoding converts:

< > " '

into safe equivalents

Result

- Scripts are not executed
- Data is safely displayed

## Encryption Challenges & Solutions

### Choosing Encryption

Solution: AES-256 (Node crypto)

### Cannot Query Encrypted Data

Solution:

- Store encrypted value
- Store hashed value for lookup

### Re-encryption Issues

Solution:

Only encrypt changed fields

### Key Management

- Store in .env
- Use strong keys
- Never hardcode

## Automated Dependency Updates

Workflow Features

- Runs weekly
- Uses npm audit fix
- Creates PR: tj → staging → main

Workflow Steps

- Checkout tj branch
- Install Node.js
- Install dependencies
- Run audit fix
- Create PR

## Audit Strategy

| Scenario           | Action          |
| ------------------ | --------------- |
| Low severity       | Monitor         |
| Safe fix available | Apply           |
| Breaking change    | Review          |
| Critical issue     | Fix immediately |

## Automation Risks

- Silent breaking changes
- Dependency conflicts
- False sense of security

## Lessons Learned

🔴 Challenge 1: Encrypted Data in UI

Problem:
Frontend received encrypted data

Solution:
Decrypt in backend (safeDecrypt)

🔴 Challenge 2: XSS Protection

Problem:
Multi-layer vulnerability

Solution:

- Frontend validation
- Backend sanitization
- React escaping

## Trade-offs

| Challenge            | Insight       |
| -------------------- | ------------- |
| Encryption vs search | Use hashing   |
| Strict validation    | Balance UX    |
| Data corruption      | Safe fallback |

## Key Takeaways

Input validation prevents injection attacks
Output encoding prevents execution
Encryption protects sensitive data
Defense-in-depth is essential
