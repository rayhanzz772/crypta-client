class CryptaError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.name = 'CryptaError'
    this.statusCode = statusCode
    this.status = statusCode // Keep both for backwards compatibility
  }
}

module.exports = { CryptaError }
