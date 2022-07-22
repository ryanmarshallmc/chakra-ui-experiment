import { useAuthUser } from 'next-firebase-auth'
import { createContext, useContext } from 'react'

const AuthContext = createContext()

export function Auth({ children }) {
  const user = useAuthUser()
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
