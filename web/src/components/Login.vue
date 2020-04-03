<template>
    <div class="container">
        <form class="form" @submit.prevent="login">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input id="email" required v-model="email" type="email" placeholder="email@domain.com" class="form-control" />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input id="password" required v-model="password" type="password" class="form-control" />
            </div>
            <div class="form-group">
                <button class="btn btn-success" type="submit">Login</button>
            </div>
        </form>
        <p v-if="error.length" class="text-danger">{{ error }}</p>
    </div>
</template>

<script>
export default {
    name: 'login',
    data() {
        return {
            email: "",
            password: "",
            error: ""
        }
    },
    mounted() {
        this.error = this.$store.state.error;
    },
    methods: {
        login() {
            let email = this.email;
            let password = this.password;

            this.$store.dispatch("login", { email, password })
                .then(() => this.$router.push("/"))
                .catch(err => console.log(err));
        }
    }
}
</script>