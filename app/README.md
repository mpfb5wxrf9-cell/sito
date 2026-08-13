# Impasto — Cassa & Ordini

App gestionale per pizzerie. Prima release: cassa e gestione ordini (POS) in tempo reale.

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
2. Crea l'utente staff condiviso (Authentication → Users → Add user)
3. Incolla il contenuto di `firestore.rules` in Firestore → Rules
4. Copia `.env.example` in `.env` e incolla i valori da Project settings → General → "Your apps" → SDK config
5. Popola `menuItems` in Firestore con le voci di menu reali (vedi struttura in `src/lib/types.ts`)

## Build & deploy

Il deploy su GitHub Pages è automatico tramite `.github/workflows/deploy-pages.yml` a ogni push su `main`.
Build manuale: `npm run build` (richiede `base: '/sito/'` in `vite.config.ts`, già configurato).
