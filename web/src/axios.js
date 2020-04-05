const axios = require("axios");
import router from "./router/index";
import store from "./store/index";

var http;
if (process.env.NODE_ENV !== "production") {
  // If we're in a dev environment, the base URL will
  // most likely be http://localhost:xxxx
  let baseUrl = process.env.VUE_APP_BACKEND_URL;
  http = axios.create({
    baseURL: baseUrl
  });
} else {
  // Otherwise, we'll be using Nginx to proxy the
  // axios requests to the API
  http = axios;
}

http.interceptors.response.use(null, err => {
  // If the request failed, check the error status
  let status = err.response.status;
  console.log(err.response);

  switch(status) {
    case 401: {
      // Unauthorized access
      store.dispatch("logout");
      router.push("/403");
    }
  }

  return Promise.reject(err);
})

export default http;
