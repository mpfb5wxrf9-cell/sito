export type OrderType = 'tavolo' | 'asporto' | 'delivery'

export type OrderStatus = 'aperto' | 'in_cucina' | 'pronto' | 'pagato'

export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  active: boolean
}

export interface OrderLine {
  menuItemId: string
  name: string
  unitPrice: number
  qty: number
  notes?: string
}

export interface Order {
  id: string
  type: OrderType
  tableLabel?: string
  items: OrderLine[]
  status: OrderStatus
  total: number
  createdAt: number
  updatedAt: number
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  aperto: 'Aperto',
  in_cucina: 'In cucina',
  pronto: 'Pronto',
  pagato: 'Pagato',
}

export const ORDER_STATUS_FLOW: OrderStatus[] = ['aperto', 'in_cucina', 'pronto', 'pagato']
