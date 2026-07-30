import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
})

export {api}

api.interceptors.request.use(
    (config) => {
        if(!config.url.includes("/login/") && !config.url.includes("/signup/")){
            const auth = JSON.parse(localStorage.getItem("taskboard_user"));

        if (auth) {
            config.auth = {
                username: auth.username,
                password: auth.password,
            };
        }
    }
        return config
    }
)
