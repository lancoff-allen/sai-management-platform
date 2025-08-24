import axios from 'axios';
import proxy from '../configs/host';

const env = import.meta.env.MODE || 'development';
const API_HOST = proxy[env].API;
const TOKEN_NAME = 'tdesign-starter';

const SUCCESS_CODE = 0;
const TIMEOUT = 5000;

export const instance = axios.create({
  baseURL: API_HOST,
  timeout: TIMEOUT,
  withCredentials: true,
});

// 请求拦截器 - 添加 token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      // 后端返回的数据结构可能不同，需要根据实际情况调整
      return response.data;
    }
    return Promise.reject(response?.data);
  },
  (error) => {
    // 处理 401 未授权错误
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_NAME);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default instance;
