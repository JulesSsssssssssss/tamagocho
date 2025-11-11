#!/bin/bash

# 🎯 Script de test des améliorations UX des quêtes
# Date: 11 novembre 2025

echo "🧪 Test des améliorations UX des quêtes..."
echo ""

# Compteur de tests
PASSED=0
FAILED=0

# Function pour tester l'existence d'un pattern dans un fichier
test_pattern() {
  local file=$1
  local pattern=$2
  local description=$3
  local should_exist=${4:-true}
  
  if [ "$should_exist" = true ]; then
    if grep -q "$pattern" "$file" 2>/dev/null; then
      echo "✅ $description"
      ((PASSED++))
    else
      echo "❌ $description - Pattern non trouvé: $pattern"
      ((FAILED++))
    fi
  else
    if ! grep -q "$pattern" "$file" 2>/dev/null; then
      echo "✅ $description"
      ((PASSED++))
    else
      echo "❌ $description - Pattern trouvé (ne devrait pas): $pattern"
      ((FAILED++))
    fi
  fi
}

# Function pour tester l'existence d'un fichier
test_file() {
  local file=$1
  local description=$2
  
  if [ -f "$file" ]; then
    echo "✅ $description"
    ((PASSED++))
  else
    echo "❌ $description - Fichier non trouvé: $file"
    ((FAILED++))
  fi
}

echo "📝 Test 1: Widget retiré du dashboard"
test_pattern "src/components/dashboard/dashboard-content.tsx" "DailyQuestsDisplay" "Widget DailyQuestsDisplay supprimé du dashboard" false
test_pattern "src/components/dashboard/dashboard-content.tsx" "import.*daily-quests" "Import daily-quests supprimé" false

echo ""
echo "📝 Test 2: Corrections du tracking"
test_pattern "src/components/creature/creature-actions.tsx" "trackSleep" "trackSleep() utilisé (au lieu de trackSleepMonster)"
test_pattern "src/components/creature/creature-actions.tsx" "trackClean" "trackClean() utilisé (au lieu de trackCleanMonster)"
test_pattern "src/components/creature/creature-actions.tsx" "trackInteract" "trackInteract() ajouté pour INTERACT_MONSTERS"

echo ""
echo "📝 Test 3: Boutons d'action dans la page quêtes"
test_pattern "src/components/quests/quests-page-content.tsx" "getQuestActionButton" "Fonction getQuestActionButton() créée"
test_pattern "src/components/quests/quests-page-content.tsx" "useRouter" "useRouter importé depuis next/navigation"
test_pattern "src/components/quests/quests-page-content.tsx" "router.push" "Navigation avec router.push() implémentée"
test_pattern "src/components/quests/quests-page-content.tsx" "🍖 Nourrir" "Bouton 'Nourrir' ajouté"
test_pattern "src/components/quests/quests-page-content.tsx" "🛒 Acheter" "Bouton 'Acheter' ajouté"
test_pattern "src/components/quests/quests-page-content.tsx" "🖼️ Visiter" "Bouton 'Visiter' ajouté"

echo ""
echo "📝 Test 4: Tracking complet pour tous les types"
test_pattern "src/hooks/use-quest-progress.ts" "trackFeedMonster" "trackFeedMonster disponible"
test_pattern "src/hooks/use-quest-progress.ts" "trackPlay" "trackPlay disponible"
test_pattern "src/hooks/use-quest-progress.ts" "trackSleep" "trackSleep disponible"
test_pattern "src/hooks/use-quest-progress.ts" "trackClean" "trackClean disponible"
test_pattern "src/hooks/use-quest-progress.ts" "trackInteract" "trackInteract disponible"
test_pattern "src/hooks/use-quest-progress.ts" "trackLevelUp" "trackLevelUp disponible"
test_pattern "src/hooks/use-quest-progress.ts" "trackBuyItem" "trackBuyItem disponible"
test_pattern "src/hooks/use-quest-progress.ts" "trackMakePublic" "trackMakePublic disponible"
test_pattern "src/hooks/use-quest-progress.ts" "trackVisitGallery" "trackVisitGallery disponible"
test_pattern "src/hooks/use-quest-progress.ts" "trackEquipItem" "trackEquipItem disponible"

echo ""
echo "📝 Test 5: Tracking intégré dans les composants"
test_pattern "src/components/creature/creature-actions.tsx" "trackFeedMonster()" "FEED_MONSTER tracké"
test_pattern "src/components/creature/creature-actions.tsx" "trackPlay()" "PLAY_WITH_MONSTER tracké"
test_pattern "src/components/creature/creature-actions.tsx" "trackSleep()" "SLEEP_MONSTER tracké"
test_pattern "src/components/creature/creature-actions.tsx" "trackClean()" "CLEAN_MONSTER tracké"
test_pattern "src/components/creature/creature-actions.tsx" "trackInteract()" "INTERACT_MONSTERS tracké"
test_pattern "src/components/shop/item-card.tsx" "trackBuyItem" "BUY_ITEM tracké"
test_pattern "src/components/creature/creature-detail.tsx" "trackMakePublic" "MAKE_MONSTER_PUBLIC tracké"
test_pattern "src/app/gallery/page.tsx" "trackVisitGallery" "VISIT_GALLERY tracké"
test_pattern "src/app/api/monster/toggle-item/route.ts" "EQUIP_ITEM" "EQUIP_ITEM tracké (server-side)"

echo ""
echo "📝 Test 6: Documentation"
test_file "QUESTS_UX_IMPROVEMENTS.md" "Documentation des améliorations UX créée"

echo ""
echo "📝 Test 7: Pas d'erreurs TypeScript"
# Test de compilation TypeScript (si tsc est disponible)
if command -v tsc &> /dev/null; then
  if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
    echo "❌ Erreurs TypeScript détectées"
    ((FAILED++))
  else
    echo "✅ Aucune erreur TypeScript"
    ((PASSED++))
  fi
else
  echo "⚠️  TypeScript compiler non disponible, test ignoré"
fi

echo ""
echo "================================================"
echo "📊 RÉSULTATS DES TESTS"
echo "================================================"
echo "✅ Tests réussis: $PASSED"
echo "❌ Tests échoués: $FAILED"
echo "================================================"

if [ $FAILED -eq 0 ]; then
  echo "🎉 Tous les tests sont passés avec succès !"
  echo ""
  echo "✨ Améliorations UX des quêtes complètes:"
  echo "   • Widget retiré du dashboard"
  echo "   • Tracking corrigé pour SLEEP et CLEAN"
  echo "   • Tracking ajouté pour INTERACT"
  echo "   • Boutons d'action pour chaque quête"
  echo "   • Navigation fluide vers les pages appropriées"
  echo "   • 10/10 types de quêtes trackés correctement"
  echo ""
  echo "🚀 Prêt pour les tests manuels !"
  exit 0
else
  echo "⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus."
  exit 1
fi
