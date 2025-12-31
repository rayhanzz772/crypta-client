const axios = require('axios')

function createHttp(baseUrl) {
  return axios.create({
    baseURL: baseUrl,
    timeout: 10_000
  })
}

module.exports = { createHttp }
