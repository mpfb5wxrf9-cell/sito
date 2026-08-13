import type { OrderLine, OrderType } from '../lib/types'

interface Props {
  orderType: OrderType
  onOrderTypeChange: (type: OrderType) => void
  tableLabel: string
  onTableLabelChange: (label: string) => void
  lines: OrderLine[]
  onIncrement: (menuItemId: string) => void
  onDecrement: (menuItemId: string) => void
  onSubmit: () => void
  submitting: boolean
}

const ORDER_TYPES: { value: OrderType; label: string }[] = [
  { value: 'tavolo', label: 'Tavolo' },
  { value: 'asporto', label: 'Asporto' },
  { value: 'delivery', label: 'Delivery' },
]

export default function Cart({
  orderType,
  onOrderTypeChange,
  tableLabel,
  onTableLabelChange,
  lines,
  onIncrement,
  onDecrement,
  onSubmit,
  submitting,
}: Props) {
  const total = lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0)

  return (
    <aside className="w-full lg:w-80 shrink-0 rounded-md border border-border bg-surface p-5 flex flex-col h-fit lg:sticky lg:top-6">
      <div className="flex gap-2">
        {ORDER_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onOrderTypeChange(t.value)}
            className={`flex-1 rounded px-2 py-2 text-xs font-semibold transition-colors duration-200 cursor-pointer ${
              orderType === t.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted-surface text-muted hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {orderType === 'tavolo' && (
        <input
          type="text"
          placeholder="Numero tavolo"
          value={tableLabel}
          onChange={(e) => onTableLabelChange(e.target.value)}
          className="mt-3 w-full rounded border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
      )}

      <div className="mt-5 flex-1 space-y-3 min-h-24">
        {lines.length === 0 && (
          <p className="text-sm text-muted text-center py-8">Il carrello è vuoto.</p>
        )}
        {lines.map((line) => (
          <div key={line.menuItemId} className="flex items-center justify-between gap-2 text-sm">
            <div className="min-w-0">
              <p className="font-medium truncate">{line.name}</p>
              <p className="text-muted text-xs">€{line.unitPrice.toFixed(2)} x {line.qty}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => onDecrement(line.menuItemId)}
                aria-label={`Togli una unità di ${line.name}`}
                className="h-7 w-7 rounded-md border border-border text-foreground hover:bg-muted-surface transition-colors duration-200 cursor-pointer"
              >
                −
              </button>
              <span className="w-4 text-center">{line.qty}</span>
              <button
                type="button"
                onClick={() => onIncrement(line.menuItemId)}
                aria-label={`Aggiungi una unità di ${line.name}`}
                className="h-7 w-7 rounded-md border border-border text-foreground hover:bg-muted-surface transition-colors duration-200 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-border">
        <div className="flex items-center justify-between font-heading font-bold">
          <span>Totale</span>
          <span>€{total.toFixed(2)}</span>
        </div>
        <button
          type="button"
          disabled={lines.length === 0 || submitting || (orderType === 'tavolo' && !tableLabel.trim())}
          onClick={onSubmit}
          className="mt-4 w-full rounded bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Invio…' : 'Invia ordine'}
        </button>
      </div>
    </aside>
  )
}
