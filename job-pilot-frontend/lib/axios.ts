import axios from 'axios';

const api = axios.create({
  baseURL:process.env.NEXT_PUBLIC_API_URL, // Backend base URL
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
        try {
            const persistRoot = localStorage.getItem('persist:root');
            if (persistRoot) {
                // Redux persist stores the user slice dynamically
                const userState = JSON.parse(JSON.parse(persistRoot).user);
                const token = userState.currentUser?.token;
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            // Fallback silent fail on hydration limits
        }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
