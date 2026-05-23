import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const AUTH_STORAGE_KEY = 'auth-storage'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
  name: string
  initials: string
}

interface AuthData {
  user: AuthUser | null
  accessToken: string
}

interface AuthState {
  auth: AuthData & {
    setUser: (user: AuthUser | null) => void
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

const getInitialAuth = (): AuthData => {
  const cookieState = getCookie(AUTH_STORAGE_KEY)

  if (!cookieState) {
    return {
      user: null,
      accessToken: '',
    }
  }

  try {
    return JSON.parse(cookieState)
  } catch {
    return {
      user: null,
      accessToken: '',
    }
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const initialAuth = getInitialAuth()

  return {
    auth: {
      ...initialAuth,

      setUser: (user) =>
        set((state) => {
          const updatedAuth = {
            ...state.auth,
            user,
          }

          setCookie(
            AUTH_STORAGE_KEY,
            JSON.stringify({
              user: updatedAuth.user,
              accessToken: updatedAuth.accessToken,
            })
          )

          return {
            auth: updatedAuth,
          }
        }),

      setAccessToken: (accessToken) =>
        set((state) => {
          const updatedAuth = {
            ...state.auth,
            accessToken,
          }

          setCookie(
            AUTH_STORAGE_KEY,
            JSON.stringify({
              user: updatedAuth.user,
              accessToken: updatedAuth.accessToken,
            })
          )

          return {
            auth: updatedAuth,
          }
        }),

      resetAccessToken: () =>
        set((state) => {
          const updatedAuth = {
            ...state.auth,
            accessToken: '',
          }

          setCookie(
            AUTH_STORAGE_KEY,
            JSON.stringify({
              user: updatedAuth.user,
              accessToken: '',
            })
          )

          return {
            auth: updatedAuth,
          }
        }),

      reset: () => {
        removeCookie(AUTH_STORAGE_KEY)

        set({
          auth: {
            user: null,
            accessToken: '',
            setUser: () => {},
            setAccessToken: () => {},
            resetAccessToken: () => {},
            reset: () => {},
          },
        })
      },
    },
  }
})
