<template>
    <div class="container">
        <form class="form" @submit.prevent="register">
            <div class="form-group">
                <label for="name">Name</label>
                <input id="name" type="text" v-model="name" required autofocus class="form-control" />
            </div>
            <div class="form-group">
                <label for="email">Email Address</label>
                <input id="email" type="email" v-model="email" required class="form-control" />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input id="password" type="password" v-model="password" required class="form-control" />
            </div>
            <div class="form-group">
                <label for="confirm-password">Confirm Password</label>
                <input id="confirm-password" type="password" v-model="confirm_password" required class="form-control" />
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-success">Register</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'register',
    data() {
        return {
            name: "",
            email: "",
            password: "",
            confirm_password: ""
        }
    },
    methods: {
        register() {
            let data = {
                name: this.name,
                email: this.email,
                password: this.password
            };

            this.$store.dispatch("register", data)
                .then(() => this.$router.push("/"))
                .catch(err => console.log(err));
        }
    }
}
</script>