import { AuthProvider, useAuth } from './lib/AuthContext'
import Login from './pages/Login'
import Pos from './pages/Pos'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted">Caricamento…</p>
      </div>
    )
  }

  return user ? <Pos /> : <Login />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
