import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import store from "./store";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Configure the axios routing
Vue.prototype.$http = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_URL
});

const token = localStorage.getItem('token');
if (token) {
  Vue.prototype.$http.default.headers.common['Authorization'] = token;
}

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
