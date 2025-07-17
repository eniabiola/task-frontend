import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import router from '../router';
import { useToast } from 'vue-toastification'

const toast = useToast();
// Axios Instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {

      const auth = useAuthStore();
      auth.logout();
      router.push('/login');
      toast.error('Session expired. Please log in again')
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
