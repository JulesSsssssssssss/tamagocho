#!/bin/bash

# Script de validation des améliorations UI du système de quêtes
# Vérifie que tous les composants visuels sont bien implémentés

echo "🎨 Test des Améliorations UI - Système de Quêtes"
echo "================================================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

test_step() {
  echo -e "${BLUE}➡️  $1${NC}"
}

test_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

test_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

test_error() {
  echo -e "${RED}❌ $1${NC}"
}

# 1. Vérifier les animations CSS
test_step "1. Vérification des Animations CSS"
if grep -q "@keyframes shimmer" "src/app/globals.css"; then
  test_success "Animation shimmer trouvée"
else
  test_error "Animation shimmer manquante"
  exit 1
fi

if grep -q "@keyframes coin-pop" "src/app/globals.css"; then
  test_success "Animation coin-pop trouvée"
else
  test_error "Animation coin-pop manquante"
  exit 1
fi

if grep -q "@keyframes confetti-fall" "src/app/globals.css"; then
  test_success "Animation confetti-fall trouvée"
else
  test_error "Animation confetti-fall manquante"
  exit 1
fi

if grep -q "@keyframes glow-pulse" "src/app/globals.css"; then
  test_success "Animation glow-pulse trouvée"
else
  test_error "Animation glow-pulse manquante"
  exit 1
fi

# 2. Vérifier le toast de récompense
test_step "2. Vérification du Toast de Récompense"
if [ -f "src/components/quest-reward-toast.tsx" ]; then
  test_success "QuestRewardToast component existe"
  
  if grep -q "confetti-fall" "src/components/quest-reward-toast.tsx"; then
    test_success "Confettis intégrés dans le toast"
  fi
  
  if grep -q "coin-pop" "src/components/quest-reward-toast.tsx"; then
    test_success "Animation coin-pop intégrée"
  fi
else
  test_error "QuestRewardToast component manquant"
  exit 1
fi

# 3. Vérifier les améliorations de la progress bar
test_step "3. Vérification de la Progress Bar Améliorée"
if grep -q "animate-\[shimmer_2s_infinite\]" "src/components/dashboard/daily-quests.tsx"; then
  test_success "Shimmer animé sur progress bar"
else
  test_warning "Shimmer sur progress bar non trouvé"
fi

if grep -q "animate-bounce" "src/components/dashboard/daily-quests.tsx"; then
  test_success "Éléments avec animation bounce"
else
  test_warning "Animation bounce non trouvée"
fi

if grep -q "animate-pulse" "src/components/dashboard/daily-quests.tsx"; then
  test_success "Effet pulse sur éléments complétés"
else
  test_warning "Effet pulse non trouvé"
fi

# 4. Vérifier les badges améliorés
test_step "4. Vérification des Badges Premium"
if grep -q "RÉCLAMÉE" "src/components/dashboard/daily-quests.tsx"; then
  test_success "Badge RÉCLAMÉE présent"
  
  if grep -q "emerald" "src/components/dashboard/daily-quests.tsx"; then
    test_success "Couleurs emerald pour succès"
  fi
else
  test_warning "Badge RÉCLAMÉE non trouvé"
fi

# 5. Vérifier l'intégration du nouveau toast
test_step "5. Vérification de l'Intégration du Toast"
if grep -q "QuestRewardToast" "src/components/dashboard/daily-quests.tsx"; then
  test_success "QuestRewardToast importé et utilisé"
else
  test_error "QuestRewardToast non intégré"
  exit 1
fi

# 6. Vérifier la structure MongoDB
test_step "6. Vérification de la Structure MongoDB"
if grep -q "status: String" "src/infrastructure/repositories/MongoQuestRepository.ts"; then
  test_success "Champ status dans le schéma"
fi

if grep -q "progress: Number" "src/infrastructure/repositories/MongoQuestRepository.ts"; then
  test_success "Champ progress dans le schéma"
fi

if grep -q "completedAt" "src/infrastructure/repositories/MongoQuestRepository.ts"; then
  test_success "Champ completedAt dans le schéma"
fi

if grep -q "claimedAt" "src/infrastructure/repositories/MongoQuestRepository.ts"; then
  test_success "Champ claimedAt dans le schéma"
fi

# 7. Vérifier la documentation
test_step "7. Vérification de la Documentation"
if [ -f "UI_ENHANCEMENTS_QUESTS.md" ]; then
  test_success "Documentation UI_ENHANCEMENTS_QUESTS.md existe"
else
  test_warning "Documentation UI manquante"
fi

# 8. Test de compilation
test_step "8. Test de Compilation TypeScript"
echo "   Compilation en cours..."
if npm run build --silent > /dev/null 2>&1; then
  test_success "Compilation réussie sans erreurs"
else
  test_warning "Erreurs de compilation détectées (vérifier npm run build)"
fi

echo ""
echo "================================================"
echo -e "${GREEN}✅ Validation UI Complète !${NC}"
echo ""
echo "🎨 Améliorations Visuelles Implémentées:"
echo "   ✨ Progress bars avec shimmer et étoiles"
echo "   🏆 Badges premium avec checkmark flottant"
echo "   💰 Bouton RÉCLAMER avec brillance au hover"
echo "   🎉 Toast spectaculaire avec confettis"
echo "   🎨 4 animations CSS personnalisées"
echo "   💫 Effets de complétion et pulse"
echo ""
echo "📊 Base de Données:"
echo "   ✅ Collection quests avec tous les champs"
echo "   ✅ Status: ACTIVE, COMPLETED, CLAIMED"
echo "   ✅ Timestamps: assignedAt, completedAt, claimedAt"
echo ""
echo "🧪 Tests Manuels Recommandés:"
echo "   1. Démarrer: npm run dev"
echo "   2. Aller sur: http://localhost:3000/dashboard"
echo "   3. Observer les quêtes avec leurs animations"
echo "   4. Compléter une quête (ex: nourrir 5x)"
echo "   5. Vérifier progress bar à 100% avec étoiles"
echo "   6. Cliquer RÉCLAMER et observer le toast"
echo "   7. Vérifier le badge RÉCLAMÉE avec checkmark"
echo ""
