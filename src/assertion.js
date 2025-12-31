const jwt = require('jsonwebtoken')

function generateAssertion({ clientId, privateKeyPem, audience }) {
  const now = Math.floor(Date.now() / 1000)

  return jwt.sign(
    {
      iss: clientId,
      sub: clientId,
      aud: audience,
      iat: now,
      exp: now + 120 // 2 menit
    },
    privateKeyPem,
    { algorithm: 'RS256' }
  )
}

module.exports = { generateAssertion }
