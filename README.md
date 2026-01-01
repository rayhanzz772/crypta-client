<div align="center">

# 🔐 crypta-client

**The official Node.js SDK for Crypta Secret Manager**

_Secure, simple, and elegant secret management for your applications_

[![npm version](https://img.shields.io/npm/v/crypta-client.svg?style=flat-square&color=cb3837)](https://www.npmjs.com/package/crypta-client)
[![npm downloads](https://img.shields.io/npm/dm/crypta-client.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/crypta-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D14-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

[Getting Started](#-quick-start) •
[Documentation](#-api-reference) •
[Security](#-security) •
[Contributing](#-contributing)

</div>

---

## ✨ Why crypta-client?

**crypta-client** provides a seamless way to access secrets from [Crypta Secret Manager](https://crypta.rayhanprojects.site) using secure **service account authentication (JWT RS256)**. Built for **server-to-server** communication with a **zero-trust, short-lived token** security model.

| Feature                       | Description                                                  |
| ----------------------------- | ------------------------------------------------------------ |
| 🔐 **Secure by Default**      | RS256 JWT authentication with automatic key rotation support |
| 🔄 **Smart Token Management** | Built-in caching & automatic token refresh                   |
| 🚀 **Developer Friendly**     | Intuitive API with TypeScript-like clarity                   |
| ⚡ **Lightweight**            | Only 2 dependencies, minimal footprint                       |
| 🛡️ **Battle-tested Errors**   | Comprehensive error handling with actionable messages        |
| 📦 **Zero Config**            | Works out of the box with sensible defaults                  |

---

## 📦 Installation

```bash
npm install crypta-client
```

```bash
# or with yarn
yarn add crypta-client
```

```bash
# or with pnpm
pnpm add crypta-client
```

---

## 🚀 Quick Start

Get up and running in under a minute:

```javascript
const fs = require('fs')
const { CryptaClient } = require('crypta-client')

// Load your private key
const privateKey = fs.readFileSync('./private_key.pem', 'utf8')

// Initialize the client
const client = new CryptaClient({
  baseUrl: 'https://api.rayhanprojects.site',
  clientId: 'your-service-account@project.crypta',
  privateKeyPem: privateKey
})

// Fetch your secrets! 🎉
const dbPassword = await client.getSecret('database/password')
console.log('Connected with:', dbPassword)
```

**That's it!** No complex configuration, no manual token management.

---

## ⚙️ Configuration

### Prerequisites

Before using crypta-client, ensure you have:

- ✅ **Node.js** version 14 or higher
- ✅ **Crypta Service Account** with `client_id` and RSA private key
- ✅ **IAM Binding** with role: `secret.accessor`

### Service Account Setup

When you create a service account in Crypta, you'll receive:

| Credential    | Description                                           |
| ------------- | ----------------------------------------------------- |
| `client_id`   | Unique identifier (e.g., `my-service@project.crypta`) |
| `private_key` | RSA private key in PEM format (**shown only once!**)  |

---

## 🔑 Private Key Storage

Choose the approach that best fits your deployment:

<details>
<summary><b>📁 Option 1: File Storage</b> (Recommended for development)</summary>

<br>

**1. Create the key file:**

```bash
# private_key.pem
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASC...
-----END PRIVATE KEY-----
```

**2. Add to `.gitignore`:**

```gitignore
# Private keys
*.pem
private_key*
```

**3. Load in your application:**

```javascript
const privateKey = fs.readFileSync('./private_key.pem', 'utf8')
```

</details>

<details>
<summary><b>🌐 Option 2: Environment Variables</b> (Recommended for production)</summary>

<br>

**1. Set the environment variable:**

```bash
export CRYPTA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvg...\n-----END PRIVATE KEY-----"
```

**2. Load and normalize in your application:**

```javascript
const privateKey = process.env.CRYPTA_PRIVATE_KEY.replace(/\\n/g, '\n')
```

**💡 Pro tip:** Use a `.env` file with [dotenv](https://www.npmjs.com/package/dotenv) for local development.

</details>

<details>
<summary><b>☁️ Option 3: Cloud Secret Managers</b> (Recommended for cloud deployments)</summary>

<br>

Store your Crypta private key in your cloud provider's secret manager:

- **AWS:** AWS Secrets Manager or SSM Parameter Store
- **GCP:** Google Secret Manager
- **Azure:** Azure Key Vault

This provides an additional layer of security and centralized key management.

</details>

---

## 📖 API Reference

### Constructor

```javascript
new CryptaClient(options)
```

| Parameter       | Type     | Required | Description                  |
| --------------- | -------- | :------: | ---------------------------- |
| `baseUrl`       | `string` |    ✅    | Crypta API endpoint          |
| `clientId`      | `string` |    ✅    | Service account identifier   |
| `privateKeyPem` | `string` |    ✅    | RSA private key (PEM format) |

> 💡 **Note:** The `audience` is automatically derived from `baseUrl` — no manual configuration needed!

---

### Methods

#### `getSecret(name)`

Retrieves the **latest enabled version** of a secret.

```javascript
const secret = await client.getSecret('my-secret-name')
```

| Parameter | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `name`    | `string` | The secret name as stored in Crypta |

**Returns:** `Promise<string>` — The decrypted secret value

---

## ⚠️ Error Handling

The client throws `CryptaError` with descriptive status codes:

```javascript
try {
  await client.getSecret('missing-secret')
} catch (error) {
  console.error(error.statusCode) // 404
  console.error(error.message) // "Secret not found"
}
```

### Error Reference

| Status | Meaning               | Suggested Action                      |
| :----: | --------------------- | ------------------------------------- |
| `401`  | Authentication failed | Verify `clientId` and `privateKeyPem` |
| `403`  | Permission denied     | Check IAM role bindings               |
| `404`  | Secret not found      | Verify secret name exists             |
| `500`  | Server error          | Retry or contact support              |

---

## 🔒 Security

### How Authentication Works

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Your App      │      │     Crypta      │      │    Secrets      │
│                 │      │     Server      │      │    Storage      │
└────────┬────────┘      └────────┬────────┘      └────────┬────────┘
         │                        │                        │
         │  1. JWT Assertion      │                        │
         │  (signed with RS256)   │                        │
         │───────────────────────>│                        │
         │                        │                        │
         │  2. Access Token       │                        │
         │  (short-lived)         │                        │
         │<───────────────────────│                        │
         │                        │                        │
         │  3. Request Secret     │                        │
         │  (with Bearer token)   │                        │
         │───────────────────────>│  4. Fetch & Decrypt    │
         │                        │───────────────────────>│
         │                        │<───────────────────────│
         │  5. Secret Value       │                        │
         │<───────────────────────│                        │
         │                        │                        │
```

### Security Best Practices

| Practice                   | Description                          |
| -------------------------- | ------------------------------------ |
| 🔑 **Key Isolation**       | Private keys never leave the client  |
| 📋 **Public Key Storage**  | Crypta only stores your public key   |
| ⏱️ **Short-lived Tokens**  | Access tokens expire quickly         |
| 🚫 **No Caching**          | Secrets are never cached locally     |
| 🔐 **Envelope Encryption** | Industry-standard encryption at rest |

> ⚠️ **Important:** Never commit private keys to version control. If a key is exposed, rotate it immediately in the Crypta dashboard.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🐛 Report bugs** — Open an issue with reproduction steps
2. **💡 Suggest features** — We'd love to hear your ideas
3. **🔧 Submit PRs** — Fork, branch, code, and submit!

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📝 Changelog

### v0.1.6 — _Latest_

- 🎉 Initial public release
- 🔐 Service account authentication (RS256)
- 📡 Secret access API
- 🔄 Automatic token management

---

<div align="center">

**Made with ❤️ by [Rayhan](https://github.com/rayhanzz772)**

⭐ Star us on [GitHub](https://github.com/rayhanzz772/crypta-client) if you find this useful!

[Report Bug](https://github.com/rayhanzz772/crypta-client/issues) •
[Request Feature](https://github.com/rayhanzz772/crypta-client/issues)

</div>
