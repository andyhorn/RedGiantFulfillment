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
            <b-button type="reset" class="m-1" variant="primary">Clear</b-button>
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
      remember_me: false
    };
  },
  mounted() {
    this.error = this.$store.state.error;
  },
  methods: {
    login() {
      let email = this.email;
      let password = this.password;
      let remember = this.remember_me;

      this.$store
        .dispatch("login", { email, password })
        .then((response) => {
            if (remember) {
                localStorage.setItem("token", response.data.token);
            }
            this.$router.push("/")
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
