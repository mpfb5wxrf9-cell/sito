import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { watchAuthState } from './auth'

interface AuthContextValue {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = watchAuthState((u) => {
      // Un utente anonimo (creato dalla pagina ordini pubblica #/ordina se
      // aperta nello stesso browser) non è staff: trattarlo come "non
      // loggato" qui, altrimenti l'app staff lascia entrare senza un vero
      // login e ogni scrittura sul menu/ordini fallisce con
      // permission-denied (le regole richiedono un provider diverso da
      // "anonymous" per le azioni da staff).
      setUser(u && !u.isAnonymous ? u : null)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
