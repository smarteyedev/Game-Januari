import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ref } from 'vue'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptors
api.interceptors.request.use(
  (config) => {
    // attach token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    return Promise.reject(error)
  },
)

// Composable
export default function useApi() {
  const loading = ref(false)
  const error = ref<unknown>(null)

  async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
    loading.value = true
    error.value = null

    try {
      const response: AxiosResponse<T> = await api.request<T>(config)
      return response.data
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

    get: <T = any>(url: string, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: 'GET', url }),

    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: 'POST', url, data }),

    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: 'PUT', url, data }),

    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: 'PATCH', url, data }),

    delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: 'DELETE', url }),
  }
}
