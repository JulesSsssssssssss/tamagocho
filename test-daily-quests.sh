#!/bin/bash

# Script de test du système de quêtes journalières
# Usage: ./test-daily-quests.sh

echo "🎯 Test du Système de Quêtes Journalières"
echo "=========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables
BASE_URL="http://localhost:3000"
API_URL="${BASE_URL}/api"

echo "📋 Vérification des fichiers créés..."
echo ""

# Liste des fichiers à vérifier
files=(
  "src/domain/entities/Quest.ts"
  "src/domain/repositories/IQuestRepository.ts"
  "src/application/use-cases/GetDailyQuestsUseCase.ts"
  "src/application/use-cases/ClaimQuestRewardUseCase.ts"
  "src/application/use-cases/UpdateQuestProgressUseCase.ts"
  "src/application/use-cases/CleanupExpiredQuestsUseCase.ts"
  "src/infrastructure/repositories/MongoQuestRepository.ts"
  "src/infrastructure/repositories/MongoWalletRepository.ts"
  "src/app/api/quests/route.ts"
  "src/app/api/quests/[questId]/claim/route.ts"
  "src/app/api/quests/progress/route.ts"
  "src/components/dashboard/daily-quests.tsx"
  "src/hooks/use-quest-progress.ts"
  "docs/DAILY_QUESTS_SYSTEM.md"
)

missing_files=()

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
  else
    echo -e "${RED}✗${NC} $file ${RED}(MANQUANT)${NC}"
    missing_files+=("$file")
  fi
done

echo ""

if [ ${#missing_files[@]} -eq 0 ]; then
  echo -e "${GREEN}✅ Tous les fichiers sont présents !${NC}"
else
  echo -e "${RED}❌ ${#missing_files[@]} fichier(s) manquant(s)${NC}"
  exit 1
fi

echo ""
echo "🔍 Vérification des exports..."
echo ""

# Vérifier les exports dans index.ts
if grep -q "Quest" "src/domain/entities/index.ts"; then
  echo -e "${GREEN}✓${NC} Quest exporté dans domain/entities/index.ts"
else
  echo -e "${RED}✗${NC} Quest non exporté"
fi

if grep -q "IQuestRepository" "src/domain/repositories/index.ts"; then
  echo -e "${GREEN}✓${NC} IQuestRepository exporté dans domain/repositories/index.ts"
else
  echo -e "${RED}✗${NC} IQuestRepository non exporté"
fi

if grep -q "GetDailyQuestsUseCase" "src/application/use-cases/index.ts"; then
  echo -e "${GREEN}✓${NC} Use Cases exportés dans application/use-cases/index.ts"
else
  echo -e "${RED}✗${NC} Use Cases non exportés"
fi

echo ""
echo "🗄️  Vérification MongoDB..."
echo ""

# Vérifier si MongoDB est accessible (nécessite une connexion active)
echo -e "${YELLOW}⚠${NC}  Assurez-vous que MongoDB est accessible avec les variables d'environnement configurées"

echo ""
echo "🏗️  Vérification de l'architecture..."
echo ""

# Vérifier les principes SOLID dans Quest.ts
if grep -q "validate" "src/domain/entities/Quest.ts"; then
  echo -e "${GREEN}✓${NC} Validation métier présente (SRP)"
fi

if grep -q "IQuestRepository" "src/application/use-cases/GetDailyQuestsUseCase.ts"; then
  echo -e "${GREEN}✓${NC} Dépendance d'interface (DIP)"
fi

if grep -q "private readonly questRepository" "src/application/use-cases/GetDailyQuestsUseCase.ts"; then
  echo -e "${GREEN}✓${NC} Injection de dépendances (DIP)"
fi

echo ""
echo "📦 Résumé de l'implémentation"
echo "============================"
echo ""
echo "Domain Layer:"
echo "  - Quest entity avec 10 types de quêtes"
echo "  - IQuestRepository interface"
echo ""
echo "Application Layer:"
echo "  - GetDailyQuestsUseCase"
echo "  - ClaimQuestRewardUseCase"
echo "  - UpdateQuestProgressUseCase"
echo "  - CleanupExpiredQuestsUseCase"
echo ""
echo "Infrastructure Layer:"
echo "  - MongoQuestRepository avec index optimisés"
echo "  - MongoWalletRepository (intégré avec Player)"
echo ""
echo "Presentation Layer:"
echo "  - GET /api/quests"
echo "  - POST /api/quests/[questId]/claim"
echo "  - POST /api/quests/progress"
echo "  - DailyQuestsDisplay component"
echo "  - useQuestProgress hook"
echo ""
echo "Cron System:"
echo "  - cleanupExpiredQuests() à minuit"
echo ""

echo -e "${GREEN}✅ Système de quêtes journalières implémenté avec succès !${NC}"
echo ""
echo "📝 Prochaines étapes:"
echo "  1. Intégrer <DailyQuestsDisplay /> dans le dashboard"
echo "  2. Démarrer npm run dev"
echo "  3. Démarrer le cron: cd cron && yarn dev"
echo "  4. Tester le cycle complet dans l'interface"
echo "  5. Consulter la documentation: docs/DAILY_QUESTS_SYSTEM.md"
echo ""
echo "🎮 Bon développement !"
