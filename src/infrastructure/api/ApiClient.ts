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
import { logger } from '../logging'

// ============================================================================
// Configuration
// ============================================================================

/** API Configuration */
interface ApiConfig {
  baseURL: string
  timeout: number
}

/** Default API configuration */
const DEFAULT_CONFIG: ApiConfig = {
  baseURL: import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL as string) || '',
  timeout: 15000,
}

// Environment-based configuration
const getBaseURL = (): string => DEFAULT_CONFIG.baseURL

// ============================================================================
// API Client Setup
// ============================================================================

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: DEFAULT_CONFIG.timeout,
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
    logger.debug('API Request', {
      method: config.method,
      url: config.url,
      hasAuth: !!token,
    })
    return config
  },
  (error) => {
    logger.error('API Request Error', error)
    return Promise.reject(error)
  },
)

// Response interceptor - centralized error handling
apiClient.interceptors.response.use(
  (response) => {
    logger.debug('API Response', {
      status: response.status,
      url: response.config.url,
    })
    return response
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    // Handle API errors consistently
    if (error.response?.data) {
      const responseData = error.response.data as unknown as Record<string, unknown>
      const apiError: ApiError = {
        code: error.response.status.toString(),
        message: (responseData?.message as string) || 'An error occurred',
        details: responseData?.error as string,
      }
      logger.error('API Error Response', error, { apiError })
      return Promise.reject(apiError)
    }
    logger.error('API Network Error', error)
    return Promise.reject(error)
  },
)

// ============================================================================
// HTTP Client Functions
// ============================================================================

// Request maker function
export async function request<T = unknown>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
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

// ============================================================================
// Vue Composable for API Calls
// ============================================================================

/**
 * Composable for making API calls with loading state
 * Provides reactive loading and error states
 */
export function useApiClient() {
  const loading = ref(false)
  const error = ref<unknown>(null)

  async function makeRequest<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    loading.value = true
    error.value = null

    try {
      const { success, data, message } = await request<T>(config)
      if (!success) {
        const err = new Error(message)
        logger.error('API Response Error', err, { config })
        throw err
      }
      return data as T
    } catch (err) {
      error.value = err
      logger.error('API Request Failed', err instanceof Error ? err : new Error(String(err)), {
        config,
      })
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

// Export API client instance and config
export { apiClient, DEFAULT_CONFIG }
export type { ApiConfig }
export default apiClient
