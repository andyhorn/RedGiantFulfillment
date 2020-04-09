<template>
  <div class="container text-left">
    <b-form class="form" @submit.prevent="login">
        <b-form-group 
            id="email-input-group"
            label="Email Address"
            label-for="email"
            description="Your registered email address"
        >
            <b-form-input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="email@domain.com"
            ></b-form-input>
        </b-form-group>

        <b-form-group
            id="password-input-group"
            label="Password"
            label-for="password"
        >
            <b-form-input
                id="password"
                v-model="password"
                type="password"
                required
                placeholder="Password"
            ></b-form-input>
        </b-form-group>

        <b-form-checkbox id="remember_me" v-model="remember_me" switch>Remember Me</b-form-checkbox>

        <b-form-group class="mt-2">
            <b-button type="submit" class="m-1" variant="success">Login</b-button>
            <b-button @click="reset" class="m-1" variant="primary">Clear</b-button>
            <p v-if="error_message" class="m-1 text-danger">Error: {{ error_message }}</p>
        </b-form-group>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      email: "",
      password: "",
      remember_me: false,
      error_message: null
    };
  },
  mounted() {
    this.error = this.$store.state.error;
  },
  methods: {
    reset() {
      this.email = "";
      this.password = "";
      this.error_message = null;
    },
    login() {
      this.error_message = null;
      let email = this.email;
      let password = this.password;
      let remember = this.remember_me;
      let vm = this;

      this.$store
        .dispatch("login", { email, password })
        .then((response) => {
            if (remember) {
                localStorage.setItem("token", response.data.token);
            }
            this.$router.push("/")
        })
        .catch(err => {
          if (err.response) {
            let data = err.response.data;
            vm.error_message = data;
          } else {
            vm.error_message = "Unable to login, check your email and password and try again.";
          }
          vm.password = "";
        });
    }
  }
};
</script>
