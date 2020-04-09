import Vue from "vue";
import Vuex from "vuex";
import http from "../axios";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: {},
        error: ''
    },
    mutations: {
        auth_request(state) {
            state.status = 'loading';
        },
        auth_success(state, payload) {
            console.log("auth_success")
            console.log(payload.token)
            console.log(payload.user)
            state.status = 'success';
            state.token = payload.token;
            state.user = payload.user;
        },
        auth_error(state, err) {
            state.status = 'error';
            state.error = err;
        },
        logout(state) {
            state.status = '';
            state.token = '';
            state.user = undefined;
        }
    },
    actions: {
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request');
                http({ url: 'api/auth/login', data: user, method: 'POST' })
                    .then(response => {
                        console.log(response);
                        const token = response.data.token;
                        const user = response.data.user;

                        http.defaults.headers.common['Authorization'] = token;

                        commit('auth_success', { token, user });
                        resolve(response);
                    })
                    .catch(err => {
                        console.log("Login error");
                        console.log(err);
                        commit('auth_error', err);
                        localStorage.removeItem('token');
                        reject(err);
                    });
            });
        },
        register({ commit }, user) {
            console.log("Registering with user:");
            console.log(user);
            return new Promise((resolve, reject) => {
                commit('auth_request');
                http({ url: '/api/auth/register', data: user, method: 'POST' })
                    .then(response => {
                        const token = response.data.token;
                        const user = response.data.user;

                        localStorage.setItem('token', token);
                        http.defaults.headers.common['Authorization'] = token;

                        commit('auth_success', { token, user });
                        resolve(response);
                    })
                    .catch(err => {
                        commit('auth_error', err);
                        localStorage.removeItem('token');
                        reject(err);
                    });
            });
        },
        logout({ commit }) {
            return new Promise((resolve, reject) => {
                commit('logout');
                localStorage.removeItem('token');
                delete http.defaults.headers.common['Authorization'];
                resolve();
            });
        },
        loginWithToken({ commit, state }) {
            return new Promise((resolve, reject) => {
                commit('auth_request');
                // let token = localStorage.getItem("token");
                let token = state.token;
                // if (token) {
                    http.post('api/auth/refresh', {
                        token
                    })
                    .then(response => {
                        console.log(response.data);
                        commit('auth_success', { token, user: response.data });
                        console.log("Logged in with token");
                        console.log("Response:")
                        console.log(response);
                        console.log("User:")
                        console.log(response.data);

                        return resolve();
                    })
                    .catch(err => {
                        commit('auth_error', err);
                        return reject(err);
                    });
                // }
            })
        }
    },
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        currentUser: state => !!state.user ? state.user : null
    }
})