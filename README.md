# prod-eclyps

Site officiel de l'équipe esport ECLYPS. Consomme l'API FastAPI partagée (`prod-api`) via `site_id = 2`.

## Stack

- **React 19** + **JavaScript** + **Vite**
- **React Router** — navigation SPA

## Structure

```
prod-eclyps/
├── src/
│   ├── components/   # Composants réutilisables
│   ├── data/         # Données statiques
│   ├── media/        # Images et assets média
│   ├── pages/        # Pages associées aux routes
│   ├── App.jsx       # Composant racine + routing
│   └── main.jsx      # Point d'entrée React
├── public/           # Assets statiques
├── dist/             # Build de production (committé)
├── .env.production   # Variables d'environnement de production
└── deploy.sh         # Script de déploiement
```

## Démarrage

```bash
npm install
npm run dev      # Serveur de développement (http://localhost:5173)
npm run build    # Build → dist/
npm run lint     # ESLint
npm run preview  # Prévisualisation du build de production
```

## Variables d'environnement

```env
VITE_API_URL=https://api.t-etendard.fr
```

`.env.production` est committé. `.env.local` et `.env.development` sont ignorés par git.

## Points clés

- Projet en **JavaScript** (contrairement au portfolio en TypeScript).
- Pas de framework de tests.

## Déploiement

Le `dist/` est committé dans git. Le déploiement consiste en un simple `git pull` sur le serveur, qui sert les fichiers statiques via le conteneur Docker `nginx-static`.

**Production :** `https://eclyps-esport.fr`
