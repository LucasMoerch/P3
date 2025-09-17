import axios from "axios";

const http = axios.create({
    baseURL: "/api",   // proxy to backend
    timeout: 5000
});

export default http;
