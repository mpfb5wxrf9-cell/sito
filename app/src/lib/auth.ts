import {
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth } from '../firebaseConfig'

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

// Usata dalla pagina ordini pubblica: autentica il cliente in modo invisibile
// (nessun form) così le Firestore Rules possono comunque richiedere
// request.auth != null, distinguendo poi lo staff dal cliente anonimo via
// request.auth.token.firebase.sign_in_provider.
export async function ensureAnonymousSession() {
  if (!auth.currentUser) {
    await signInAnonymously(auth)
  }
  return auth.currentUser
}

export function signOut() {
  return firebaseSignOut(auth)
}

export function watchAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}
