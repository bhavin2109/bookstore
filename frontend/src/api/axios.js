import axios from 'axios';

// Create a single axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token if it exists
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally 
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can handle 401s here if needed (e.g., auto-logout)
        return Promise.reject(error);
    }
);

export default axiosInstance;
