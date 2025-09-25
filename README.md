# Minimal Vite React TypeScript App

Une application Vite React TypeScript minimale qui affiche "Hello World".

## Structure du projet

- Vite comme outil de build
- React 18 avec TypeScript
- Dépendances minimales pour une application "Hello World"

## Développement

### Démarrer le serveur de développement

```bash
npm run dev
```

### Build pour la production

```bash
npm run build
```

### Prévisualiser le build

```bash
npm run preview
```

L'application sera disponible sur `http://localhost:5173/` et affichera simplement "Hello World".

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
