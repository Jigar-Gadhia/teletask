import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import { handleServerError } from './handle-server-error'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().auth.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    handleServerError(error)

    return Promise.reject(error)
  }
)

export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  api.get(url, config).then((response) => response.data)

export const post = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => api.post(url, data, config).then((response) => response.data)

export const put = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => api.put(url, data, config).then((response) => response.data)

export const patch = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => api.patch(url, data, config).then((response) => response.data)

export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  api.delete(url, config).then((response) => response.data)

export default api
