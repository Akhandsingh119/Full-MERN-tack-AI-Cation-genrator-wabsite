import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
   baseURL: "https://full-mern-tack-ai-cation-genrator-w.vercel.app/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      toast.error('Session expired. Please sign in again.');
    }
    return Promise.reject(error);
  }
);

export default api;
