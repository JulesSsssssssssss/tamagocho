#!/bin/bash

# Script de test pour le système de récompense en coins
# Usage: ./test-coins-reward.sh

echo "🧪 Test du Système de Récompense en Coins"
echo "=========================================="
echo ""

# Couleurs pour le terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Checklist de validation${NC}"
echo ""

# 1. Vérifier que les fichiers existent
echo "1. Vérification des fichiers..."
FILES=(
    "src/shared/types/coins.ts"
    "src/actions/monsters/monsters.actions.ts"
    "src/components/creature/creature-actions.tsx"
    "src/components/coins-toast.tsx"
    "docs/COINS_REWARD_SYSTEM.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✓${NC} $file existe"
    else
        echo -e "   ❌ $file manquant"
        exit 1
    fi
done

echo ""

# 2. Vérifier la constante COINS_PER_ACTION
echo "2. Vérification de la constante COINS_PER_ACTION..."
if grep -q "export const COINS_PER_ACTION = 10" src/shared/types/coins.ts; then
    echo -e "   ${GREEN}✓${NC} COINS_PER_ACTION = 10 défini"
else
    echo -e "   ❌ COINS_PER_ACTION non trouvé"
    exit 1
fi

echo ""

# 3. Vérifier l'interface MonsterActionResult
echo "3. Vérification de l'interface MonsterActionResult..."
if grep -q "export interface MonsterActionResult" src/actions/monsters/monsters.actions.ts; then
    echo -e "   ${GREEN}✓${NC} Interface MonsterActionResult définie"
else
    echo -e "   ❌ Interface MonsterActionResult non trouvée"
    exit 1
fi

echo ""

# 4. Vérifier les imports dans monsters.actions.ts
echo "4. Vérification des imports dans monsters.actions.ts..."
if grep -q "import { COINS_PER_ACTION }" src/actions/monsters/monsters.actions.ts; then
    echo -e "   ${GREEN}✓${NC} Import COINS_PER_ACTION présent"
else
    echo -e "   ❌ Import COINS_PER_ACTION manquant"
    exit 1
fi

if grep -q "import { addCoins }" src/actions/monsters/monsters.actions.ts; then
    echo -e "   ${GREEN}✓${NC} Import addCoins présent"
else
    echo -e "   ❌ Import addCoins manquant"
    exit 1
fi

echo ""

# 5. Vérifier que les actions retournent MonsterActionResult
echo "5. Vérification des signatures des actions..."
ACTIONS=("feedMonster" "playWithMonster" "sleepMonster" "cleanMonster")

for action in "${ACTIONS[@]}"; do
    if grep -q "export async function ${action} (monsterId: string): Promise<MonsterActionResult>" src/actions/monsters/monsters.actions.ts; then
        echo -e "   ${GREEN}✓${NC} ${action} retourne MonsterActionResult"
    else
        echo -e "   ❌ ${action} ne retourne pas MonsterActionResult"
        exit 1
    fi
done

echo ""

# 6. Vérifier les appels à addCoins
echo "6. Vérification des appels à addCoins dans les actions..."
if grep -q "await addCoins(COINS_PER_ACTION, 'REWARD'" src/actions/monsters/monsters.actions.ts; then
    echo -e "   ${GREEN}✓${NC} Appels à addCoins présents"
else
    echo -e "   ❌ Appels à addCoins manquants"
    exit 1
fi

echo ""

# 7. Vérifier le composant CoinsToast
echo "7. Vérification du composant CoinsToast..."
if grep -q "export function CoinsToast" src/components/coins-toast.tsx; then
    echo -e "   ${GREEN}✓${NC} Composant CoinsToast exporté"
else
    echo -e "   ❌ Composant CoinsToast non trouvé"
    exit 1
fi

if grep -q "import PixelCoin" src/components/coins-toast.tsx; then
    echo -e "   ${GREEN}✓${NC} Import PixelCoin présent"
else
    echo -e "   ❌ Import PixelCoin manquant"
    exit 1
fi

echo ""

# 8. Vérifier l'intégration dans CreatureActions
echo "8. Vérification de l'intégration dans CreatureActions..."
if grep -q "import { toast } from 'react-toastify'" src/components/creature/creature-actions.tsx; then
    echo -e "   ${GREEN}✓${NC} Import toast présent"
else
    echo -e "   ❌ Import toast manquant"
    exit 1
fi

if grep -q "import CoinsToast" src/components/creature/creature-actions.tsx; then
    echo -e "   ${GREEN}✓${NC} Import CoinsToast présent"
else
    echo -e "   ❌ Import CoinsToast manquant"
    exit 1
fi

echo ""

# 9. TypeScript check
echo "9. Vérification TypeScript..."
if npx tsc --noEmit > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓${NC} Pas d'erreurs TypeScript"
else
    echo -e "   ❌ Erreurs TypeScript détectées"
    npx tsc --noEmit
    exit 1
fi

echo ""

# 10. Linting check
echo "10. Vérification Linting..."
if npm run lint > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓${NC} Pas d'erreurs de linting"
else
    echo -e "   ❌ Erreurs de linting détectées"
    npm run lint
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Tous les tests sont passés avec succès !${NC}"
echo ""
echo "📝 Prochaines étapes :"
echo "   1. Lancer le serveur de dev : npm run dev"
echo "   2. Se connecter à l'application"
echo "   3. Naviguer vers un monstre"
echo "   4. Tester chaque action (feed, play, sleep, clean)"
echo "   5. Vérifier les toasts et le wallet"
echo ""
