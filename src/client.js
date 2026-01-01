const { createHttp } = require('./http')
const { TokenManager } = require('./token')
const { CryptaError } = require('./errors')

class CryptaClient {
  constructor({ baseUrl, clientId, privateKeyPem }) {
    if (!baseUrl || !clientId || !privateKeyPem) {
      throw new Error(
        'Missing required parameters: baseUrl, clientId, privateKeyPem'
      )
    }

    this.baseUrl = baseUrl.replace(/\/+$/, '')
    this.clientId = clientId
    this.privateKeyPem = privateKeyPem

    this.http = createHttp(this.baseUrl)

    this.tokenManager = new TokenManager({
      http: this.http,
      clientId: this.clientId,
      privateKeyPem: this.privateKeyPem,
      audience: `${this.baseUrl}/client/auth/token`
    })
  }

  async getSecret(name) {
    if (!name) throw new Error('Secret name is required')

    const token = await this.tokenManager.getToken()

    try {
      const res = await this.http.get(
        `/client/latest-secret/v1/secrets/${name}/versions/latest:access`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      return res.data.data
    } catch (err) {
      const status = err.response?.status
      const message = err.response?.data?.message || 'Failed to get secret'
      throw new CryptaError(message, status)
    }
  }
}

module.exports = CryptaClient
