# crypta-client

[![npm version](https://img.shields.io/npm/v/crypta-client.svg)](https://www.npmjs.com/package/crypta-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`crypta-client` is a Node.js client for securely accessing secrets from **Crypta Secret Manager** using **service account authentication (JWT RS256)**.

This client is designed for **server-to-server** usage and follows a **zero-trust, short-lived token** security model.

---

## Features

- Secure service account authentication (JWT RS256)
- Automatic access token generation and refresh
- Simple API for accessing secrets
- Lightweight and dependency-minimal
- Clear error handling with HTTP status codes

---

## Installation

```bash
npm install crypta-client
```

---

## Requirements

- Node.js >= 14
- A Crypta instance
- A Service Account with:

  - `client_id`
  - RSA private key (PEM)

- IAM Binding with role: `secret.accessor`

---

## Service Account Credentials

When you create a service account in Crypta, you will receive:

- `client_id`
- `private_key` (**shown only once**)

Example `client_id`:

```
service-account-genme@genme.crypta
```

---

## Private Key Storage

### Option 1: Store as `.pem` file (recommended)

Create a file:

```text
private_key.pem
```

```pem
-----BEGIN PRIVATE KEY-----
MIIC...
-----END PRIVATE KEY-----
```

Add to `.gitignore`:

```gitignore
private_key.pem
```

---

### Option 2: Store in environment variables

```env
CRYPTA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIC...\n-----END PRIVATE KEY-----"
```

Normalize newlines in code:

```js
const privateKey = process.env.CRYPTA_PRIVATE_KEY.replace(/\\n/g, '\n')
```

---

## Minimal Quick Start

```js
const fs = require('fs')
const { CryptaClient } = require('crypta-client')

// Load private key from file
const privateKey = fs
  .readFileSync('./private_key.pem', 'utf8')
  .replace(/\\n/g, '\n')

const client = new CryptaClient({
  clientId: 'YOUR_CLIENT_ID',
  privateKeyPem: privateKey,
  baseUrl: 'https://api.rayhanprojects.site'
})

async function main() {
  try {
    const secret = await client.getSecret('YOUR_SECRET_NAME')
    console.log('Secret value:', secret)
  } catch (err) {
    console.error(err.message)
  }
}

main()
```

### Output

```text
Secret value: super-secret-db-password
```

---

## API Reference

### `new CryptaClient(options)`

Create a new Crypta client.

#### Options

| Field           | Type   | Required | Description                  |
| --------------- | ------ | -------- | ---------------------------- |
| `baseUrl`       | string | yes      | Crypta API base URL          |
| `clientId`      | string | yes      | Service account client ID    |
| `privateKeyPem` | string | yes      | RSA private key (PEM format) |

#### Example

```js
const client = new CryptaClient({
  baseUrl: 'https://api.example.com',
  clientId: 'service-account@project.crypta',
  privateKeyPem: privateKey
})
```

> ⚠️ You **do not** need to configure audience manually.
> The client automatically derives it from `baseUrl`.

---

### `client.getSecret(name)`

Fetches the **latest enabled version** of a secret.

#### Parameters

- `name` (`string`, required)
  The secret name exactly as stored in Crypta.

#### Returns

- `string` — the decrypted secret value

#### Example

```js
const password = await client.getSecret('db-password')
```

---

## Error Handling

The client throws a `CryptaError` with an HTTP-like status code.

```js
try {
  await client.getSecret('missing-secret')
} catch (err) {
  console.error(err.statusCode) // 404
  console.error(err.message) // "Secret not found"
}
```

### Common Status Codes

| Code | Description           |
| ---: | --------------------- |
|  401 | Authentication failed |
|  403 | Permission denied     |
|  404 | Secret not found      |
|  500 | Internal server error |

---

## How Authentication Works

1. Client generates a short-lived JWT assertion (RS256)
2. Crypta verifies the signature using the stored public key
3. Crypta issues a short-lived access token (HS256)
4. Client uses the token to access secrets
5. Secrets are decrypted server-side and returned once

---

## Security Notes

- Private keys never leave the client
- Crypta stores only public keys
- Access tokens are short-lived
- Secrets are not cached
- Envelope encryption is used internally

---

## License

MIT License

---

## Author

ryz772

---

## Changelog

### v0.1.4

- Initial release
- Service account authentication
- Secret access API
- Automatic token handling

---

## Final Note

⚠️ **Never commit private keys to version control.**
Rotate keys immediately if they are exposed.
