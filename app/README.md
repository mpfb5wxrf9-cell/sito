# Impasto — Cassa & Ordini

App gestionale per pizzerie: cassa e gestione ordini (POS), gestione menu, e ordini online da parte dei clienti — tutto in tempo reale.

## Pagine

- `/` (richiede login staff): Cassa, tab **Cassa** e **Menu**
- `/#/ordina` (pubblica, nessun login): pagina ordini per i clienti — condividila con il pulsante "Copia link ordini online" nell'header della Cassa

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 (stessi token di brand di `../design-system/impasto/MASTER.md`)
- Firebase: Firestore (dati) + Authentication (login staff condiviso)

## Sviluppo locale

Lo sviluppo usa la **Firebase Local Emulator Suite**: non tocca mai il progetto Firebase reale.

```bash
npm install

# Terminale 1: avvia gli emulatori (Firestore + Auth)
npm run emulators

# Terminale 2: popola menu di esempio + utente staff (staff@impasto.local / impasto123)
npm run seed

# Terminale 3: avvia l'app
npm run dev
```

L'app si apre su `http://localhost:5173/sito/` e si collega automaticamente agli emulatori in sviluppo.

## Collegare il progetto Firebase reale

1. Nella console Firebase: abilita **Firestore Database** e **Authentication → Email/Password**
2. Abilita anche **Authentication → Sign-in method → Anonymous** — serve alla pagina ordini pubblica per autenticare i clienti in modo invisibile (nessun form di login per loro), le Firestore Rules gli danno solo il permesso di creare un ordine, non di leggere quelli altrui o toccare il menu
3. Crea l'utente staff condiviso (Authentication → Users → Add user)
4. Incolla il contenuto di `firestore.rules` in Firestore → Rules
5. Copia `.env.example` in `.env` e incolla i valori da Project settings → General → "Your apps" → SDK config
6. Popola `menuItems` in Firestore con le voci di menu reali (vedi struttura in `src/lib/types.ts`), oppure usa il tab "Menu" nell'app dopo il login

## Build & deploy

Il deploy su GitHub Pages è automatico tramite `.github/workflows/deploy-pages.yml` a ogni push su `main`.
Build manuale: `npm run build` (richiede `base: '/sito/'` in `vite.config.ts`, già configurato).
