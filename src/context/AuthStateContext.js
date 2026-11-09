import { createContext, useContext } from 'react'

export const AuthStateContext = createContext(null)

export function useAuth() {
  return useContext(AuthStateContext)
}