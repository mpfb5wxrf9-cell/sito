import { useState } from 'react'
import { AuthProvider, useAuth } from './lib/AuthContext'
import Login from './pages/Login'
import Pos from './pages/Pos'
import MenuManager from './pages/MenuManager'

type View = 'pos' | 'menu'

function AppContent() {
  const { user, loading } = useAuth()
  const [view, setView] = useState<View>('pos')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted">Caricamento…</p>
      </div>
    )
  }

  if (!user) return <Login />

  return view === 'pos' ? <Pos onNavigate={setView} /> : <MenuManager onNavigate={setView} />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
