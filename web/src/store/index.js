import Vue from "vue";
import Vuex from "vuex";
// import http from "../main";
const { http } = require("../../axios");
// import axios from "axios";

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
        auth_success(state, token, user) {
            state.status = 'success';
            state.token = token;
            state.user = user;
        },
        auth_error(state, err) {
            state.status = 'error';
            state.error = err;
        },
        logout(state) {
            state.status = '';
            state.token = '';
        }
    },
    actions: {
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request');
                http({ url: '/auth/login', data: user, method: 'POST' })
                    .then(response => {
                        const token = response.data.token;
                        const user = response.data.user;

                        localStorage.setItem('token', token);

                        http.defaults.headers.common['Authorization'] = token;

                        commit('auth_success', token, user);
                        resolve(response);
                    })
                    .catch(err => {
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

                        commit('auth_success', token, user);
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
        }
    },
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status
    }
})