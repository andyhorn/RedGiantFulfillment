const axios = require('axios');

let http;
if (process.env.NODE_ENV !== "production") {
    // If we're in a dev environment, the base URL will
    // most likely be http://localhost:xxxx
    let baseUrl = process.env.VUE_APP_BACKEND_URL;
    http = axios.create({
      baseURL: baseUrl
    });
    // Vue.prototype.$http = http;
  } else {
    // Otherwise, we'll be using Nginx to proxy the 
    // axios requests to the API
    // Vue.prototype.$http = axios;
    http = axios;
  }

export default http;