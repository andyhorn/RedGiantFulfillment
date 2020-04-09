<template>
    <div class="container text-left">
        <form class="form w-75 mx-auto" @submit.prevent="register">
            <b-form-group
                id="name-group"
                label="Your name"
                label-for="name-input"
                description="Enter your first and last name"
                label-cols="3"
            >
                <b-form-input id="name-input" v-model="name" required></b-form-input>
            </b-form-group>
            <b-form-group
                id="email-group"
                label="Email Address"
                label-for="email-input"
                description="Enter your email address"
                label-cols="3"
            >
                <b-form-input id="email-input" v-model="email" required></b-form-input>
            </b-form-group>
            <b-form-group
                id="password-group"
                description="Choose a password"
                label="Password"
                label-for="password-input"
                label-cols="3"
            >
                <b-form-input id="password-input" v-model="password" type="password" required></b-form-input>
            </b-form-group>
            <b-form-group
                id="confirm-password-group"
                description="Please confirm your password"
                label="Confirm Password"
                label-for="confirm-password-input"
                :invalid-feedback="invalidPassword"
                :valid-feedback="validPassword"
                :state="valid"
                label-cols="3"
            >
                <b-form-input id="confirm-password-input" v-model="confirm_password" :state="valid" type="password" required></b-form-input>
            </b-form-group>
            <div class="form-group">
                <button type="submit" class="btn btn-success" :disabled="!valid">Register</button>
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
    computed: {
        valid() {
            return this.password.length && this.password == this.confirm_password;
        },
        invalidPassword() {
            return "Passwords do not match.";
        },
        validPassword() {
            return "Passwords match!";
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

<style scoped>
.invalid {
    border: 1px solid red !important;

}
</style>