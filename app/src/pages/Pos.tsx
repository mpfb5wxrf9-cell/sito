import { useEffect, useState } from 'react'
import AppHeader from '../components/AppHeader'
import MenuGrid from '../components/MenuGrid'
import Cart from '../components/Cart'
import OrdersBoard from '../components/OrdersBoard'
import { watchMenuItems, watchOrders, createOrder, setOrderStatus } from '../lib/firestore'
import { ORDER_STATUS_FLOW, type MenuItem, type Order, type OrderLine, type OrderType } from '../lib/types'

interface Props {
  onNavigate: (view: 'pos' | 'menu') => void
}

export default function Pos({ onNavigate }: Props) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [orderType, setOrderType] = useState<OrderType>('tavolo')
  const [tableLabel, setTableLabel] = useState('')
  const [cartLines, setCartLines] = useState<OrderLine[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => watchMenuItems(setMenuItems), [])
  useEffect(() => watchOrders(setOrders), [])

  function addToCart(item: MenuItem) {
    setCartLines((prev) => {
      const existing = prev.find((l) => l.menuItemId === item.id)
      if (existing) {
        return prev.map((l) => (l.menuItemId === item.id ? { ...l, qty: l.qty + 1 } : l))
      }
      return [...prev, { menuItemId: item.id, name: item.name, unitPrice: item.price, qty: 1 }]
    })
  }

  function increment(menuItemId: string) {
    setCartLines((prev) => prev.map((l) => (l.menuItemId === menuItemId ? { ...l, qty: l.qty + 1 } : l)))
  }

  function decrement(menuItemId: string) {
    setCartLines((prev) =>
      prev
        .map((l) => (l.menuItemId === menuItemId ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0),
    )
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      await createOrder(orderType, orderType === 'tavolo' ? tableLabel : undefined, cartLines)
      setCartLines([])
      setTableLabel('')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAdvance(order: Order) {
    const idx = ORDER_STATUS_FLOW.indexOf(order.status)
    const next = ORDER_STATUS_FLOW[idx + 1]
    if (next) await setOrderStatus(order.id, next)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader active="pos" onNavigate={onNavigate} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <section className="flex-1 min-w-0">
            <MenuGrid items={menuItems} onAdd={addToCart} />
          </section>
          <Cart
            orderType={orderType}
            onOrderTypeChange={setOrderType}
            tableLabel={tableLabel}
            onTableLabelChange={setTableLabel}
            lines={cartLines}
            onIncrement={increment}
            onDecrement={decrement}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>

        <div className="mt-12">
          <h2 className="font-heading text-xl font-bold mb-4">Ordini attivi</h2>
          <OrdersBoard orders={orders} onAdvance={handleAdvance} />
        </div>
      </main>
    </div>
  )
}
