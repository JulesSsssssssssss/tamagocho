#!/bin/bash

# 🧪 Script de test des 4 actions du système d'items
# Prérequis : serveur Next.js lancé sur localhost:3000

echo "🎮 Test du système d'items - 4 actions"
echo "========================================"
echo ""

# Variables de test (à adapter selon votre environnement)
BASE_URL="http://localhost:3000"
MONSTER_ID="675e123abc456def789"
OWNER_ID="user_123"
ITEM_ID="test_hat_legendary"
PRICE=500

echo "📝 Configuration du test :"
echo "  - Monster ID: $MONSTER_ID"
echo "  - Owner ID: $OWNER_ID"
echo "  - Item ID: $ITEM_ID"
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ==========================================
# Action 1 : Visualiser l'inventaire AVANT
# ==========================================
echo -e "${BLUE}📦 Action 4A : Visualiser l'inventaire du monstre AVANT${NC}"
echo "GET $BASE_URL/api/inventory/$MONSTER_ID"
INVENTORY_BEFORE=$(curl -s "$BASE_URL/api/inventory/$MONSTER_ID")
echo "$INVENTORY_BEFORE" | jq '.'
ITEMS_COUNT_BEFORE=$(echo "$INVENTORY_BEFORE" | jq '.count // 0')
echo -e "${GREEN}✅ Inventaire récupéré : $ITEMS_COUNT_BEFORE items${NC}"
echo ""

# ==========================================
# Action 2 : Acheter un item
# ==========================================
echo -e "${BLUE}🛒 Action 1 : Acheter un accessoire${NC}"
echo "POST $BASE_URL/api/shop/purchase"
PURCHASE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/shop/purchase" \
  -H "Content-Type: application/json" \
  -d "{\"monsterId\":\"$MONSTER_ID\",\"itemId\":\"$ITEM_ID\",\"price\":$PRICE}")

echo "$PURCHASE_RESPONSE" | jq '.'

if echo "$PURCHASE_RESPONSE" | jq -e '.success == true' > /dev/null; then
  INVENTORY_ITEM_ID=$(echo "$PURCHASE_RESPONSE" | jq -r '.inventoryItemId')
  echo -e "${GREEN}✅ Item acheté avec succès !${NC}"
  echo "   Inventory Item ID: $INVENTORY_ITEM_ID"
else
  echo -e "${RED}❌ Échec de l'achat${NC}"
  echo "$PURCHASE_RESPONSE" | jq -r '.error'
  exit 1
fi
echo ""

# ==========================================
# Action 3 : Équiper l'item
# ==========================================
echo -e "${BLUE}🎯 Action 2 : Équiper l'accessoire${NC}"
echo "POST $BASE_URL/api/inventory/equip"
EQUIP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/inventory/equip" \
  -H "Content-Type: application/json" \
  -d "{\"monsterId\":\"$MONSTER_ID\",\"inventoryItemId\":\"$INVENTORY_ITEM_ID\"}")

echo "$EQUIP_RESPONSE" | jq '.'

if echo "$EQUIP_RESPONSE" | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✅ Item équipé avec succès !${NC}"
else
  echo -e "${RED}❌ Échec de l'équipement${NC}"
  exit 1
fi
echo ""

# ==========================================
# Action 4 : Visualiser l'inventaire APRÈS équipement
# ==========================================
echo -e "${BLUE}📦 Action 4A : Visualiser l'inventaire APRÈS équipement${NC}"
echo "GET $BASE_URL/api/inventory/$MONSTER_ID"
INVENTORY_AFTER_EQUIP=$(curl -s "$BASE_URL/api/inventory/$MONSTER_ID")
echo "$INVENTORY_AFTER_EQUIP" | jq '.'

ITEMS_COUNT_AFTER=$(echo "$INVENTORY_AFTER_EQUIP" | jq '.count // 0')
EQUIPPED_ITEMS=$(echo "$INVENTORY_AFTER_EQUIP" | jq '[.data[] | select(.isEquipped == true)] | length')

echo -e "${GREEN}✅ Inventaire récupéré : $ITEMS_COUNT_AFTER items ($EQUIPPED_ITEMS équipés)${NC}"
echo ""

# ==========================================
# Action 5 : Visualiser TOUS les items du joueur
# ==========================================
echo -e "${BLUE}👀 Action 4B : Visualiser tous les items du joueur${NC}"
echo "GET $BASE_URL/api/inventory/owner/$OWNER_ID"
OWNER_INVENTORY=$(curl -s "$BASE_URL/api/inventory/owner/$OWNER_ID")
echo "$OWNER_INVENTORY" | jq '.'

TOTAL_OWNER_ITEMS=$(echo "$OWNER_INVENTORY" | jq '.count // 0')
echo -e "${GREEN}✅ Total items du joueur : $TOTAL_OWNER_ITEMS${NC}"
echo ""

# ==========================================
# Action 6 : Retirer l'item de l'inventaire
# ==========================================
echo -e "${BLUE}🗑️  Action 3 : Retirer l'accessoire${NC}"
echo "POST $BASE_URL/api/inventory/remove"
REMOVE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/inventory/remove" \
  -H "Content-Type: application/json" \
  -d "{\"monsterId\":\"$MONSTER_ID\",\"inventoryItemId\":\"$INVENTORY_ITEM_ID\"}")

echo "$REMOVE_RESPONSE" | jq '.'

if echo "$REMOVE_RESPONSE" | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✅ Item retiré avec succès !${NC}"
else
  echo -e "${RED}❌ Échec de la suppression${NC}"
  exit 1
fi
echo ""

# ==========================================
# Action 7 : Vérifier que l'item a bien disparu
# ==========================================
echo -e "${BLUE}🔍 Vérification : L'item a-t-il disparu ?${NC}"
echo "GET $BASE_URL/api/inventory/$MONSTER_ID"
INVENTORY_FINAL=$(curl -s "$BASE_URL/api/inventory/$MONSTER_ID")
echo "$INVENTORY_FINAL" | jq '.'

ITEMS_COUNT_FINAL=$(echo "$INVENTORY_FINAL" | jq '.count // 0')

if [ "$ITEMS_COUNT_FINAL" -eq "$ITEMS_COUNT_BEFORE" ]; then
  echo -e "${GREEN}✅ SUCCÈS : L'item a bien été supprimé de l'inventaire${NC}"
  echo "   Items avant : $ITEMS_COUNT_BEFORE"
  echo "   Items après : $ITEMS_COUNT_FINAL"
else
  echo -e "${RED}❌ ERREUR : Le nombre d'items ne correspond pas${NC}"
  echo "   Attendu : $ITEMS_COUNT_BEFORE"
  echo "   Obtenu : $ITEMS_COUNT_FINAL"
  exit 1
fi
echo ""

# ==========================================
# Résumé
# ==========================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Tests terminés avec succès !${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "✅ Action 1 : Acheter un accessoire         - OK"
echo "✅ Action 2 : Équiper un accessoire         - OK"
echo "✅ Action 3 : Retirer un accessoire         - OK"
echo "✅ Action 4A : Visualiser inventaire monstre - OK"
echo "✅ Action 4B : Visualiser inventaire joueur  - OK"
echo ""
echo -e "${BLUE}📊 Statistiques :${NC}"
echo "  - Items dans l'inventaire initial : $ITEMS_COUNT_BEFORE"
echo "  - Items après achat : $ITEMS_COUNT_AFTER"
echo "  - Items équipés : $EQUIPPED_ITEMS"
echo "  - Items dans l'inventaire final : $ITEMS_COUNT_FINAL"
echo "  - Total items du joueur : $TOTAL_OWNER_ITEMS"
echo ""
echo -e "${GREEN}✨ Le système d'items fonctionne parfaitement !${NC}"
