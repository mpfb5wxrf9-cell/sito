import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const useEmulator = import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR !== 'false'

// I valori di config web di Firebase NON sono segreti: sono pensati per
// stare nel client. La sicurezza è demandata alle Firestore Rules
// (vedi firestore.rules), non alla segretezza di questi valori.
//
// In modalità emulatore usiamo sempre un projectId fisso locale
// ("impasto-pos-demo", lo stesso di .firebaserc e dello script di seed):
// così npm run seed e npm run dev parlano sempre dello stesso "cassetto"
// dell'emulatore, indipendentemente dalla config del progetto reale.
const firebaseConfig = useEmulator
  ? {
      apiKey: 'demo-api-key',
      authDomain: 'impasto-pos-demo.firebaseapp.com',
      projectId: 'impasto-pos-demo',
      storageBucket: 'impasto-pos-demo.appspot.com',
      messagingSenderId: '000000000000',
      appId: '1:000000000000:web:0000000000000000000000',
    }
  : {
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
if (useEmulator) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}
