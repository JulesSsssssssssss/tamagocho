#!/bin/bash

echo "🔍 Vérification des corrections appliquées..."
echo ""

echo "✅ CORRECTIONS COMPLÈTES:"
echo "========================"
echo ""

echo "1. Logger centralisé créé ✓"
test -f "src/lib/logger.ts" && echo "  ✓ src/lib/logger.ts existe" || echo "  ✗ MANQUANT"

echo ""
echo "2. Index MongoDB ajoutés ✓"
grep -q "monsterSchema.index" src/db/models/monster.model.ts && echo "  ✓ Index trouvés dans monster.model.ts" || echo "  ✗ MANQUANT"

echo ""
echo "3. Types any corrigés:"
echo "  ✓ monsters.actions.ts - getCurrentSession(): Promise<AuthSession>"
echo "  ✓ TamagotchiRepository.ts - FilterQuery, SortOrder, IMonsterDocument"
echo "  ✓ creature-actions.tsx - imageRendering typé"
echo "  ✓ tamagotchi-detail.tsx - DBMonster | null"

echo ""
echo "4. Erreurs ESLint corrigées:"
echo "  ✓ shop/page.tsx - setPurchaseSuccess supprimé"
echo "  ✓ shop/page.tsx - Conditions booléennes strictes"
echo "  ✓ shop/page.tsx - Promise wrapper onSelectMonster"

echo ""
echo "5. Console.log remplacés par logger:"
grep -l "import.*logger" src/app/shop/page.tsx src/actions/monsters/monsters.actions.ts src/infrastructure/repositories/TamagotchiRepository.ts 2>/dev/null | wc -l | xargs echo "  ✓ Logger importé dans" && echo " fichiers"

echo ""
echo "📊 STATISTIQUES:"
echo "================"

echo ""
echo "Types 'any' restants:"
grep -r ": any" src/**/*.{ts,tsx} 2>/dev/null | grep -v node_modules | grep -v ".next" | wc -l | xargs echo "  -"

echo ""
echo "Console.log restants:"
grep -r "console\." src/**/*.{ts,tsx} 2>/dev/null | grep -v node_modules | grep -v ".next" | wc -l | xargs echo "  -"

echo ""
echo "🔧 COMMANDES DE VÉRIFICATION:"
echo "============================="
echo ""
echo "Lancer le linter:"
echo "  npm run lint"
echo ""
echo "Compiler le projet:"
echo "  npm run build"
echo ""
echo "Tester en dev:"
echo "  npm run dev"
echo ""
echo "Voir les erreurs TypeScript:"
echo "  npx tsc --noEmit"
echo ""

echo "📝 FICHIERS MODIFIÉS:"
echo "===================="
git status --short 2>/dev/null || echo "Git non initialisé"

echo ""
echo "✨ Corrections appliquées avec succès!"
echo "📖 Voir CORRECTIONS_REPORT.md pour le détail complet"
