import axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import {store} from '../redux/Store';
import {setTokens, logout} from '../redux/feature/authSlice';

export const BASE_URL = 'https://mrbikedoctors.com/api/v1';

const client: AxiosInstance = axios.create({baseURL: BASE_URL});

// Attach Bearer token on every request
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const state = store.getState() as any;
  const token = state?.auth?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token refresh on 401
let isRefreshing = false;
let failedQueue: {resolve: (t: string) => void; reject: (e: any) => void}[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

client.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({
            resolve: (t: string) => {
              original.headers.Authorization = `Bearer ${t}`;
              resolve(client(original));
            },
            reject,
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      const state = store.getState() as any;
      const refreshToken = state?.auth?.refreshToken;

      try {
        const {data} = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        store.dispatch(
          setTokens({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          }),
        );
        original.headers.Authorization = `Bearer ${data.access_token}`;
        processQueue(null, data.access_token);
        return client(original);
      } catch (err) {
        processQueue(err, null);
        store.dispatch(logout());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default client;
