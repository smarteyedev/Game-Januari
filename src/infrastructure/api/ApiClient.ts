/**
 * API Client - Axios configuration and interceptors
 * Part of the infrastructure layer
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios'
import { ref } from 'vue'
import type { ApiResponse, ApiError } from '@/domain/types'

// Environment-based configuration
const getBaseURL = (): string => {
  if (import.meta.env.DEV) {
    return ''
  }
  return import.meta.env.VITE_API_BASE_URL || ''
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor - centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    // Handle API errors consistently
    if (error.response?.data) {
      const apiError: ApiError = {
        code: error.response.status.toString(),
        message: error.response.data.message || 'An error occurred',
        details: (error.response.data as any)?.error?.details,
      }
      return Promise.reject(apiError)
    }
    return Promise.reject(error)
  },
)

// Request maker function
export async function request<T = unknown>(
  config: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  const response: AxiosResponse<ApiResponse<T>> = await apiClient.request<ApiResponse<T>>(config)
  return response.data
}

// HTTP method helpers using the exported request function
export const httpClient = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'GET', url }),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'POST', url, data }),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PUT', url, data }),

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PATCH', url, data }),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'DELETE', url }),
}

// Vue Composable for API calls with loading state
export function useApiClient() {
  const loading = ref(false)
  const error = ref<unknown>(null)

  async function makeRequest<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    loading.value = true
    error.value = null

    try {
      const response = await request<T>(config)
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data as T
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    request: makeRequest,
    get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
      makeRequest<T>({ ...config, method: 'GET', url }),
    post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      makeRequest<T>({ ...config, method: 'POST', url, data }),
    put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      makeRequest<T>({ ...config, method: 'PUT', url, data }),
    patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      makeRequest<T>({ ...config, method: 'PATCH', url, data }),
    delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
      makeRequest<T>({ ...config, method: 'DELETE', url }),
  }
}

export default apiClient

