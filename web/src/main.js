import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Configure the axios routing
// Vue.prototype.$http = axios;
if (process.env.NODE_ENV !== "production") {
  // If we're in a dev environment, the base URL will
  // most likely be http://localhost:xxxx
  let baseUrl = process.env.VUE_APP_BACKEND_URL;
  let http = axios.create({
    baseURL: baseUrl
  });
  Vue.prototype.$http = http;
} else {
  // Otherwise, we'll be using Nginx to proxy the 
  // axios requests to the API
  Vue.prototype.$http = axios;
}

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
