import { defineStore } from "pinia";
import api from "../api";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        token: localStorage.getItem("token") || null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(credentials) {
            try {
                const response = await api.post("/login", credentials);
                this.token = response.data.token;
                localStorage.setItem("token", this.token);
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${this.token}`;
                this.user = response.data.user;
            } catch (error) {
                throw new Error(error.response.data.message);
            }
        },
        async logout() {
            await api.post("/logout");
            this.token = null;
            this.user = null;
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
            window.location.href = "/login"; // 🔄 Redirect to Login
        },
    },
});
