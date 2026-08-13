import LogoMark from './LogoMark'
import { signOut } from '../lib/auth'
import { useAuth } from '../lib/AuthContext'

type View = 'pos' | 'menu'

interface Props {
  active: View
  onNavigate: (view: View) => void
}

export default function AppHeader({ active, onNavigate }: Props) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <LogoMark className="h-8 w-8" />
          <span className="font-heading font-semibold text-lg">Impasto</span>
        </div>

        <nav className="flex items-center gap-1" aria-label="Navigazione">
          <button
            type="button"
            onClick={() => onNavigate('pos')}
            className={`rounded px-3 py-1.5 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
              active === 'pos' ? 'bg-foreground text-background' : 'text-muted hover:text-foreground'
            }`}
          >
            Cassa
          </button>
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className={`rounded px-3 py-1.5 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
              active === 'menu' ? 'bg-foreground text-background' : 'text-muted hover:text-foreground'
            }`}
          >
            Menu
          </button>
        </nav>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted hidden sm:inline">{user?.email}</span>
          <button
            type="button"
            onClick={() => signOut()}
            className="font-semibold text-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
          >
            Esci
          </button>
        </div>
      </div>
    </header>
  )
}
