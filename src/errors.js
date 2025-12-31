class CryptaError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'CryptaError'
    this.status = status
  }
}

module.exports = { CryptaError }
