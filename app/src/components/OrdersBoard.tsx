import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, type Order, type OrderStatus } from '../lib/types'

interface Props {
  orders: Order[]
  onAdvance: (order: Order) => void
}

const ORDER_TYPE_LABEL: Record<Order['type'], string> = {
  tavolo: 'Tavolo',
  asporto: 'Asporto',
  delivery: 'Delivery',
}

const NEXT_ACTION_LABEL: Record<OrderStatus, string> = {
  aperto: 'Manda in cucina',
  in_cucina: 'Segna pronto',
  pronto: 'Incassa',
  pagato: '',
}

function nextStatus(status: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUS_FLOW.indexOf(status)
  return idx >= 0 && idx < ORDER_STATUS_FLOW.length - 1 ? ORDER_STATUS_FLOW[idx + 1] : null
}

export default function OrdersBoard({ orders, onAdvance }: Props) {
  const columns = ORDER_STATUS_FLOW

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((status) => {
        const ordersInColumn = orders.filter((o) => o.status === status)
        return (
          <div key={status} className="rounded-md bg-muted-surface p-4">
            <h3 className="font-heading text-sm font-bold text-muted uppercase tracking-wide mb-3">
              {ORDER_STATUS_LABEL[status]} · {ordersInColumn.length}
            </h3>
            <div className="space-y-3">
              {ordersInColumn.map((order) => (
                <div key={order.id} className="rounded bg-surface border border-border p-4">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      {ORDER_TYPE_LABEL[order.type]}
                      {order.tableLabel ? ` ${order.tableLabel}` : ''}
                      {order.source === 'online' && (
                        <span className="rounded bg-accent/15 text-accent px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                          Online
                        </span>
                      )}
                    </span>
                    <span>{new Date(order.createdAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {(order.customerName || order.customerPhone || order.customerAddress) && (
                    <p className="mt-1 text-xs text-muted">
                      {[order.customerName, order.customerPhone, order.customerAddress].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <ul className="mt-2 text-sm space-y-0.5">
                    {order.items.map((line, i) => (
                      <li key={i} className="text-foreground">
                        {line.qty}x {line.name}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-heading font-bold text-sm">€{order.total.toFixed(2)}</span>
                    {nextStatus(order.status) && (
                      <button
                        type="button"
                        onClick={() => onAdvance(order)}
                        className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity duration-200 cursor-pointer"
                      >
                        {NEXT_ACTION_LABEL[order.status]}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {ordersInColumn.length === 0 && (
                <p className="text-xs text-muted text-center py-4">Nessun ordine</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
