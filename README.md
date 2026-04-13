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

⚠️ Vulnerabilities from Improper Input Validation

Improper input validation can introduce several serious security risks:

1. Cross-Site Scripting (XSS)

Attackers can inject malicious scripts (e.g., <script>alert(1)</script>) into input fields such as name or bio. If not handled properly, these scripts can execute in other users’ browsers.

2. NoSQL Injection

In MongoDB-based applications, attackers can manipulate queries using payloads like:

{ "email": { "$ne": null } }

This can bypass authentication or alter database queries if inputs are not strictly validated.

3. Denial of Service (DoS)

Allowing excessively large inputs can overload the server, leading to performance degradation or crashes.

4. Data Integrity Issues

Invalid or unexpected data formats (e.g., malformed emails or unsupported characters) can corrupt stored data and break application logic.

5. Mass Assignment Attacks

If input fields are not strictly controlled, attackers may inject additional properties (e.g., role: "admin") to escalate privileges.

✅ Mitigation Strategies Implemented
Strict regex-based validation
Input sanitization to remove malicious content
Payload size limits
Whitelisting allowed fields
🛡️ How Output Encoding Prevents XSS

Output encoding ensures that user input is treated as data, not executable code.

Example

Malicious Input:

<script>alert("Hacked")</script>

Encoded Output:

&lt;script&gt;alert("Hacked")&lt;/script&gt;

Instead of executing, the content is displayed safely as text.

Key Concept

Output encoding converts special characters (<, >, ", ') into harmless representations.

Implementation Notes
React automatically escapes content during rendering
Backend validation removes HTML tags before storage
Result

This layered approach ensures:

Malicious scripts are not stored
Even if stored, they are not executed
🔐 Encryption Challenges and Solutions
1. Choosing the Right Encryption Method

Challenge: Initially used a third-party library for encryption.
Issue: Less secure and not ideal for backend systems.

Solution:

Switched to Node.js built-in crypto
Implemented AES-256-GCM for strong encryption and integrity protection
2. Encrypted Data Cannot Be Queried

Challenge: Encrypted email fields cannot be searched or validated for uniqueness.

Solution:

Used a hybrid approach:
Store encrypted email for privacy
Store hashed email (SHA-256) for lookup and uniqueness checks
3. Decryption Failures

Challenge: Decryption may fail due to:

Corrupted data
Changed encryption keys
Legacy unencrypted values

Solution:

Implemented a safe decryption wrapper:
try {
  return decrypt(value);
} catch {
  return null;
}
4. Re-encrypting Unchanged Data

Challenge: Encryption produces different outputs each time, causing unnecessary database updates.

Solution:

Only encrypt fields when they are modified
Avoid redundant writes
5. Key Management

Challenge: Risk of exposing or using weak encryption keys.

Solution:

Store keys in environment variables (.env)
Use strong, randomly generated keys (32+ characters)
Never hardcode secrets in source code
🧠 Key Takeaways
Input validation is essential to prevent injection attacks, XSS, and data corruption.
Output encoding ensures user data is displayed safely without executing malicious code.
Encryption protects sensitive data but introduces challenges like searchability and key management.
A defense-in-depth approach—combining validation, sanitization, encryption, and encoding—is critical for building secure applications.

This workflow automates dependency maintenance by:

Running npm audit fix on a scheduled basis
Creating a pull request with safe updates
Ensuring updates go through a controlled review process (tj → staging → main)

This helps keep the application secure and up to date without introducing breaking changes automatically.

Workflow Breakdown
Permissions
contents: write → allows committing dependency updates
pull-requests: write → allows creating pull requests

Trigger

Runs automatically every Sunday at midnight
Can also be triggered manually

Job Configuration

Executes the workflow in a Linux environment

Checkout Branch

Checks out the tj branch
Ensures updates are applied to a safe development branch, not main

Setup Node

Installs Node.js v22
Enables dependency caching for faster builds

Install Dependencies

Performs a clean install using package-lock.json
Ensures consistency across environments

Audit and Fix Vulnerabilities

Scans dependencies for vulnerabilities
Automatically applies non-breaking fixes only
Updates package-lock.json (and sometimes package.json

Create Pull Request

Creates a new branch: tj-auto-updates
Commits dependency updates
Opens a pull request targeting the staging branch

Interpreting npm audit Output

Low Severity Vulnerability

cookie <0.7.0 → vulnerable
Used by csurf

Interpretation
Vulnerability exists in a transitive dependency
Severity is low
Fix may require breaking changes

Decision Strategy

| Scenario                     | Action                           |
| ---------------------------- | -------------------------------- |
| Low severity, no safe fix    | Accept temporarily, monitor      |
| Fix available (non-breaking) | Apply via npm audit fix          |
| Fix requires breaking change | Review manually before upgrading |
| Critical vulnerability       | Prioritize immediate update      |

The vulnerability exists in a transitive dependency (cookie) used by csurf. Since it is low severity and not directly exploitable in our architecture, I avoided using npm audit fix --force to prevent breaking changes. Instead, We documented the issue and plan to migrate away from csurf to a modern CSRF protection strategy using SameSite cookies and origin validation.

Why Outdated Third-Party Libraries Are Risky

Using outdated dependencies can lead to:

Security vulnerabilities (e.g., XSS, injection attacks)
Unpatched exploits known publicly
Compatibility issues with newer runtimes (Node 22)
Performance degradation
Loss of community support

How Automation Helps

Automation improves dependency management by:

Ensuring regular security checks
Reducing manual effort
Catching vulnerabilities early
Maintaining consistency across environments
Enforcing a structured update workflow (via pull requests)

Risks of Automation

While useful, automation introduces risks:

1. Silent Breaking Changes

Even safe updates can occasionally affect behavior.

2. Over-reliance on Tools

Developers may ignore audit reports without understanding them.

3. Dependency Conflicts

Automatic updates may introduce version incompatibilities.

4. False Sense of Security

Not all vulnerabilities are critical or exploitable in your context.

Security Testing

To ensure the application is secure, multiple test scenarios were simulated to validate protection against:

Cross-Site Scripting (XSS)
Injection attacks (including NoSQL-style injections)
Improper input handling

1. XSS Attack Testing
🧪 Test Inputs

```html
<script>alert("XSS")</script>
<img src=x onerror=alert(1)>
<b>bold</b>
```

Result
Frontend validation blocked:
HTML tags (/<[^>]*>?/)
Invalid characters
Backend sanitization (via xss or similar) ensures:
No script is stored
React automatically escapes output:
Prevents execution even if malicious data slips through

2. Injection Testing (NoSQL Injection)
🧪 Test Payloads

```json
{ "email": { "$ne": null } }
{ "username": { "$gt": "" } }
```

Inputs should be treated strictly as strings
Objects or operators ($ne, $gt) should be rejected

Result
Frontend restricts input format (regex)
Backend validation ensures:
Only expected data types are accepted
Mongoose schema + validation prevents query manipulation

Edge Case Testing
🧪 Large Input

Bio with 10,000+ characters is rejected due to maxLength

🧪 Special Characters

Bio: <script> or && || {}
This is rejected by regex validation

Empty Submission

Handled via validation checks before submission

TJ Reflection Checkpoint
Which vulnerabilities were most challenging to address?

The most challenging vulnerability to address was XSS (Cross-Site Scripting).

Why:
It can occur at multiple layers:
Input stage (user enters malicious code)
Storage stage (malicious code saved in DB)
Output stage (code rendered in UI)
Even if one layer fails, the system can be compromised

How it was resolved:
Frontend validation blocks HTML input
Backend sanitization removes malicious payloads
React automatically escapes output

What additional testing tools or strategies could improve the process?

🔧 1. Automated Security Scanners
npm audit → dependency vulnerabilities
SAST tools (e.g., static analysis)

🔍 2. Dynamic Testing Tools
OWASP ZAP → simulate real attack scenarios
Burp Suite → intercept and manipulate requests

🧪 3. Unit & Integration Testing
Test validation functions with malicious inputs
Test API endpoints with injection payloads

🔐 4. Fuzz Testing
Send random/unexpected inputs to detect edge-case failures

📊 5. Logging & Monitoring
Track suspicious input patterns
Detect repeated malicious attempts

TJ's Challenges

Balancing security vs usability

Challenges:

Encryption breaks search/uniqueness
Validation must be strict but flexible
Handling corrupted encrypted data safely
