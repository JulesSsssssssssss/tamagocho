#!/bin/bash

# Script de vérification de la configuration des redirections
# Vérifie que tous les fichiers sont correctement configurés

echo "🔍 Vérification de la configuration des redirections"
echo "===================================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Vérifier l'existence des fichiers
echo "📁 Vérification des fichiers..."
echo "--------------------------------"

check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✅${NC} $1"
  else
    echo -e "${RED}❌${NC} $1 (MANQUANT)"
    ((ERRORS++))
  fi
}

check_file "src/middleware.ts"
check_file "src/app/page.tsx"
check_file "src/app/sign-in/page.tsx"
check_file "src/app/app/page.tsx"
check_file "src/app/dashboard/page.tsx"
check_file "src/components/dashboard/dashboard-content.tsx"
check_file "src/components/forms/signin-form.tsx"
check_file "src/components/forms/signup-form.tsx"

echo ""
echo "🔍 Vérification des configurations..."
echo "--------------------------------------"

# Vérifier middleware.ts
if grep -q "export function middleware" src/middleware.ts 2>/dev/null; then
  echo -e "${GREEN}✅${NC} Middleware: fonction exportée"
else
  echo -e "${RED}❌${NC} Middleware: fonction manquante"
  ((ERRORS++))
fi

if grep -q "better-auth.session_token" src/middleware.ts 2>/dev/null; then
  echo -e "${GREEN}✅${NC} Middleware: vérification cookie"
else
  echo -e "${RED}❌${NC} Middleware: cookie non vérifié"
  ((ERRORS++))
fi

if grep -q "export const config" src/middleware.ts 2>/dev/null; then
  echo -e "${GREEN}✅${NC} Middleware: config matcher présent"
else
  echo -e "${RED}❌${NC} Middleware: config matcher manquant"
  ((ERRORS++))
fi

# Vérifier page.tsx (landing)
if grep -q "redirect('/app')" src/app/page.tsx 2>/dev/null; then
  echo -e "${GREEN}✅${NC} Landing page: redirection si connecté"
else
  echo -e "${RED}❌${NC} Landing page: redirection manquante"
  ((ERRORS++))
fi

# Vérifier sign-in/page.tsx
if grep -q "redirect('/app')" src/app/sign-in/page.tsx 2>/dev/null; then
  echo -e "${GREEN}✅${NC} Sign-in page: redirection si connecté"
else
  echo -e "${RED}❌${NC} Sign-in page: redirection manquante"
  ((ERRORS++))
fi

# Vérifier signin-form.tsx
if grep -q "callbackURL: '/app'" src/components/forms/signin-form.tsx 2>/dev/null; then
  echo -e "${GREEN}✅${NC} Sign-in form: callbackURL = /app"
else
  echo -e "${RED}❌${NC} Sign-in form: callbackURL incorrect"
  ((ERRORS++))
fi

# Vérifier signup-form.tsx
if grep -q "callbackURL: '/app'" src/components/forms/signup-form.tsx 2>/dev/null; then
  echo -e "${GREEN}✅${NC} Sign-up form: callbackURL = /app"
else
  echo -e "${RED}❌${NC} Sign-up form: callbackURL incorrect"
  ((ERRORS++))
fi

# Vérifier dashboard-content.tsx
if grep -q "router.push('/')" src/components/dashboard/dashboard-content.tsx 2>/dev/null; then
  echo -e "${GREEN}✅${NC} Dashboard: déconnexion vers /"
else
  echo -e "${RED}❌${NC} Dashboard: déconnexion incorrecte"
  ((ERRORS++))
fi

if grep -q "useRouter" src/components/dashboard/dashboard-content.tsx 2>/dev/null; then
  echo -e "${GREEN}✅${NC} Dashboard: useRouter importé"
else
  echo -e "${RED}❌${NC} Dashboard: useRouter manquant"
  ((ERRORS++))
fi

echo ""
echo "🔍 Vérification des routes protégées..."
echo "---------------------------------------"

PROTECTED_ROUTES=("/dashboard" "/app" "/shop" "/wallet" "/creature")

for route in "${PROTECTED_ROUTES[@]}"; do
  if grep -q "$route" src/middleware.ts 2>/dev/null; then
    echo -e "${GREEN}✅${NC} Route protégée: $route"
  else
    echo -e "${YELLOW}⚠️${NC}  Route non listée dans middleware: $route"
  fi
done

echo ""
echo "📊 Résumé"
echo "========="

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ Configuration correcte ! Tous les checks sont passés.${NC}"
  echo ""
  echo "Prochaines étapes:"
  echo "1. Démarrer le serveur: npm run dev"
  echo "2. Exécuter les tests: ./test-redirections.sh"
  echo "3. Tests manuels: docs/REDIRECTIONS_MANUAL_TEST.md"
  exit 0
else
  echo -e "${RED}❌ $ERRORS erreur(s) détectée(s)${NC}"
  echo ""
  echo "Veuillez corriger les erreurs ci-dessus avant de continuer."
  exit 1
fi
