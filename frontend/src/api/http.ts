// @ts-ignore
import axios from 'axios';
import { AxiosResponse } from 'axios';

export const http = axios.create({
  baseURL: '/api', // proxy to backend
  timeout: 5000,
  withCredentials: true, // send/receive httpOnly session cookie
});

// unwrap data so callers get JSON directly
http.interceptors.response.use(
  <T>(res: AxiosResponse<T>) => res.data as T,
  (err: any) => Promise.reject(err),
);

export default http;
