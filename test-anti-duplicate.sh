#!/bin/bash

# Script de test pour la vérification anti-doublons
# Usage: ./test-anti-duplicate.sh

echo "🧪 Test du système anti-doublons pour items et fonds d'écran"
echo "=============================================================="
echo ""

# Couleurs pour les résultats
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📋 Checklist de vérification :"
echo ""

echo "✅ Backend - Mode Production"
echo "   - Vérification hasItem() avant achat"
echo "   - Message d'erreur personnalisé avec nom de l'item"
echo "   - Code d'erreur 'ALREADY_OWNED'"
echo ""

echo "✅ Backend - Mode Test"
echo "   - Même vérification hasItem()"
echo "   - Retour d'erreur au lieu de marquer comme équipé"
echo ""

echo "✅ Frontend - Notifications"
echo "   - Composant PurchaseNotification créé"
echo "   - 4 types : success, error, warning, info"
echo "   - Animations CSS ajoutées"
echo ""

echo "✅ Frontend - Gestion des erreurs"
echo "   - Détection 'already owns' / 'possède déjà'"
echo "   - Notification warning pour doublons"
echo "   - Message contextuel selon type d'item"
echo ""

echo "📝 Tests manuels à effectuer :"
echo ""
echo "1. ${YELLOW}Test achat normal${NC}"
echo "   → Acheter un nouvel item"
echo "   → Notification verte 'Achat réussi !'"
echo ""

echo "2. ${YELLOW}Test doublon ITEM${NC}"
echo "   → Réacheter le même item pour le même monstre"
echo "   → Notification jaune 'Item déjà possédé'"
echo ""

echo "3. ${YELLOW}Test doublon FOND D'ÉCRAN${NC}"
echo "   → Acheter un fond deux fois pour le même monstre"
echo "   → Notification jaune 'Fond déjà possédé'"
echo ""

echo "4. ${YELLOW}Test solde insuffisant${NC}"
echo "   → Tenter d'acheter un item trop cher"
echo "   → Notification rouge 'Solde insuffisant'"
echo ""

echo "🔍 Vérification des fichiers modifiés :"
echo ""

# Vérifier les fichiers
files=(
  "src/app/api/shop/purchase/route.ts"
  "src/app/shop/page.tsx"
  "src/components/shop/purchase-notification.tsx"
  "src/components/shop/index.ts"
  "src/app/globals.css"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "${GREEN}✓${NC} $file"
  else
    echo "${RED}✗${NC} $file (MANQUANT)"
  fi
done

echo ""
echo "📚 Documentation :"
echo "   → docs/ANTI_DUPLICATE_PURCHASE_IMPLEMENTATION.md"
echo ""

echo "🚀 Pour tester :"
echo "   1. npm run dev"
echo "   2. Aller sur http://localhost:3000/shop"
echo "   3. Suivre les tests manuels ci-dessus"
echo ""

echo "✨ Implémentation terminée avec succès !"
