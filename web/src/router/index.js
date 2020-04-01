import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import New from "../views/New.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/new",
    name: "New",
    component: New
  }
];

const router = new VueRouter({
  routes
});

export default router;
