#!/bin/bash

# Script de remplacement automatique des console.log/error par logger
# Applique tous les remaining console.log trouvés dans le projet

echo "🔧 Application des corrections TypeScript..."

# Fix creature-detail.tsx - Wrapper async handlers
echo "Correction de creature-detail.tsx..."
sed -i '' 's/onItemChange={refreshMonster}/onItemChange={() => { void refreshMonster() }}/g' src/components/creature/creature-detail.tsx
sed -i '' 's/onBackgroundChange={refreshMonsterAndBackground}/onBackgroundChange={() => { void refreshMonsterAndBackground() }}/g' src/components/creature/creature-detail.tsx

# Fix console.error dans creature-detail.tsx
sed -i '' "s/console.error('Erreur lors de la récupération du monstre :', response.status)/logger.error('Failed to fetch monster', { status: response.status })/g" src/components/creature/creature-detail.tsx
sed -i '' "s/console.error('Erreur lors du changement de visibilité')/logger.error('Failed to toggle visibility')/g" src/components/creature/creature-detail.tsx
sed -i '' "s/console.error('Erreur:', error)/logger.error('Error in creature detail', { error: error instanceof Error ? error.message : 'Unknown' })/g" src/components/creature/creature-detail.tsx

# Fix console.error dans hooks
sed -i '' "s/console.error('Erreur lors de la déconnexion:', error)/logger.error('Logout failed', { error: error instanceof Error ? error.message : 'Unknown' })/g" src/hooks/use-logout.ts
sed -i '' "s/console.error('Error triggering tamagotchi tick:', error)/logger.error('Auto-refresh tick failed', { error: error instanceof Error ? error.message : 'Unknown' })/g" src/hooks/use-auto-refresh.ts
sed -i '' "s/console.error('Failed to create monster', error)/logger.error('Monster creation failed', { error: error instanceof Error ? error.message : 'Unknown' })/g" src/hooks/use-monster-creation.ts

# Fix console.log dans newsletter-section.tsx (debug uniquement)
sed -i '' "s/console.log('Newsletter subscription:', formData.email)/logger.debug('Newsletter subscription', { email: formData.email })/g" src/components/newsletter-section.tsx

# Fix console dans auto-updater
sed -i '' 's/console.log(`✅ \[AUTO-UPDATER\] Mise à jour #${updateCount + 1} réussie: ${result.updated ?? 0} monstre(s)`)/logger.info("Auto-updater succeeded", { updateCount: updateCount + 1, updated: result.updated })/g' src/components/monsters/auto-updater.tsx
sed -i '' 's/console.error(`❌ \[AUTO-UPDATER\] Mise à jour #${updateCount + 1} échouée:`, result.error ?? "Unknown error")/logger.error("Auto-updater failed", { updateCount: updateCount + 1, error: result.error })/g' src/components/monsters/auto-updater.tsx

# Fix console dans db/index.ts
sed -i '' "s/console.log('✅ Mongoose already connected')/logger.info('Mongoose already connected')/g" src/db/index.ts
sed -i '' "s/console.log('✅ Mongoose connected to MongoDB database')/logger.info('Mongoose connected to MongoDB')/g" src/db/index.ts
sed -i '' "s/console.error('❌ Error connecting Mongoose to the database:', error)/logger.error('Mongoose connection failed', { error: error instanceof Error ? error.message : 'Unknown' })/g" src/db/index.ts
sed -i '' "s/console.log('✅ Already connected to MongoDB')/logger.info('Already connected to MongoDB')/g" src/db/index.ts
sed -i '' "s/console.log('✅ Connected to MongoDB database:', dbName)/logger.info('Connected to MongoDB', { database: dbName })/g" src/db/index.ts
sed -i '' "s/console.error('❌ Error connecting to the database:', error)/logger.error('MongoDB connection failed', { error: error instanceof Error ? error.message : 'Unknown' })/g" src/db/index.ts
sed -i '' "s/.catch(console.error)/.catch((err) => logger.error('DB connection error', { error: err instanceof Error ? err.message : 'Unknown' }))/g" src/db/index.ts

echo "✅ Console.log replacements completed"
echo "⚠️  Note: Vérifiez manuellement les fichiers modifiés avant de commit"
