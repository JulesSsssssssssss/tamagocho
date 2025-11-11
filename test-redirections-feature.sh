#!/bin/bash

# Script de test du système de redirections
# Teste tous les scénarios de redirection selon la Feature 2.1

echo "🧪 Test du système de redirections - Tamagotcho"
echo "================================================"
echo ""

# Configuration
BASE_URL="http://localhost:3000"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour tester une redirection
test_redirect() {
    local url=$1
    local expected_status=$2
    local expected_location=$3
    local description=$4
    
    echo -e "${YELLOW}Test:${NC} $description"
    echo "  URL: $url"
    
    # Faire la requête et récupérer le code de statut et la location
    response=$(curl -s -o /dev/null -w "%{http_code}|%{redirect_url}" -L "$url")
    status_code=$(echo "$response" | cut -d'|' -f1)
    location=$(echo "$response" | cut -d'|' -f2)
    
    # Vérifier le code de statut
    if [ "$status_code" == "$expected_status" ]; then
        echo -e "  ${GREEN}✓${NC} Status code: $status_code"
    else
        echo -e "  ${RED}✗${NC} Status code: $status_code (attendu: $expected_status)"
    fi
    
    # Vérifier la redirection si attendue
    if [ ! -z "$expected_location" ]; then
        if [[ "$location" == *"$expected_location"* ]]; then
            echo -e "  ${GREEN}✓${NC} Redirection vers: $expected_location"
        else
            echo -e "  ${RED}✗${NC} Redirection vers: $location (attendu: $expected_location)"
        fi
    fi
    
    echo ""
}

echo "📋 Scénario 1: Utilisateur NON connecté"
echo "---------------------------------------"
echo ""

test_redirect \
    "$BASE_URL/" \
    "200" \
    "" \
    "/ (landing page) - Doit rester sur la page d'accueil"

test_redirect \
    "$BASE_URL/dashboard" \
    "307" \
    "/sign-in" \
    "/dashboard - Doit rediriger vers /sign-in"

test_redirect \
    "$BASE_URL/app" \
    "307" \
    "/sign-in" \
    "/app - Doit rediriger vers /sign-in"

test_redirect \
    "$BASE_URL/wallet" \
    "307" \
    "/sign-in" \
    "/wallet - Doit rediriger vers /sign-in"

test_redirect \
    "$BASE_URL/shop" \
    "307" \
    "/sign-in" \
    "/shop - Doit rediriger vers /sign-in"

test_redirect \
    "$BASE_URL/creature/123" \
    "307" \
    "/sign-in" \
    "/creature/123 - Doit rediriger vers /sign-in"

echo ""
echo "📋 Scénario 2: Pages d'authentification"
echo "---------------------------------------"
echo ""

test_redirect \
    "$BASE_URL/sign-in" \
    "200" \
    "" \
    "/sign-in - Doit afficher le formulaire"

echo ""
echo "📋 Scénario 3: Paramètres de redirection"
echo "---------------------------------------"
echo ""

test_redirect \
    "$BASE_URL/sign-in?error=session_expired" \
    "200" \
    "" \
    "/sign-in?error=session_expired - Doit afficher un message d'erreur"

test_redirect \
    "$BASE_URL/sign-in?callbackUrl=/dashboard" \
    "200" \
    "" \
    "/sign-in?callbackUrl=/dashboard - Doit préparer la redirection post-connexion"

echo ""
echo "================================================"
echo "🏁 Tests terminés"
echo ""
echo "⚠️  Note: Pour tester le scénario 'Utilisateur CONNECTÉ':"
echo "   1. Connectez-vous manuellement sur $BASE_URL/sign-in"
echo "   2. Vérifiez que:"
echo "      - / redirige vers /app (puis /dashboard)"
echo "      - /sign-in redirige vers /app"
echo "      - /dashboard est accessible"
echo "      - /wallet est accessible"
echo ""
