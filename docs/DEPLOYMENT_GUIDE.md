# Guide de déploiement avec Docusaurus sur Vercel

Ce guide explique comment déployer l'application Next.js avec la documentation Docusaurus sur Vercel avec un seul déploiement.

## 📦 Structure du projet

```
tamagocho/
├── src/                    # Application Next.js
├── documentation/          # Documentation Docusaurus
│   ├── docs/               # Pages de documentation
│   ├── build/              # Build Docusaurus (généré)
│   └── docusaurus.config.ts
├── public/
│   └── documentation/      # Copie du build Docusaurus
├── next.config.ts          # Configuration Next.js avec rewrites
├── vercel.json             # Configuration Vercel
└── package.json            # Scripts de build combinés
```

## 🚀 Déploiement sur Vercel

### 1. Configuration automatique

Vercel détectera automatiquement votre projet Next.js.

### 2. Build Command

Le build command dans `package.json` est :

```json
{
  "scripts": {
    "build": "npm run build:docs && npm run copy:docs && next build --turbopack"
  }
}
```

**Étapes du build** :
1. `build:docs` : Build de Docusaurus dans `documentation/build`
2. `copy:docs` : Copie dans `public/documentation`
3. `next build` : Build de Next.js (inclut `public/documentation`)

### 3. Variables d'environnement

Configurez dans Vercel Dashboard :

```
MONGODB_URI=mongodb+srv://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://your-app.vercel.app
```

### 4. Déploiement

```bash
# Via Vercel CLI
vercel

# Ou via Git
git push origin main
```

## 🌐 URLs d'accès

Une fois déployé :

- **Application** : `https://your-app.vercel.app`
- **Documentation** : `https://your-app.vercel.app/documentation`

## ⚙️ Configuration des rewrites

### next.config.ts

```typescript
export default {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/documentation',
          destination: '/documentation/index.html',
        },
        {
          source: '/documentation/:path*',
          destination: '/documentation/:path*',
        },
      ],
    }
  },
}
```

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "routes": [
    {
      "src": "/documentation/(.*)",
      "dest": "/documentation/$1"
    }
  ]
}
```

## 🔧 Build local

Pour tester le build complet en local :

```bash
# Build complet
npm run build

# Servir en production
npm start

# Tester la documentation
# http://localhost:3000/documentation
```

## 🐛 Troubleshooting

### La documentation ne se charge pas

**Vérifiez** :
1. Le dossier `public/documentation` existe après le build
2. Le fichier `public/documentation/index.html` existe
3. Les rewrites Next.js sont corrects

**Solution** :
```bash
# Rebuild manuellement
npm run build:docs
npm run copy:docs
```

### Erreur 404 sur les liens de documentation

**Problème** : Le `baseUrl` de Docusaurus ne correspond pas

**Solution** : Vérifiez `docusaurus.config.ts` :
```typescript
baseUrl: '/documentation/',
```

### Build échoue sur Vercel

**Problème** : Dépendances manquantes

**Solution** : Vérifiez que `documentation/package.json` est ignoré par npm :
```json
// package.json racine
{
  "workspaces": {
    "nohoist": ["**/documentation"]
  }
}
```

## 📊 Performance

### Taille du build

- Next.js : ~10 MB
- Docusaurus : ~2 MB
- **Total** : ~12 MB

### Optimisations

1. **Minification** : Activée par défaut
2. **Tree-shaking** : Docusaurus inclut uniquement le nécessaire
3. **Code-splitting** : Chaque page de doc est un chunk séparé

## 🔄 Mises à jour de la documentation

Pour mettre à jour la documentation :

1. Modifiez les fichiers dans `documentation/docs/`
2. Commit et push
3. Vercel rebuild automatiquement

**Ou manuellement** :
```bash
npm run build:docs
npm run copy:docs
git add public/documentation
git commit -m "docs: update documentation"
git push
```

## 📝 Checklist de déploiement

- [ ] Variables d'environnement configurées dans Vercel
- [ ] `npm run build` fonctionne en local
- [ ] `public/documentation` contient le build Docusaurus
- [ ] `/documentation` est accessible après build local
- [ ] Git ignore `documentation/build` et `documentation/node_modules`
- [ ] `vercel.json` est présent à la racine
- [ ] `baseUrl: '/documentation/'` dans `docusaurus.config.ts`

## 🎯 Commandes utiles

```bash
# Développement Next.js
npm run dev

# Développement documentation
npm run dev:docs

# Build complet
npm run build

# Build documentation uniquement
npm run build:docs

# Copier la documentation
npm run copy:docs

# Lint
npm run lint
```

---

**Besoin d'aide ?** Consultez la [documentation Vercel](https://vercel.com/docs) ou [Docusaurus](https://docusaurus.io/docs/deployment)
