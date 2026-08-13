import { useEffect, useState, type FormEvent } from 'react'
import LogoMark from '../components/LogoMark'
import { ensureAnonymousSession } from '../lib/auth'
import { watchMenuItems, createOrder } from '../lib/firestore'
import type { MenuItem, OrderLine, OrderType } from '../lib/types'

type PublicOrderType = Extract<OrderType, 'asporto' | 'delivery'>

export default function OrderPage() {
  const [ready, setReady] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [orderType, setOrderType] = useState<PublicOrderType>('asporto')
  const [cartLines, setCartLines] = useState<OrderLine[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    ensureAnonymousSession()
      .then(() => setReady(true))
      .catch(() => setError('Impossibile collegarsi. Riprova tra poco.'))
  }, [])

  useEffect(() => {
    if (!ready) return
    return watchMenuItems(setMenuItems)
  }, [ready])

  const categories = Array.from(new Set(menuItems.map((item) => item.category)))
  const total = cartLines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0)

  function addToCart(item: MenuItem) {
    setCartLines((prev) => {
      const existing = prev.find((l) => l.menuItemId === item.id)
      if (existing) {
        return prev.map((l) => (l.menuItemId === item.id ? { ...l, qty: l.qty + 1 } : l))
      }
      return [...prev, { menuItemId: item.id, name: item.name, unitPrice: item.price, qty: 1 }]
    })
  }

  function decrement(menuItemId: string) {
    setCartLines((prev) =>
      prev.map((l) => (l.menuItemId === menuItemId ? { ...l, qty: l.qty - 1 } : l)).filter((l) => l.qty > 0),
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (cartLines.length === 0) return
    setSubmitting(true)
    setError(null)
    try {
      await createOrder({
        type: orderType,
        items: cartLines,
        source: 'online',
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerAddress: orderType === 'delivery' ? address.trim() : undefined,
      })
      setConfirmed(true)
    } catch {
      setError("Non siamo riusciti a inviare l'ordine. Riprova.")
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <LogoMark className="h-14 w-14 mx-auto" />
          <h1 className="mt-6 font-heading text-2xl font-semibold">Ordine ricevuto!</h1>
          <p className="mt-2 text-sm text-muted">
            Grazie {name || ''}, il tuo ordine è arrivato in cucina. Paghi{' '}
            {orderType === 'delivery' ? 'alla consegna' : 'al ritiro'}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-2">
          <LogoMark className="h-8 w-8" />
          <span className="font-heading font-semibold text-lg">Impasto</span>
          <span className="text-xs text-muted ml-2 hidden sm:inline">Ordina online</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 pb-40">
        {!ready && !error && <p className="text-sm text-muted">Caricamento…</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {ready && (
          <>
            <div className="flex gap-2">
              {(['asporto', 'delivery'] as PublicOrderType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setOrderType(t)}
                  className={`rounded px-4 py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    orderType === t ? 'bg-foreground text-background' : 'bg-muted-surface text-muted hover:text-foreground'
                  }`}
                >
                  {t === 'asporto' ? 'Ritiro in negozio' : 'Consegna a domicilio'}
                </button>
              ))}
            </div>

            <div className="mt-8 space-y-8">
              {menuItems.length === 0 && (
                <p className="text-sm text-muted">Il menu non è ancora disponibile, riprova tra poco.</p>
              )}
              {categories.map((category) => (
                <div key={category}>
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted mb-3">
                    {category}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {menuItems
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => addToCart(item)}
                          className="text-left rounded border border-border bg-surface p-4 hover:border-foreground transition-colors duration-200 cursor-pointer"
                        >
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="mt-1 text-sm text-muted">€{item.price.toFixed(2)}</p>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {cartLines.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 border-t border-border bg-surface">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-6 py-4">
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {cartLines.map((line) => (
                <div key={line.menuItemId} className="flex items-center justify-between text-sm">
                  <span>{line.qty}x {line.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted">€{(line.unitPrice * line.qty).toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => decrement(line.menuItemId)}
                      aria-label={`Togli una unità di ${line.name}`}
                      className="h-6 w-6 rounded border border-border text-foreground cursor-pointer"
                    >
                      −
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid sm:grid-cols-3 gap-2">
              <input
                type="text"
                required
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
              <input
                type="tel"
                required
                placeholder="Telefono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
              {orderType === 'delivery' && (
                <input
                  type="text"
                  required
                  placeholder="Indirizzo di consegna"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                />
              )}
            </div>

            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

            <div className="mt-3 flex items-center justify-between">
              <span className="font-heading font-bold">Totale €{total.toFixed(2)}</span>
              <button
                type="submit"
                disabled={submitting}
                className="rounded bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Invio…' : `Ordina · paga ${orderType === 'delivery' ? 'alla consegna' : 'al ritiro'}`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
