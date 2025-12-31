const { generateAssertion } = require('./assertion')

class TokenManager {
  constructor({ http, clientId, privateKeyPem, audience }) {
    this.http = http
    this.clientId = clientId
    this.privateKeyPem = privateKeyPem
    this.audience = audience

    this.accessToken = null
    this.expiresAt = 0
  }

  isExpired() {
    return !this.accessToken || Date.now() >= this.expiresAt
  }

  async fetchToken() {
    const assertion = generateAssertion({
      clientId: this.clientId,
      privateKeyPem: this.privateKeyPem,
      audience: this.audience
    })

    const res = await this.http.post('/public-api/auth/token', { assertion })

    this.accessToken = res.data.access_token
    // 1 menit buffer
    this.expiresAt = Date.now() + 9 * 60 * 1000
  }

  async getToken() {
    if (this.isExpired()) {
      await this.fetchToken()
    }
    return this.accessToken
  }
}

module.exports = { TokenManager }
