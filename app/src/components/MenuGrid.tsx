import type { MenuItem } from '../lib/types'

interface Props {
  items: MenuItem[]
  onAdd: (item: MenuItem) => void
}

export default function MenuGrid({ items, onAdd }: Props) {
  const categories = Array.from(new Set(items.map((item) => item.category)))

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted p-6 text-center">
        Nessuna voce di menu trovata. Aggiungile nella collezione <code>menuItems</code> su Firestore.
      </p>
    )
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category}>
          <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-muted mb-3">
            {category}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {items
              .filter((item) => item.category === category)
              .map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onAdd(item)}
                  className="text-left rounded border border-border bg-surface p-4 hover:border-foreground transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="mt-1 text-sm text-muted">€{item.price.toFixed(2)}</p>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
