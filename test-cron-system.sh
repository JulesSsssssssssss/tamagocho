#!/bin/bash

# Script de test du système cron de mise à jour des monstres
# Usage: ./test-cron-system.sh [USER_ID]

# Couleurs pour la sortie
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🧪 Test du système cron - Mise à jour des monstres    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3000}"
USER_ID="${1:-}"

# Fonction pour afficher un test
test_endpoint() {
    local test_name=$1
    local url=$2
    local expected_status=$3
    
    echo -e "${YELLOW}📝 Test: ${test_name}${NC}"
    echo -e "   URL: ${url}"
    
    # Faire la requête et capturer le code de statut et la réponse
    response=$(curl -s -w "\n%{http_code}" "$url")
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    echo -e "   Status: ${http_code}"
    
    # Vérifier le statut
    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "   ${GREEN}✅ Statut correct (${http_code})${NC}"
    else
        echo -e "   ${RED}❌ Statut incorrect (attendu: ${expected_status}, reçu: ${http_code})${NC}"
    fi
    
    # Afficher le corps de la réponse (formaté si JSON)
    if command -v jq &> /dev/null; then
        echo -e "   ${BLUE}Réponse:${NC}"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        echo -e "   ${BLUE}Réponse:${NC} $body"
    fi
    
    echo ""
}

# Test 1: Endpoint sans userId
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test 1: Appel sans userId (tous les monstres)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
test_endpoint "GET sans userId" "${BASE_URL}/api/cron/update-monsters" 200

# Test 2: Endpoint avec userId
if [ -n "$USER_ID" ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Test 2: Appel avec userId spécifique${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    test_endpoint "GET avec userId=${USER_ID}" "${BASE_URL}/api/cron/update-monsters?userId=${USER_ID}" 200
else
    echo -e "${YELLOW}⚠️  Aucun USER_ID fourni, test 2 ignoré${NC}"
    echo -e "${YELLOW}   Usage: $0 <USER_ID>${NC}"
    echo ""
fi

# Test 3: Méthode POST
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test 3: Méthode POST${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

url="${BASE_URL}/api/cron/update-monsters"
if [ -n "$USER_ID" ]; then
    url="${url}?userId=${USER_ID}"
fi

echo -e "${YELLOW}📝 Test: POST ${url}${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "$url")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | head -n -1)

echo -e "   Status: ${http_code}"

if [ "$http_code" -eq 200 ]; then
    echo -e "   ${GREEN}✅ Statut correct (200)${NC}"
else
    echo -e "   ${RED}❌ Statut incorrect (attendu: 200, reçu: ${http_code})${NC}"
fi

if command -v jq &> /dev/null; then
    echo -e "   ${BLUE}Réponse:${NC}"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    echo -e "   ${BLUE}Réponse:${NC} $body"
fi

echo ""

# Résumé
echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    ✅ Tests terminés                     ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}💡 Conseils:${NC}"
echo -e "   • Vérifiez les logs serveur pour plus de détails"
echo -e "   • Consultez le README: src/app/api/cron/update-monsters/README.md"
echo -e "   • Consultez la doc complète: docs/CRON_SYSTEM_IMPLEMENTATION.md"
echo ""

if [ -z "$USER_ID" ]; then
    echo -e "${YELLOW}📌 Pour tester avec un userId spécifique:${NC}"
    echo -e "   ${BLUE}$0 <USER_ID>${NC}"
    echo ""
fi
