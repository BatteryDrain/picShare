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
