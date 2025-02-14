import axios from "axios"
export const Instance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BACKEND_URL
})
Instance.defaults.headers['Content-Type'] = 'application/json';