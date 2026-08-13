import { useEffect, useState, type FormEvent } from 'react'
import AppHeader from '../components/AppHeader'
import { watchAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../lib/firestore'
import type { MenuItem } from '../lib/types'

interface Props {
  onNavigate: (view: 'pos' | 'menu') => void
}

interface DraftItem {
  name: string
  category: string
  price: string
}

const EMPTY_DRAFT: DraftItem = { name: '', category: '', price: '' }

export default function MenuManager({ onNavigate }: Props) {
  const [items, setItems] = useState<MenuItem[]>([])
  const [newItem, setNewItem] = useState<DraftItem>(EMPTY_DRAFT)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<DraftItem>(EMPTY_DRAFT)

  useEffect(() => watchAllMenuItems(setItems), [])

  const categories = Array.from(new Set(items.map((item) => item.category))).sort()

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    const price = Number(newItem.price.replace(',', '.'))
    if (!newItem.name.trim() || !newItem.category.trim() || Number.isNaN(price)) return
    setAdding(true)
    try {
      await createMenuItem({ name: newItem.name.trim(), category: newItem.category.trim(), price, active: true })
      setNewItem(EMPTY_DRAFT)
    } finally {
      setAdding(false)
    }
  }

  function startEdit(item: MenuItem) {
    setEditingId(item.id)
    setEditDraft({ name: item.name, category: item.category, price: String(item.price) })
  }

  async function saveEdit(id: string) {
    const price = Number(editDraft.price.replace(',', '.'))
    if (!editDraft.name.trim() || !editDraft.category.trim() || Number.isNaN(price)) return
    await updateMenuItem(id, { name: editDraft.name.trim(), category: editDraft.category.trim(), price })
    setEditingId(null)
  }

  async function toggleActive(item: MenuItem) {
    await updateMenuItem(item.id, { active: item.active === false })
  }

  async function handleDelete(item: MenuItem) {
    if (window.confirm(`Eliminare "${item.name}" dal menu?`)) {
      await deleteMenuItem(item.id)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader active="menu" onNavigate={onNavigate} />

      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="font-heading text-2xl font-semibold">Menu</h1>
        <p className="mt-1 text-sm text-muted">
          Le modifiche compaiono subito nella cassa. Disattiva una voce per nasconderla senza eliminarla.
        </p>

        <form onSubmit={handleAdd} className="mt-6 rounded-md border border-border bg-surface p-5">
          <h2 className="font-heading text-lg font-semibold mb-4">Aggiungi voce</h2>
          <div className="grid sm:grid-cols-[2fr_1.5fr_1fr_auto] gap-3">
            <div>
              <label htmlFor="new-name" className="block text-xs font-medium text-muted mb-1">Nome</label>
              <input
                id="new-name"
                type="text"
                required
                value={newItem.name}
                onChange={(e) => setNewItem((d) => ({ ...d, name: e.target.value }))}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
            </div>
            <div>
              <label htmlFor="new-category" className="block text-xs font-medium text-muted mb-1">Categoria</label>
              <input
                id="new-category"
                type="text"
                required
                list="category-options"
                value={newItem.category}
                onChange={(e) => setNewItem((d) => ({ ...d, category: e.target.value }))}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
              <datalist id="category-options">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="new-price" className="block text-xs font-medium text-muted mb-1">Prezzo €</label>
              <input
                id="new-price"
                type="text"
                inputMode="decimal"
                required
                placeholder="0.00"
                value={newItem.price}
                onChange={(e) => setNewItem((d) => ({ ...d, price: e.target.value }))}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={adding}
                className="w-full sm:w-auto rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {adding ? 'Aggiungo…' : 'Aggiungi'}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 space-y-8">
          {categories.length === 0 && (
            <p className="text-sm text-muted text-center py-8">Il menu è vuoto. Aggiungi la prima voce qui sopra.</p>
          )}
          {categories.map((category) => (
            <div key={category}>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {items
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`rounded border border-border bg-surface p-3 ${item.active === false ? 'opacity-50' : ''}`}
                    >
                      {editingId === item.id ? (
                        <div className="grid sm:grid-cols-[2fr_1.5fr_1fr_auto_auto] gap-2 items-center">
                          <input
                            type="text"
                            value={editDraft.name}
                            onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                            className="rounded border border-border bg-background px-2.5 py-1.5 text-sm"
                          />
                          <input
                            type="text"
                            value={editDraft.category}
                            onChange={(e) => setEditDraft((d) => ({ ...d, category: e.target.value }))}
                            className="rounded border border-border bg-background px-2.5 py-1.5 text-sm"
                          />
                          <input
                            type="text"
                            inputMode="decimal"
                            value={editDraft.price}
                            onChange={(e) => setEditDraft((d) => ({ ...d, price: e.target.value }))}
                            className="rounded border border-border bg-background px-2.5 py-1.5 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => saveEdit(item.id)}
                            className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground cursor-pointer"
                          >
                            Salva
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded border border-border px-3 py-1.5 text-xs font-semibold text-foreground cursor-pointer"
                          >
                            Annulla
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">
                              {item.name}
                              {item.active === false && <span className="ml-2 text-xs text-muted">(nascosto)</span>}
                            </p>
                            <p className="text-xs text-muted">€{item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 text-xs">
                            <button
                              type="button"
                              onClick={() => toggleActive(item)}
                              className="rounded border border-border px-2.5 py-1.5 font-semibold text-foreground hover:bg-muted-surface transition-colors duration-200 cursor-pointer"
                            >
                              {item.active === false ? 'Riattiva' : 'Nascondi'}
                            </button>
                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                              className="rounded border border-border px-2.5 py-1.5 font-semibold text-foreground hover:bg-muted-surface transition-colors duration-200 cursor-pointer"
                            >
                              Modifica
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              className="rounded border border-destructive px-2.5 py-1.5 font-semibold text-destructive hover:bg-destructive hover:text-primary-foreground transition-colors duration-200 cursor-pointer"
                            >
                              Elimina
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
