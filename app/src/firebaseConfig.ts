import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// I valori di config web di Firebase NON sono segreti: sono pensati per
// stare nel client. La sicurezza è demandata alle Firestore Rules
// (vedi firestore.rules), non alla segretezza di questi valori.
// Sostituisci i placeholder con la config reale del tuo progetto:
// Firebase Console -> Project settings -> General -> "Your apps" -> SDK setup and configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyCz7vASEJTfEZhVCRTYgMfue51eEfpi804',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'gestionale-690b0.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'gestionale-690b0',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'gestionale-690b0.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '567499373996',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:567499373996:web:89570cf5c96a23cc580e09',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// In sviluppo locale ci si collega automaticamente agli emulatori Firebase
// (Auth + Firestore) invece che al progetto reale, per non toccare mai
// dati di produzione durante lo sviluppo. Avviali con:
//   npm run emulators
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR !== 'false') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}
