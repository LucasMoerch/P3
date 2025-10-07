import axios from 'axios';

const http = axios.create({
  baseURL: '/api', // proxy to backend
  timeout: 5000,
    withCredentials: true,    // send/receive httpOnly session cookie
});

// unwrap data so callers get JSON directly
http.interceptors.response.use(
    (res) => res.data,
    (err) => Promise.reject(err)
);

export default http;
