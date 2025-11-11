#!/bin/bash

# Script de test des redirections - Tamagotcho
# Teste automatiquement tous les scénarios de redirection
# Usage: ./test-redirections.sh

echo "🧪 Test du système de redirections - Tamagotcho"
echo "================================================"
echo ""

# Couleurs pour le terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL de base (peut être changée pour la production)
BASE_URL="${BASE_URL:-http://localhost:3000}"

# Compteurs
PASSED=0
FAILED=0

# Fonction de test
test_redirect() {
  local name="$1"
  local url="$2"
  local expected_status="$3"
  local expected_location="$4"
  
  echo -n "Test: $name... "
  
  # Faire la requête et capturer le status et location
  response=$(curl -s -I -L "$BASE_URL$url" 2>&1)
  status=$(echo "$response" | grep -i "^HTTP" | head -1 | awk '{print $2}')
  location=$(echo "$response" | grep -i "^location:" | head -1 | awk '{print $2}' | tr -d '\r')
  
  # Vérifier le status
  if [[ "$status" == "$expected_status" ]]; then
    # Si on attend une redirection, vérifier la location
    if [[ -n "$expected_location" ]]; then
      if echo "$location" | grep -q "$expected_location"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
      else
        echo -e "${RED}❌ FAIL${NC} (Expected location: $expected_location, Got: $location)"
        ((FAILED++))
      fi
    else
      echo -e "${GREEN}✅ PASS${NC}"
      ((PASSED++))
    fi
  else
    echo -e "${RED}❌ FAIL${NC} (Expected status: $expected_status, Got: $status)"
    ((FAILED++))
  fi
}

# Vérifier que le serveur est démarré
echo "Vérification du serveur sur $BASE_URL..."
if ! curl -s -I "$BASE_URL" > /dev/null 2>&1; then
  echo -e "${RED}❌ Erreur: Le serveur n'est pas accessible sur $BASE_URL${NC}"
  echo "Veuillez démarrer le serveur avec 'npm run dev' avant de lancer les tests"
  exit 1
fi
echo -e "${GREEN}✅ Serveur accessible${NC}"
echo ""

echo "🔍 Tests des routes publiques (utilisateur NON connecté)"
echo "--------------------------------------------------------"

# Scénario 1: Landing page accessible
test_redirect "Landing page accessible" "/" "200" ""

# Scénario 3-7: Routes protégées redirigent vers /sign-in
test_redirect "Dashboard redirige vers sign-in" "/dashboard" "307" "/sign-in"
test_redirect "App redirige vers sign-in" "/app" "307" "/sign-in"
test_redirect "Shop redirige vers sign-in" "/shop" "307" "/sign-in"
test_redirect "Wallet redirige vers sign-in" "/wallet" "307" "/sign-in"
test_redirect "Creature redirige vers sign-in" "/creature" "307" "/sign-in"

echo ""
echo "🔍 Tests des routes API (doivent être accessibles)"
echo "---------------------------------------------------"

# Les API routes ne doivent pas être bloquées par le middleware
test_redirect "API monsters accessible" "/api/monsters" "401" ""
# 401 car pas de session, mais pas de redirection

echo ""
echo "🔍 Tests des assets statiques"
echo "------------------------------"

# Les assets ne doivent pas être redirigés
test_redirect "Favicon accessible" "/favicon.ico" "200" ""

echo ""
echo "📊 Résumé des tests"
echo "==================="
echo -e "Tests réussis: ${GREEN}$PASSED${NC}"
echo -e "Tests échoués: ${RED}$FAILED${NC}"
echo ""

if [[ $FAILED -eq 0 ]]; then
  echo -e "${GREEN}✅ Tous les tests sont passés !${NC}"
  exit 0
else
  echo -e "${RED}❌ Certains tests ont échoué${NC}"
  echo ""
  echo "Tests manuels recommandés:"
  echo "1. Connexion/Déconnexion"
  echo "2. Redirection après connexion"
  echo "3. Utilisateur connecté visite /"
  echo "4. Utilisateur connecté visite /sign-in"
  echo ""
  echo "Voir docs/REDIRECTIONS_TEST_PLAN.md pour les détails"
  exit 1
fi
