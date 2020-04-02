import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import New from "../views/New.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/new",
    name: "New",
    component: New,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }

    next('/login');
  } else {
    next();
  }
})

export default router;
