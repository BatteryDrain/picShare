# Secure User Profile System

## Overview

This project is a full-stack web application implementing secure user authentication, profile management, and data protection techniques. It emphasizes input validation, output encoding, encryption, and secure session management.

## Installation & Setup

## 1. Clone the Repository

```bash
git clone <repo-url>
cd <project-folder>
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Environment Setup

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

Frontend: [http://localhost:3000](http://localhost:3000)
Backend API: [http://localhost:3001/api/v1](http://localhost:3001/api/v1)

## Input Validation Techniques

All incoming data is validated and sanitized using:

validateAndSanitize(req.body)

| Field    | Rule                        |
| -------- | --------------------------- |
| Email    | Must match regex format     |
| Username | Required, trimmed           |
| Bio      | Max 500 chars, no HTML tags |

## Techniques Used

- Regex validation
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

- HTML stripping
/<[^>]*>?/

- Length restriction
bio.length <= 500

## Attack Mitigation

| Attack Type     | Mitigation         |
| --------------- | ------------------ |
| XSS             | HTML filtering     |
| SQL Injection   | Mongoose ORM       |
| NoSQL Injection | Input sanitization |
| Data Pollution  | Strict validation  |

## Edge Cases Handled

- Empty inputs → rejected
- Long payloads → rejected
- Script tags → stripped
- Invalid emails → blocked

## Output Encoding Methods

### Backend

Sensitive fields are decrypted safely:

email: safeDecrypt(user.email)

### Frontend

React automatically escapes output:

{user.bio}

Example

Input:

`<script>alert("XSS")</script>`

Rendered Output:

`<script>alert("XSS")</script>`

Displayed safely, NOT executed

## Protection Summary

| Scenario         | Protection       |
| ---------------- | ---------------- |
| Script injection | Rendered as text |
| HTML payload     | Escaped          |
| Stored XSS       | Neutralized      |

## Libraries / Mechanisms

- React (auto-escaping JSX)
- Custom safeDecrypt
- No dangerouslySetInnerHTML

## Encryption Techniques

Sensitive data is encrypted before storage:

updateData.email = encrypt(email);
updateData.bio = encrypt(bio);

## Encryption Flow

- User submits data
- Data validated
- Data encrypted
- Stored in DB
- Decrypted when needed

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

- Lock versions (package-lock.json)
- Run audits:
- npm audit fix
- Avoid deprecated packages
- Minimize dependencies

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

- Regex validation
- Sanitization
- Payload limits
- Field whitelisting

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

## Security Process Documentation

### Security Testing

The application was tested using a combination of manual and automated techniques to identify potential vulnerabilities.

1. Manual Testing

SQL/NoSQL Injection

- Tested login and API endpoints using payloads such as:
' OR 1=1 --
- Verified that inputs were properly validated and rejected.
Cross-Site Scripting (XSS)

Injected payloads such as:

`<script>alert("XSS")</script>`

- Tested across form fields and user-generated content areas.

Authentication Testing

- Attempted to access protected routes without a valid token
- Tested token manipulation and reuse

File Upload Testing

- Uploaded invalid file types disguised as images
- Tested file size limits and format validation

1. Automated Testing

Ran:

```bash
npm audit
```

Identified vulnerable or outdated dependencies

Performed dynamic scanning using:

- OWASP ZAP

Verified:

- Security headers
- Input validation issues
- Common web vulnerabilities

### Vulnerability Fixes

1. Cross-Site Scripting (XSS)

- Sanitized all user inputs before rendering
- Avoided unsafe rendering methods
- Validation: Retested payloads → scripts no longer executed

1. Injection Attacks (NoSQL)

- Implemented strict input validation
- Prevented dynamic query manipulation
- Validation: Injection attempts rejected successfully

1. Insecure File Upload

- Validated MIME types instead of file extensions
- Added file size restrictions
- Stored files securely outside public access
- Validation: Malicious files rejected

1. Authentication Weaknesses

- Implemented HTTP-only cookies for tokens
- Added token expiration and validation middleware
- Validation: Unauthorized access attempts blocked

1. Missing Security Headers

- Added security middleware (e.g., Helmet)
- Validation: Headers confirmed via security scan

1. Vulnerable Dependencies

- Updated packages using:

npm audit fix

- Validation: Reduced or eliminated known vulnerabilities

### Testing Tools

| Tool                  | Purpose                  | Contribution                                       |
| --------------------- | ------------------------ | -------------------------------------------------- |
| OWASP ZAP             | Dynamic security testing | Identified XSS, headers, and misconfigurations     |
| npm audit             | Dependency scanning      | Detected vulnerable packages                       |
| Browser DevTools      | Manual testing           | Simulated request tampering and token manipulation |
| Threat Modeling Tools | System analysis          | Helped identify risks using STRIDE framework       |

### Before vs After Security Improvements

This section highlights the key security gaps identified during testing and the improvements implemented to address them.

| Area                      | Before                                                      | After                                                    | Impact                                            |
| ------------------------- | ----------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------- |
| **Input Validation**      | Minimal validation on client-side                           | Strict validation on both client and server              | Prevents injection attacks and malformed data     |
| **XSS Protection**        | User input rendered without sanitization                    | Inputs sanitized and safely rendered                     | Eliminates script injection risks                 |
| **Authentication**        | Tokens loosely handled (e.g., accessible in client storage) | Tokens stored in HTTP-only cookies with validation       | Reduces risk of token theft and session hijacking |
| **File Uploads**          | Only file extension checked                                 | MIME type validation + file size limits + secure storage | Prevents malicious file uploads                   |
| **API Security**          | Inconsistent validation across endpoints                    | Centralized validation and middleware enforcement        | Ensures consistent protection across all routes   |
| **Security Headers**      | Missing or incomplete headers                               | Implemented headers using middleware (e.g., Helmet)      | Protects against common web attacks               |
| **Dependencies**          | Outdated packages with vulnerabilities                      | Updated using npm audit fix                              | Reduces known security risks                      |
| **Access Control (RBAC)** | Role checks partially enforced                              | Strict server-side role validation                       | Prevents privilege escalation                     |
| **Logging & Monitoring**  | Limited or no activity tracking                             | Improved logging for key actions                         | Enhances accountability and auditing              |

### Key Security Lessons Learned

- Security must be integrated early in development, not added after.
- Manual testing is essential for uncovering real-world attack scenarios that automated tools may miss.
- Automated tools are valuable for quickly identifying known vulnerabilities and configuration issues.
- File uploads and authentication systems are high-risk areas that require multiple layers of protection.
- Balancing security and usability is critical—overly strict validation can negatively impact user experience.
- Continuous security improvement is necessary, including regular testing, dependency updates, and monitoring
