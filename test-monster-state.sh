#!/bin/bash

# Script de test pour la route /api/monster/state
# Usage: ./test-monster-state.sh [monster_id]

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Test Route /api/monster/state        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Vérifier si un ID est fourni
if [ -z "$1" ]; then
  echo -e "${YELLOW}⚠️  Aucun ID fourni${NC}"
  echo -e "Usage: ./test-monster-state.sh <monster_id>"
  echo ""
  echo -e "${BLUE}💡 Pour obtenir un ID de monstre :${NC}"
  echo "1. Allez sur http://localhost:3000/dashboard"
  echo "2. Cliquez sur un monstre"
  echo "3. Copiez l'ID depuis l'URL : /creature/[ID]"
  echo ""
  exit 1
fi

MONSTER_ID=$1
BASE_URL="http://localhost:3000"

echo -e "${GREEN}🎯 Test de la route avec l'ID : ${MONSTER_ID}${NC}"
echo ""

# Test 1 : Vérifier que le serveur répond
echo -e "${BLUE}📡 Test 1 : Vérification du serveur...${NC}"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/monster/state?id=${MONSTER_ID}")

if [ "$STATUS" -eq 200 ]; then
  echo -e "${GREEN}✅ Serveur actif (Status: ${STATUS})${NC}"
else
  echo -e "${RED}❌ Erreur serveur (Status: ${STATUS})${NC}"
  exit 1
fi
echo ""

# Test 2 : Appeler la route plusieurs fois
echo -e "${BLUE}🔄 Test 2 : Changements d'état aléatoires (5 appels)...${NC}"
echo ""

for i in {1..5}; do
  echo -e "${YELLOW}Appel #${i}:${NC}"
  
  RESPONSE=$(curl -s "${BASE_URL}/api/monster/state?id=${MONSTER_ID}")
  
  # Extraire le succès
  SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true' | wc -l)
  
  if [ "$SUCCESS" -eq 1 ]; then
    echo -e "${GREEN}✅ Succès${NC}"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
  else
    echo -e "${RED}❌ Échec${NC}"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
  fi
  
  echo ""
  
  # Attendre 1 seconde entre les appels
  if [ $i -lt 5 ]; then
    sleep 1
  fi
done

# Test 3 : Test avec ID invalide
echo -e "${BLUE}🧪 Test 3 : Test avec ID invalide...${NC}"
INVALID_RESPONSE=$(curl -s "${BASE_URL}/api/monster/state?id=invalid-id")
echo "$INVALID_RESPONSE" | jq '.' 2>/dev/null || echo "$INVALID_RESPONSE"
echo ""

# Test 4 : Test sans ID
echo -e "${BLUE}🧪 Test 4 : Test sans ID...${NC}"
NO_ID_RESPONSE=$(curl -s "${BASE_URL}/api/monster/state")
echo "$NO_ID_RESPONSE" | jq '.' 2>/dev/null || echo "$NO_ID_RESPONSE"
echo ""

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Tests terminés !                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}💡 Conseil :${NC} Allez voir votre monstre sur le dashboard pour vérifier que l'état a changé !"
echo -e "${BLUE}🔗 URL :${NC} ${BASE_URL}/creature/${MONSTER_ID}"
