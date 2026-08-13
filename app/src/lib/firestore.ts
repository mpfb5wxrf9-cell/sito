import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebaseConfig'
import type { MenuItem, Order, OrderLine, OrderSource, OrderStatus, OrderType } from './types'

function toMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis()
  return typeof value === 'number' ? value : Date.now()
}

// Ordina per categoria e nome in JavaScript invece di chiederlo a Firestore
// con due orderBy: una query con orderBy su due campi diversi richiede un
// indice composito su Firestore "vero" (l'emulatore locale invece la
// esegue comunque, quindi il problema non emergeva in sviluppo). Senza
// quell'indice la query falliva in silenzio — nessun errore, ma il menu
// restava vuoto per sempre. Ordinare qui evita di dover creare indici
// manualmente in console.
function sortByCategoryThenName(items: MenuItem[]): MenuItem[] {
  return [...items].sort(
    (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
  )
}

export function watchMenuItems(callback: (items: MenuItem[]) => void) {
  return onSnapshot(
    collection(db, 'menuItems'),
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as MenuItem)
      callback(sortByCategoryThenName(items).filter((item) => item.active !== false))
    },
    (err) => console.error('watchMenuItems:', err),
  )
}

export function watchAllMenuItems(callback: (items: MenuItem[]) => void) {
  return onSnapshot(
    collection(db, 'menuItems'),
    (snapshot) => {
      callback(sortByCategoryThenName(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as MenuItem)))
    },
    (err) => console.error('watchAllMenuItems:', err),
  )
}

export async function createMenuItem(data: Omit<MenuItem, 'id'>) {
  await addDoc(collection(db, 'menuItems'), data)
}

export async function updateMenuItem(id: string, data: Partial<Omit<MenuItem, 'id'>>) {
  await updateDoc(doc(db, 'menuItems', id), data)
}

export async function deleteMenuItem(id: string) {
  await deleteDoc(doc(db, 'menuItems', id))
}

export function watchOrders(callback: (orders: Order[]) => void) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(100))
  return onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          type: data.type,
          tableLabel: data.tableLabel,
          items: data.items,
          status: data.status,
          total: data.total,
          createdAt: toMillis(data.createdAt),
          updatedAt: toMillis(data.updatedAt),
          source: data.source,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerAddress: data.customerAddress,
        } as Order
      })
      callback(orders)
    },
    (err) => console.error('watchOrders:', err),
  )
}

interface CreateOrderInput {
  type: OrderType
  tableLabel?: string
  items: OrderLine[]
  source?: OrderSource
  customerName?: string
  customerPhone?: string
  customerAddress?: string
}

export async function createOrder(input: CreateOrderInput) {
  const total = input.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0)
  await addDoc(collection(db, 'orders'), {
    type: input.type,
    tableLabel: input.tableLabel ?? null,
    items: input.items,
    status: 'aperto' as OrderStatus,
    total,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    source: input.source ?? 'staff',
    customerName: input.customerName ?? null,
    customerPhone: input.customerPhone ?? null,
    customerAddress: input.customerAddress ?? null,
  })
}

export async function setOrderStatus(orderId: string, status: OrderStatus) {
  await updateDoc(doc(db, 'orders', orderId), {
    status,
    updatedAt: serverTimestamp(),
  })
}
