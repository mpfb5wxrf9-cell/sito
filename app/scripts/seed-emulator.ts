// Popola gli emulatori Firebase (Firestore + Auth) con dati di esempio
// per lo sviluppo locale. Non tocca mai il progetto Firebase reale:
// si collega solo se FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST
// sono impostate (vedi npm run seed).
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error('FIRESTORE_EMULATOR_HOST non impostata: questo script scrive solo sugli emulatori, non su Firebase reale.')
}

const app = initializeApp({ projectId: 'impasto-pos-demo' })
const db = getFirestore(app)
const auth = getAuth(app)

const menuItems = [
  { name: 'Margherita', category: 'Pizze', price: 6.5, active: true },
  { name: 'Diavola', category: 'Pizze', price: 8.0, active: true },
  { name: 'Quattro Formaggi', category: 'Pizze', price: 8.5, active: true },
  { name: 'Capricciosa', category: 'Pizze', price: 9.0, active: true },
  { name: 'Acqua naturale 0.5L', category: 'Bevande', price: 1.5, active: true },
  { name: 'Coca-Cola 0.33L', category: 'Bevande', price: 3.0, active: true },
  { name: 'Birra artigianale', category: 'Bevande', price: 5.0, active: true },
  { name: 'Tiramisù', category: 'Dolci', price: 4.5, active: true },
]

async function seed() {
  const menuCollection = db.collection('menuItems')
  const existing = await menuCollection.limit(1).get()
  if (existing.empty) {
    const batch = db.batch()
    for (const item of menuItems) {
      batch.set(menuCollection.doc(), item)
    }
    await batch.commit()
    console.log(`Menu seedato: ${menuItems.length} voci`)
  } else {
    console.log('Menu già presente, salto il seed.')
  }

  const email = 'staff@impasto.local'
  const password = 'impasto123'
  try {
    await auth.getUserByEmail(email)
    console.log(`Utente staff già esistente: ${email}`)
  } catch {
    await auth.createUser({ email, password })
    console.log(`Utente staff creato: ${email} / ${password}`)
  }
}

seed().then(() => process.exit(0))
