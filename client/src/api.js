import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001/auth'
})
export const googleAuth = (code)=> api.get("/google", { params: { code } });