const axios = require('axios');

class GraphAPIClient {
  constructor(axiosRequestConfig) {
    this.axios = axios.create(axiosRequestConfig)
  }

  query() {

  }
}
