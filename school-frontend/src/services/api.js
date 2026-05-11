import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true // Required to seamlessly pass httpOnly refresh and access tokens
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Exclude specific auth routes from triggering infinite loops on 401
        if (error.response && [401, 403].includes(error.response.status) && !originalRequest._retry) {
            if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh')) {
                return Promise.reject(error);
            }
            originalRequest._retry = true;
            try {
                // Issue a refresh request, which will consume the httpOnly refresh cookie
                const res = await api.post('/auth/refresh');
                if (res.status === 200) {
                    // With credentials active, the new access cookie is set automatically. Just replay the original req.
                    return api(originalRequest);
                }
            } catch (err) {
                // Refresh failed; purge context and redirect.
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
