// src/services/api/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { storageService, StorageKeys } from '../storage/storage';
import { ApiResponse } from '../../types';

const BASE_URL = 'http://10.0.2.2:3000/api'; // Update for production
// const BASE_URL = 'http://localhost:3000/api'; // Update for production

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // ============================
    // REQUEST INTERCEPTOR
    // ============================
    this.client.interceptors.request.use(
      async config => {
        const token = await storageService.getItem(StorageKeys.AUTH_TOKEN);

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 🔥 Log every outgoing request
        console.log('📤 [API REQUEST]', {
          url: config.url,
          method: config.method,
          baseURL: config.baseURL,
          headers: config.headers,
          params: config.params,
          data: config.data,
        });

        return config;
      },
      error => {
        console.log('❌ [API REQUEST ERROR]', error);
        return Promise.reject(error);
      },
    );

    // ============================
    // RESPONSE INTERCEPTOR
    // ============================
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // 🔥 Log every successful response
        console.log('📥 [API RESPONSE]', {
          url: response.config.url,
          status: response.status,
          data: response.data,
        });

        return response;
      },
      error => {
        // 🔥 Log errors
        console.log('❌ [API ERROR]', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });

        // Handle 401
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }

        return Promise.reject(error);
      },
    );
  }

  private handleUnauthorized(): void {
    console.log('⚠️ [AUTH EXPIRED] Clearing tokens...');
    storageService.removeItem(StorageKeys.AUTH_TOKEN);
    storageService.removeItem(StorageKeys.USER_DATA);

    // TODO: Add navigation logic (Router reset → Login)
  }

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
