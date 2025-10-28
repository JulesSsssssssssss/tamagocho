# Documentation Docusaurus - Tamagotcho

Ce dossier contient la documentation technique du projet Tamagotcho construite avec **Docusaurus 3.9.2**.

## 🚀 Démarrage rapide

### Installation des dépendances

```bash
cd documentation
npm install
```

### Développement local

```bash
# Depuis la racine du projet
npm run dev:docs

# Ou depuis le dossier documentation
cd documentation
npm start
```

La documentation sera accessible sur [http://localhost:3000](http://localhost:3000)

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
