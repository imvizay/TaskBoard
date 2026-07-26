import { api } from "../axios/setup";

const http = {
    get:(url,config={}) => api.get(url,config),
    post: (url,config={}) => api.post(url,config={}),
    put: (url,config={}) => api.put(url,config={}),
    patch: (url,config={}) => api.patch(url,config={}),
    delete: (url,config={}) => api.delete(url,config={}),  
}

export { http }