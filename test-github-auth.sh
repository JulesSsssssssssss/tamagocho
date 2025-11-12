#!/bin/bash

# Test de l'authentification GitHub avec Better Auth
# https://www.better-auth.com/docs/authentication/github

echo "🧪 Test d'authentification GitHub - Better Auth"
echo "================================================"
echo ""

# Vérifier les variables d'environnement
echo "✅ Vérification des variables d'environnement..."
if [ -z "$GITHUB_CLIENT_ID" ]; then
  echo "❌ GITHUB_CLIENT_ID non défini"
else
  echo "✓ GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID:0:10}..."
fi

if [ -z "$GITHUB_CLIENT_SECRET" ]; then
  echo "❌ GITHUB_CLIENT_SECRET non défini"
else
  echo "✓ GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET:0:10}..."
fi

echo ""
echo "📋 Configuration GitHub OAuth App:"
echo "  - Redirect URL: http://localhost:3000/api/auth/callback/github"
echo "  - Scopes requis: user:email (OBLIGATOIRE)"
echo ""
echo "🔧 Configuration Better Auth:"
echo "  - Provider: GitHub"
echo "  - Base URL: http://localhost:3000"
echo "  - Callback: /api/auth/callback/github"
echo ""
echo "🎯 Flux d'authentification:"
echo "  1. User clique sur 'Continuer avec GitHub'"
echo "  2. Redirection vers GitHub OAuth"
echo "  3. User autorise l'application"
echo "  4. GitHub redirige vers /api/auth/callback/github"
echo "  5. Better Auth crée/met à jour la session"
echo "  6. Redirection vers /dashboard"
echo ""
echo "🌐 Pages de test:"
echo "  - Sign-In: http://localhost:3000/sign-in"
echo "  - Dashboard: http://localhost:3000/dashboard"
echo "  - API Auth: http://localhost:3000/api/auth"
echo ""
echo "📚 Documentation:"
echo "  - Better Auth GitHub: https://www.better-auth.com/docs/authentication/github"
echo "  - GitHub Apps: https://github.com/settings/developers"
echo ""
echo "✅ Test prêt ! Ouvrez http://localhost:3000/sign-in"
