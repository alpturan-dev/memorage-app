import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Accept'] = 'application/json';

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.token;
        if (
            token
            && (config.url !== import.meta.env.VITE_API_URL + 'login')
            && (config.url !== import.meta.env.VITE_API_URL + 'signup')
        ) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
)

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            localStorage.clear();
            history.go('/login');
        } else {
            console.error(error)
        }
        return Promise.reject(error);
    }
)

export const apiRequest = axios;