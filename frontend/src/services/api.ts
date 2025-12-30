import { useAuthStore } from "@/stores/authStores";
import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
})


instance.interceptors.request.use(
    cfg => {
        const token = localStorage.getItem('token')
        if (token) {
            cfg.headers.Authorization = `Bearer ${token}`
        };
        return cfg
    }, err => {
        Promise.reject(err)
    }
)

instance.interceptors.response.use(
    response => response,
    err => {
        if (err.response && err.response.status == 401) {
            const auth = useAuthStore()
            auth.userLoggedOut()
            window.location.href = '/login'
        }
        return Promise.reject(err)
    }
)

export default instance