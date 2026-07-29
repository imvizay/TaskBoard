import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
})

export {api}

api.interceptors.request.use(
    (config) => {
        if(!config.url.includes("/login/") && !config.url.includes("/signup/")){
            config.auth = {
                username: "Anjani_Lashkari",
                password: "vizay1999",
          }
        }
        return config
    }
)