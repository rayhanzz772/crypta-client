# crypta-client

[![npm version](https://img.shields.io/npm/v/crypta-client.svg)](https://www.npmjs.com/package/crypta-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Node.js client library for interacting with the Crypta Secret Manager. Securely manage and access secrets using service account authentication with JWT.

## Features

- 🔐 **Secure Authentication** - Service account-based authentication using JWT
- 🔄 **Automatic Token Management** - Built-in token caching and refresh
- 🚀 **Simple API** - Easy-to-use interface for secret retrieval
- ⚡ **Lightweight** - Minimal dependencies
- 🛡️ **Error Handling** - Comprehensive error handling and custom error types

## Installation

```bash
npm install crypta-client
```

## Quick Start

```javascript
const { CryptaClient } = require('crypta-client')

// Initialize the client
const client = new CryptaClient({
  baseUrl: 'https://your-crypta-instance.com',
  clientId: 'your-service-account-client-id',
  privateKeyPem: `-----BEGIN PRIVATE KEY-----
                  your-private-key-here
                  -----END PRIVATE KEY-------`
})

// Get a secret
async function getMySecret() {
  try {
    const secret = await client.getSecret('my-secret-name')
    console.log('Secret value:', secret.payload)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

getMySecret()
```

## API Reference

### `new CryptaClient(options)`

Creates a new Crypta client instance.

#### Parameters

- `options` (Object)
  - `baseUrl` (string, required) - The base URL of your Crypta instance
  - `clientId` (string, required) - Your service account client ID
  - `privateKeyPem` (string, required) - Your service account private key in PEM format

#### Example

```javascript
const client = new CryptaClient({
  baseUrl: 'https://crypta.example.com',
  clientId: 'sa-12345',
  privateKeyPem: process.env.CRYPTA_PRIVATE_KEY
})
```

### `client.getSecret(name)`

Retrieves the latest version of a secret.

#### Parameters

- `name` (string, required) - The name/path of the secret to retrieve

#### Returns

Returns a Promise that resolves to an object containing:

- `payload` (string) - The secret value
- Additional metadata about the secret

#### Example

```javascript
const secret = await client.getSecret('database/password')
console.log(secret.payload) // The actual secret value
```

#### Error Handling

```javascript
try {
  const secret = await client.getSecret('my-secret')
  console.log(secret.payload)
} catch (error) {
  if (error.statusCode === 404) {
    console.error('Secret not found')
  } else if (error.statusCode === 401) {
    console.error('Authentication failed')
  } else {
    console.error('Error:', error.message)
  }
}
```

## Environment Variables

It's recommended to store sensitive information in environment variables:

```javascript
require('dotenv').config() // If using dotenv

const client = new CryptaClient({
  baseUrl: process.env.CRYPTA_BASE_URL,
  clientId: process.env.CRYPTA_CLIENT_ID,
  privateKeyPem: process.env.CRYPTA_PRIVATE_KEY
})
```

Example `.env` file:

```env
CRYPTA_BASE_URL=https://crypta.example.com
CRYPTA_CLIENT_ID=sa-12345
CRYPTA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----"
```

## Advanced Usage

### Token Management

The client automatically manages authentication tokens, including caching and refresh. You don't need to handle tokens manually.

### Custom Error Handling

The library provides custom error types for better error handling:

```javascript
const { CryptaClient } = require('crypta-client')

try {
  const secret = await client.getSecret('my-secret')
} catch (error) {
  console.error('Status Code:', error.statusCode)
  console.error('Message:', error.message)
}
```

### Multiple Secrets

```javascript
async function getMultipleSecrets() {
  const secretNames = ['db-password', 'api-key', 'encryption-key']

  try {
    const secrets = await Promise.all(
      secretNames.map((name) => client.getSecret(name))
    )

    return secrets.reduce((acc, secret, index) => {
      acc[secretNames[index]] = secret.payload
      return acc
    }, {})
  } catch (error) {
    console.error('Failed to fetch secrets:', error.message)
    throw error
  }
}
```

## Requirements

- Node.js >= 14.x
- A Crypta Secret Manager instance
- A service account with appropriate permissions

## Dependencies

- `axios` - HTTP client
- `jsonwebtoken` - JWT token generation

## Error Codes

| Status Code | Description                                 |
| ----------- | ------------------------------------------- |
| 401         | Authentication failed - Invalid credentials |
| 403         | Forbidden - Insufficient permissions        |
| 404         | Secret not found                            |
| 500         | Internal server error                       |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions:

- Open an issue on [GitHub](https://github.com/rayhanzz772/crypta-client/issues)
- Contact: [Your contact information]

## Changelog

### v0.1.0

- Initial release
- Service account authentication
- Secret retrieval functionality
- Automatic token management

## Author

Rayhan

---

**Note**: Make sure to keep your private keys secure and never commit them to version control.
