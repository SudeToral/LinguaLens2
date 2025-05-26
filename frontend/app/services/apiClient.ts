// app/services/apiClient.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Centralized API client using Axios for HTTP requests.
 * Update `baseURL` to match your backend address.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://192.168.1.102:8000', // TODO: Replace with your FastAPI server URL
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add a request interceptor, e.g. to inject auth tokens
apiClient.interceptors.request.use(
    (config) => {
      // const token = await AsyncStorage.getItem('authToken');
      // if (token && config.headers) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
// Optional: Add a response interceptor, e.g. for global error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // if (error.response?.status === 401) {
    //   // handle unauthorized access
    // }
    return Promise.reject(error);
  }
);

export default apiClient;
