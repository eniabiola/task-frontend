import { defineStore } from 'pinia';
import axios from '../services/axios';
import router from '../router';
import { nextTick } from 'vue'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || '',
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || 'user',
  },
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/login', credentials);
        const response_data = response.data;

        this.token = response_data.data.token;
        this.user = { ...response_data.data.user };

        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        await nextTick()
        await router.push({ name: 'Tasks' });
      } catch (error) {
        let error_data = error.response.data;
        throw error_data || 'Invalid email or password';
      }
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        router.push('/login');
      }, 5000);
    },
    async register(credentials) {
      try {
        await axios.post('/register', credentials);
        router.push('/');
      } catch (error) {
        throw error.response?.data || 'Could not register user';
      }
    }

  },
});
