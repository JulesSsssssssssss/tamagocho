# 🚀 Plan d'Optimisation - Tamagotcho Project

**Date de création**: 11 novembre 2025  
**Version**: 1.0.0  
**Statut**: 📋 En cours d'implémentation

---

## 📊 Vue d'ensemble

Ce document liste toutes les optimisations à appliquer sur la base de code pour améliorer les performances, réduire les re-renders inutiles, et optimiser le chargement des ressources.

### Métriques actuelles
| Métrique | Dashboard | Creature | Shop | Sign-In | Home |
|----------|-----------|----------|------|---------|------|
| React.memo | ✅ 10/10 | ✅ 8/8 | ❌ 0/12 | ❌ 0/8 | ❌ 0/6 |
| useMemo | ✅ 1/1 | ✅ 1/1 | ❌ 0/5 | ⏳ N/A | ⏳ N/A |
| useCallback | ✅ 3/3 | ✅ 1/1 | ❌ 0/8 | ⏳ N/A | ⏳ N/A |
| Lazy Loading | ❌ 0 | ❌ 0 | ❌ 0 | ❌ 0 | ❌ 0 |
| Code Splitting | ❌ 0 | ❌ 0 | ❌ 0 | ❌ 0 | ❌ 0 |

### Objectifs
- 🎯 **100%** des composants clients avec `React.memo`
- 🎯 **100%** des calculs coûteux avec `useMemo`
- 🎯 **100%** des callbacks avec `useCallback`
- 🎯 **Lazy loading** pour les composants lourds
- 🎯 **Code splitting** pour les routes

---

## 1️⃣ Composants à optimiser avec `React.memo`

### 🔴 Priorité HAUTE - Shop Page (0/12 composants)

#### 1.1. `src/components/shop/item-card.tsx`
**Statut**: ❌ Non mémoïsé  
**Impact**: Élevé (re-render à chaque changement de filtre)  
**Complexité**: Basse

**Problème actuel**:
```tsx
// ❌ AVANT
export function ItemCard ({ item, userBalance, onPurchase, disabled }: ItemCardProps) {
  // Re-render même si item n'a pas changé
}
```

**Solution**:
```tsx
// ✅ APRÈS
export const ItemCard = memo(function ItemCard ({ 
  item, 
  userBalance, 
  onPurchase, 
  disabled 
}: ItemCardProps): React.ReactNode {
  // Re-render uniquement si props changent
}, (prevProps, nextProps) => {
  // Comparateur personnalisé
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.userBalance === nextProps.userBalance &&
    prevProps.disabled === nextProps.disabled
  )
})
```

**Dépendances**: Aucune

---

#### 1.2. `src/components/shop/background-card.tsx`
**Statut**: ❌ Non mémoïsé  
**Impact**: Élevé  
**Complexité**: Basse

**Action**: Appliquer `React.memo` avec comparateur sur `item.id`

---

#### 1.3. `src/components/shop/monster-selection-modal.tsx`
**Statut**: ❌ Non mémoïsé  
**Impact**: Moyen  
**Complexité**: Moyenne

**Optimisations requises**:
1. ✅ Mémoïser le composant principal
2. ✅ Extraire `MonsterCard` en sous-composant mémoïsé
3. ✅ Mémoïser la fonction `parseTraits` avec `useMemo`

**Solution**:
```tsx
// ✅ Extraire en sous-composant
const MonsterCardItem = memo(function MonsterCardItem ({ 
  monster, 
  isSelected, 
  onSelect 
}: MonsterCardItemProps) {
  const traits = useMemo(() => parseTraits(monster.traits), [monster.traits])
  
  return (
    <button onClick={() => onSelect(monster._id)}>
      <PixelMonster traits={traits} level={monster.level} size={64} />
    </button>
  )
})

// ✅ Modal principal mémoïsé
export const MonsterSelectionModal = memo(function MonsterSelectionModal (props) {
  // ...
})
```

---

#### 1.4. `src/components/shop/pixel-item.tsx`
**Statut**: ❌ Non mémoïsé  
**Impact**: Élevé (beaucoup d'instances)  
**Complexité**: Basse

**Action**: Appliquer `React.memo` - composant purement présentationnel

---

#### 1.5. `src/components/shop/pixel-background.tsx`
**Statut**: ❌ Non mémoïsé  
**Impact**: Moyen  
**Complexité**: Basse

**Action**: Appliquer `React.memo`

---

#### 1.6. `src/components/shop/purchase-notification.tsx`
**Statut**: ❌ Non mémoïsé  
**Impact**: Faible (peu fréquent)  
**Complexité**: Basse

**Action**: Appliquer `React.memo`

---

### 🟡 Priorité MOYENNE - Home Page (0/6 composants)

#### 1.7. `src/components/header.tsx`
**Statut**: ❌ Non mémoïsé  
**Impact**: Moyen (présent sur toutes les pages)  
**Complexité**: Basse

**Action**: Appliquer `React.memo` - pas de props dynamiques

---

#### 1.8. `src/components/footer.tsx`
**Statut**: ❌ Non mémoïsé  
**Impact**: Moyen  
**Complexité**: Basse

**Action**: Appliquer `React.memo` - pas de props dynamiques

---

#### 1.9. `src/components/hero-section.tsx`
**Statut**: ❌ Non mémoïsé  
**Impact**: Faible (statique)  
**Complexité**: Basse

**Action**: Appliquer `React.memo`

---

#### 1.10. `src/components/benefits-section.tsx`
**Statut**: ❌ Non mémoïsé  
**Impact**: Faible  
**Complexité**: Basse

**Action**: Appliquer `React.memo`

---

#### 1.11. `src/components/monsters-section.tsx`
**Statut**: ❌ Non mémoïsé  
**Impact**: Faible  
**Complexité**: Basse

**Action**: Appliquer `React.memo`

---

#### 1.12. `src/components/newsletter-section.tsx`
**Statut**: ❌ Non mémoïsé  
**Impact**: Faible  
**Complexité**: Basse

**Action**: Appliquer `React.memo`

---

### 🟢 Priorité BASSE - Sign-In Page (0/3 composants)

#### 1.13. `src/components/forms/auth-form-content.tsx`
**Statut**: ❌ Non mémoïsé  
**Impact**: Faible (pas de props, état local uniquement)  
**Complexité**: Basse

**Action**: Appliquer `React.memo` - composant client sans props

**Note**: Le composant utilise uniquement de l'état local (`isSignIn`, `error`), donc mémorisation simple sans comparateur

---

## 2️⃣ Fonctions à mémoriser avec `useCallback`

### 🔴 Priorité HAUTE - Shop Page

#### 2.1. `src/app/shop/page.tsx` - Handlers d'événements
**Statut**: ❌ Non mémoïsés (8 fonctions)  
**Impact**: Élevé (cause des re-renders en cascade)

**Fonctions à mémoriser**:

```tsx
// ❌ AVANT
const showNotif = (type, title, message) => { ... }
const closeNotification = () => { ... }
const handleOpenPurchaseModal = (item) => { ... }
const handlePurchaseWithMonster = async (monsterId) => { ... }
const handleCloseModal = () => { ... }
const handleCategoryChange = (category) => { ... }
const handleRarityChange = (rarity) => { ... }
const filteredItems = items.filter(...) // ⚠️ Recalcul à chaque render
```

**Solution**:
```tsx
// ✅ APRÈS
const showNotif = useCallback((type: NotificationType, title: string, message: string): void => {
  setNotification({ type, title, message })
  setShowNotification(true)
}, []) // Pas de dépendances

const closeNotification = useCallback((): void => {
  setShowNotification(false)
  setTimeout(() => setNotification(null), 300)
}, [])

const handleOpenPurchaseModal = useCallback((item: ShopItemDTO): void => {
  if (userBalance < item.price) {
    showNotif('error', 'Solde insuffisant', `...`)
    return
  }
  setSelectedItem(item)
  setIsModalOpen(true)
}, [userBalance, showNotif]) // Dépendances: userBalance, showNotif

const handlePurchaseWithMonster = useCallback(async (monsterId: string): Promise<void> => {
  if (!selectedItem) return
  setIsPurchasing(true)
  try {
    const response = await fetch('/api/shop/purchase', { ... })
    // ...
  } finally {
    setIsPurchasing(false)
  }
}, [selectedItem]) // Dépendance: selectedItem

const handleCloseModal = useCallback((): void => {
  setIsModalOpen(false)
  setSelectedItem(null)
}, [])

const handleCategoryChange = useCallback((category: ItemCategory | undefined): void => {
  setSelectedCategory(category)
}, [])

const handleRarityChange = useCallback((rarity: ItemRarity | undefined): void => {
  setSelectedRarity(rarity)
}, [])
```

**Gains attendus**: 
- ✅ Évite les re-renders de `ItemCard` (12+ instances)
- ✅ Évite les re-renders de `MonsterSelectionModal`
- ✅ Stabilise les callbacks passés en props

---

#### 2.2. `src/components/shop/monster-selection-modal.tsx`
**Statut**: ❌ Non mémoïsés (2 fonctions)

**Fonctions à mémoriser**:
```tsx
// ✅ APRÈS
const handleConfirm = useCallback((): void => {
  if (selectedMonsterId) {
    onSelectMonster(selectedMonsterId)
  }
}, [selectedMonsterId, onSelectMonster])

const handleSelectMonster = useCallback((id: string): void => {
  setSelectedMonsterId(id)
}, [])
```

---

### 🟡 Priorité MOYENNE - Autres composants

#### 2.3. `src/components/forms/create-monster-form.tsx`
**Statut**: ❌ Non optimisé (3 handlers non mémoïsés)  
**Impact**: Moyen  
**Complexité**: Moyenne

**Fonctions à mémoriser**:
```tsx
// ✅ APRÈS
const handleGenerateMonster = useCallback((): void => {
  const nextTraits = generateRandomTraits()
  setTraits(nextTraits)
  setPreviewState(DEFAULT_MONSTER_STATE)
  setErrors(prev => ({ ...prev, design: undefined }))
}, [])

const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>): void => {
  event.preventDefault()
  const { errors: validationErrors, values } = validateCreateMonsterForm(draft, traits)
  if (!values) {
    setErrors(validationErrors)
    return
  }
  onSubmit({ ...values, state: previewState })
  // Reset...
}, [draft, traits, previewState, onSubmit])

const handleCancel = useCallback((): void => {
  setDraft(createInitialFormDraft())
  setTraits(null)
  setPreviewState(DEFAULT_MONSTER_STATE)
  setErrors({})
  onCancel()
}, [onCancel])
```

---

## 3️⃣ Données à mettre en cache avec `useMemo`

### 🔴 Priorité HAUTE - Shop Page

#### 3.1. Filtrage des items
**Fichier**: `src/app/shop/page.tsx`  
**Statut**: ❌ Recalculé à chaque render  
**Impact**: Élevé (opération coûteuse sur tableau)

**Problème actuel**:
```tsx
// ❌ AVANT - Recalcul à CHAQUE render (même si items/filtres n'ont pas changé)
const filteredItems = items.filter(item => {
  const matchCategory = !selectedCategory || item.category === selectedCategory
  const matchRarity = !selectedRarity || item.rarity === selectedRarity
  return matchCategory && matchRarity
})
```

**Solution optimisée**:
```tsx
// ✅ APRÈS - Calcul uniquement si dependencies changent
const filteredItems = useMemo(() => {
  return items.filter(item => {
    const matchCategory = !selectedCategory || item.category === selectedCategory
    const matchRarity = !selectedRarity || item.rarity === selectedRarity
    return matchCategory && matchRarity
  })
}, [items, selectedCategory, selectedRarity])
```

**Gains attendus**:
- ✅ Pas de re-filtrage si aucun changement
- ✅ Référence stable pour les composants enfants
- ✅ Évite 12+ re-renders inutiles de `ItemCard`

---

#### 3.2. Parsing JSON des traits dans MonsterSelectionModal
**Fichier**: `src/components/shop/monster-selection-modal.tsx`  
**Statut**: ❌ Parsing à chaque render de chaque carte  
**Impact**: Très élevé (opération coûteuse × nombre de monstres)

**Solution**:
```tsx
// ✅ Extraire en sous-composant avec useMemo
const MonsterCardItem = memo(function MonsterCardItem ({ monster }: { monster: DBMonster }) {
  const traits = useMemo<MonsterTraits>(() => {
    try {
      return JSON.parse(monster.traits)
    } catch {
      return DEFAULT_TRAITS
    }
  }, [monster.traits]) // Parse uniquement si traits change
  
  return <PixelMonster traits={traits} />
})
```

---

#### 3.3. Calcul du solde affiché
**Fichier**: `src/app/shop/page.tsx`  
**Statut**: ❌ Non nécessaire  
**Impact**: Négligeable (formatage simple)

**Conclusion**: Le `userBalance` est déjà un nombre simple affiché directement. Pas besoin de `useMemo` pour un affichage simple, le coût de mémorisation serait supérieur au gain.

**Action**: ❌ Ne pas implémenter (over-engineering)

---

#### 3.4. Statistiques des monstres dans les modals
**Fichier**: `src/components/shop/monster-selection-modal.tsx`  
**Statut**: ❌ Recalculé à chaque render

**Solution**:
```tsx
const selectedMonster = useMemo(() => {
  return monsters.find(m => m._id === selectedMonsterId)
}, [monsters, selectedMonsterId])
```

---

### 🟡 Priorité MOYENNE - Home Page

#### 3.5. Liste des avantages statiques
**Fichier**: `src/components/benefits-section.tsx`  
**Statut**: ✅ Déjà optimisé (données statiques)  
**Impact**: Aucun

**Conclusion**: Le tableau `benefits` est défini en dur dans le composant (pas de calcul dynamique). C'est déjà optimal.

**Action**: ❌ Aucune (déjà optimal)

---

## 4️⃣ Chargements à optimiser

### 🔴 Priorité HAUTE - Lazy Loading

#### 4.1. Shop Page - Lazy loading du modal
**Fichier**: `src/app/shop/page.tsx`  
**Statut**: ❌ Chargé dès le premier render  
**Impact**: Élevé (économie de ~15KB initial bundle)

**Problème actuel**:
```tsx
// ❌ AVANT - MonsterSelectionModal chargé même si jamais utilisé
import { MonsterSelectionModal } from '@/components/shop'

export default function ShopPage() {
  // Modal peut ne jamais s'ouvrir, mais le code est déjà chargé
}
```

**Solution optimisée**:
```tsx
// ✅ APRÈS - Chargement uniquement quand nécessaire
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const MonsterSelectionModal = dynamic(
  () => import('@/components/shop/monster-selection-modal').then(mod => ({ 
    default: mod.MonsterSelectionModal 
  })),
  { 
    loading: () => <ModalSkeleton />,
    ssr: false // Ne pas SSR le modal
  }
)

export default function ShopPage() {
  return (
    <>
      {isModalOpen && (
        <Suspense fallback={<ModalSkeleton />}>
          <MonsterSelectionModal {...modalProps} />
        </Suspense>
      )}
    </>
  )
}
```

**Gains attendus**:
- ✅ Réduction du bundle initial de ~15KB
- ✅ Temps de chargement initial plus rapide
- ✅ Modal chargé uniquement si utilisé

---

#### 4.2. Shop Page - Lazy loading des notifications
**Fichier**: `src/app/shop/page.tsx`  
**Statut**: ❌ Chargée dès le premier render  
**Impact**: Moyen

**Solution**:
```tsx
const PurchaseNotification = dynamic(
  () => import('@/components/shop/purchase-notification').then(mod => ({ 
    default: mod.PurchaseNotification 
  })),
  { ssr: false }
)
```

---

#### 4.3. PixelMonster - Lazy loading des animations lourdes
**Fichier**: `src/components/monsters/pixel-monster.tsx`  
**Statut**: ✅ Optimisé (SVG statique, pas de Canvas)  
**Impact**: Aucun

**Vérification effectuée**: Le composant `PixelMonster` utilise du SVG statique, pas de Canvas ni d'animations lourdes. Aucune optimisation nécessaire.

**Action**: ❌ Aucune (déjà optimal)

---

### 🟡 Priorité MOYENNE - Code Splitting par route

#### 4.4. Route-based code splitting
**Statut**: ✅ Automatique avec Next.js App Router  
**Impact**: Déjà optimal  
**Action**: Mesurer et monitorer uniquement

**Vérification recommandée**:
```bash
# Analyser le bundle après optimisations
npm run build

# Installer bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Dans next.config.ts, ajouter:
# const withBundleAnalyzer = require('@next/bundle-analyzer')({
#   enabled: process.env.ANALYZE === 'true'
# })
# module.exports = withBundleAnalyzer(nextConfig)

# Puis run:
ANALYZE=true npm run build
```

**Objectifs à mesurer**:
- `/` (Home) : < 100KB (gzip)
- `/dashboard` : < 150KB (gzip)
- `/shop` : < 120KB (gzip)
- `/creature/[id]` : < 100KB (gzip)

**Action**: ✅ Installer bundle analyzer pour monitoring

---

#### 4.5. Lazy loading des sections Home
**Fichier**: `src/app/page.tsx`  
**Statut**: ❌ Toutes les sections chargées immédiatement  
**Impact**: Moyen

**Solution - Charger les sections below-the-fold**:
```tsx
// ✅ APRÈS
import dynamic from 'next/dynamic'

// Sections above-the-fold : chargement immédiat
import Header from '@/components/header'
import HeroSection from '@/components/hero-section'

// Sections below-the-fold : lazy loading
const BenefitsSection = dynamic(() => import('@/components/benefits-section'))
const MonstersSection = dynamic(() => import('@/components/monsters-section'))
const ActionsSection = dynamic(() => import('@/components/actions-section'))
const NewsletterSection = dynamic(() => import('@/components/newsletter-section'))
const Footer = dynamic(() => import('@/components/footer'))

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <BenefitsSection />
      <MonstersSection />
      <ActionsSection />
      <NewsletterSection />
      <Footer />
    </>
  )
}
```

**Gains attendus**:
- ✅ LCP (Largest Contentful Paint) amélioré
- ✅ Réduction du bundle initial de ~30KB
- ✅ Time to Interactive plus rapide

---

### 🟢 Priorité BASSE - Optimisations avancées

#### 4.6. Image optimization
**Statut**: ⚠️ Utilisation limitée de `next/image`  
**Impact**: Faible (peu d'images utilisées)

**Vérification effectuée**:
- ✅ `pixel-background.tsx` utilise `next/image`
- ❌ La plupart des composants utilisent des emojis/SVG (pas besoin d'optimisation)
- ❌ Pas d'images externes lourdes détectées

**Checklist**:
- [x] Les rares images utilisent `<Image />` de Next.js
- [x] Formats WebP/AVIF activés par défaut dans Next.js 15
- [x] Lazy loading automatique avec `next/image`
- [ ] Ajouter placeholders blur si ajout d'images futures

**Conclusion**: ✅ Déjà optimal pour les images existantes. Documenter pour les futures images.

**Action**: 📝 Ajouter guideline dans DESIGN_SYSTEM.md pour toujours utiliser `next/image`

---

#### 4.7. Font optimization
**Statut**: ✅ Déjà optimisé avec `next/font`  
**Impact**: Aucun

**Vérification effectuée** dans `src/app/layout.tsx`:
```tsx
// ✅ DÉJÀ IMPLÉMENTÉ
import { Jersey_10, Geist_Mono } from 'next/font/google'

const jersey10 = Jersey_10({
  variable: '--font-jersey10',
  subsets: ['latin'],
  weight: '400'
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

// Utilisées dans le HTML avec variables CSS
```

**Conclusion**: ✅ Les fonts utilisent déjà `next/font/google` avec optimisation automatique (preload, subset, display swap).

**Action**: ❌ Aucune (déjà optimal)

---

#### 4.8. CSS optimization
**Statut**: ✅ Tailwind CSS v4 déjà optimisé  
**Action**: Aucune (Tailwind purge automatiquement)

---

## 5️⃣ Optimisations des hooks personnalisés

### 🔴 Priorité HAUTE

#### 5.1. `use-creature-data.ts`
**Statut**: ✅ Déjà optimisé  
**Vérifications**:
- ✅ `useCallback` pour `loadCreature`
- ✅ `useCallback` pour `refresh`
- ✅ Polling optimisé (1s)

**Amélioration possible**:
```tsx
// Ajouter un useMemo pour la transformation des données
const creatureData = useMemo(() => {
  if (!creature) return null
  return {
    ...creature,
    traits: JSON.parse(creature.traits)
  }
}, [creature])
```

---

#### 5.2. `use-monster-transform.ts`
**Statut**: ✅ Déjà optimisé avec `useMemo`  
**Action**: Aucune

---

#### 5.3. `use-auto-update-monsters.ts`
**Statut**: ✅ Déjà optimisé  
**Impact**: Aucun

**Vérification effectuée**:
- ✅ Utilise `useRef` pour éviter les re-renders inutiles
- ✅ Fonction `updateMonsters` définie dans le hook (pas de dépendances externes)
- ✅ Callbacks internes gérés correctement

**Action**: ❌ Aucune (déjà optimal)

---

### 🟡 Priorité MOYENNE

#### 5.4. Créer un hook `use-shop-filters`
**Statut**: ❌ N'existe pas  
**Impact**: Moyen  
**Objectif**: Extraire la logique de filtrage de `shop/page.tsx`

**Solution**:
```tsx
// ✅ src/hooks/use-shop-filters.ts
export function useShopFilters(items: ShopItemDTO[]) {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>()
  const [selectedRarity, setSelectedRarity] = useState<ItemRarity>()
  
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchCategory = !selectedCategory || item.category === selectedCategory
      const matchRarity = !selectedRarity || item.rarity === selectedRarity
      return matchCategory && matchRarity
    })
  }, [items, selectedCategory, selectedRarity])
  
  const setCategory = useCallback((category: ItemCategory | undefined) => {
    setSelectedCategory(category)
  }, [])
  
  const setRarity = useCallback((rarity: ItemRarity | undefined) => {
    setSelectedRarity(rarity)
  }, [])
  
  return {
    selectedCategory,
    selectedRarity,
    filteredItems,
    setCategory,
    setRarity
  }
}
```

**Utilisation**:
```tsx
// ✅ src/app/shop/page.tsx
const { filteredItems, setCategory, setRarity } = useShopFilters(items)
```

---

## 6️⃣ Caching des données serveur

### 🔴 Priorité HAUTE

#### 6.1. Cache des items de la boutique
**Fichier**: `src/app/api/shop/items/route.ts`  
**Statut**: ❌ Pas de cache actuellement  
**Impact**: Élevé (requête DB à chaque fois)

**Solution à implémenter**:
```tsx
// ✅ src/app/api/shop/items/route.ts
export const revalidate = 3600 // Cache 1 heure

// OU pour un cache plus granulaire
export const dynamic = 'force-dynamic' // Si on veut forcer le fetch
export const fetchCache = 'force-cache' // Pour cacher les fetch

export async function GET(request: Request) {
  // Les items ne changent pas souvent
  const items = await getShopItemsUseCase.execute({ ... })
  
  return NextResponse.json(items, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
    }
  })
}
```

**Gains attendus**: Réduction de 90% des requêtes DB pour les items

---

#### 6.2. Cache du solde utilisateur
**Fichier**: `src/app/api/wallet/route.ts` (route correcte trouvée)  
**Statut**: ❌ Pas de cache client actuellement  
**Impact**: Moyen

**Note**: L'API existe déjà à `/api/wallet` (pas `/api/user/balance`). Le solde est récupéré via fetch dans `shop/page.tsx`.

**Solution recommandée - React Query**:
```tsx
// ✅ src/hooks/use-user-wallet.ts
import { useQuery } from '@tanstack/react-query'

export function useUserWallet() {
  return useQuery({
    queryKey: ['user', 'wallet'],
    queryFn: async () => {
      const res = await fetch('/api/wallet')
      if (!res.ok) throw new Error('Failed to fetch wallet')
      return res.json()
    },
    staleTime: 30_000, // 30 secondes
    refetchInterval: 60_000, // Refetch toutes les minutes
    refetchOnWindowFocus: true // Refresh si l'utilisateur revient sur l'onglet
  })
}
```

**Utilisation dans ShopPage**:
```tsx
const { data: walletData, isLoading } = useUserWallet()
const userBalance = walletData?.data?.balance ?? 0
```

**Prérequis**: Installer `@tanstack/react-query` et setup le `QueryClientProvider`

---

#### 6.3. Cache des monstres utilisateur
**Statut**: ❌ Pas de cache React Query actuellement  
**Impact**: Moyen  
**Complexité**: Moyenne

**Solution recommandée**:
```tsx
// ✅ src/hooks/use-user-monsters.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useUserMonsters() {
  return useQuery({
    queryKey: ['monsters'],
    queryFn: async () => {
      const res = await fetch('/api/monsters')
      if (!res.ok) throw new Error('Failed to fetch monsters')
      return res.json()
    },
    staleTime: 60_000, // 1 minute
    refetchOnWindowFocus: true
  })
}

// Hook pour invalider le cache après achat
export function useInvalidateMonsters() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['monsters'] })
    queryClient.invalidateQueries({ queryKey: ['user', 'wallet'] })
  }
}
```

**Utilisation après achat**:
```tsx
const invalidateCache = useInvalidateMonsters()

const handlePurchase = async () => {
  await purchaseItem(...)
  invalidateCache() // Refresh monsters + wallet
}
```

---

## 7️⃣ Performance Monitoring

### 🟡 Priorité MOYENNE

#### 7.1. React DevTools Profiler
**Action**: Profiler les composants critiques

**Commandes**:
```bash
# Build de production avec profiling
NEXT_PUBLIC_PROFILING=true npm run build
npm start

# Ouvrir React DevTools > Profiler
# Enregistrer une session d'interaction
```

**Métriques à surveiller**:
- Temps de render de chaque composant
- Nombre de re-renders
- Composants qui re-render inutilement

---

#### 7.2. Lighthouse CI
**Action**: Automatiser les audits Lighthouse

**Solution**:
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/dashboard
            http://localhost:3000/shop
          uploadArtifacts: true
```

---

#### 7.3. Bundle Analyzer
**Action**: Analyser régulièrement la taille des bundles

**Commande**:
```bash
npm run build
npx @next/bundle-analyzer
```

**Objectifs**:
- Total bundle size < 300KB (gzip)
- Largest chunk < 150KB (gzip)
- No duplicate dependencies

---

## 8️⃣ Plan d'implémentation

### Phase 1 - Shop Page (Sprint 1 - 3 jours)
**Priorité**: 🔴 Critique

- [ ] **Jour 1**: React.memo sur tous les composants Shop (6 composants)
  - [ ] ItemCard
  - [ ] BackgroundCard
  - [ ] MonsterSelectionModal
  - [ ] PixelItem
  - [ ] PixelBackground
  - [ ] PurchaseNotification

- [ ] **Jour 2**: useCallback + useMemo dans ShopPage
  - [ ] Mémoriser tous les handlers (8 fonctions)
  - [ ] Mémoriser filteredItems
  - [ ] Créer hook useShopFilters
  - [ ] Tester les performances

- [ ] **Jour 3**: Lazy Loading
  - [ ] Dynamic import de MonsterSelectionModal
  - [ ] Dynamic import de PurchaseNotification
  - [ ] Vérifier bundle size

**Gains attendus**:
- ⚡ 60% moins de re-renders
- 📦 Bundle initial -20KB
- 🚀 Time to Interactive -200ms

---

### Phase 2 - Home Page (Sprint 2 - 2 jours)

- [ ] **Jour 1**: React.memo sur tous les composants (6 composants)
  - [ ] Header
  - [ ] Footer
  - [ ] HeroSection
  - [ ] BenefitsSection
  - [ ] MonstersSection
  - [ ] NewsletterSection

- [ ] **Jour 2**: Lazy Loading
  - [ ] Dynamic import des sections below-the-fold
  - [ ] Mesurer LCP

**Gains attendus**:
- ⚡ 40% moins de re-renders
- 📦 Bundle initial -30KB
- 🚀 LCP -300ms

---

### Phase 3 - Sign-In & Autres (Sprint 3 - 2 jours)

- [ ] **Jour 1**: React.memo sur composants Sign-In
- [ ] **Jour 2**: Font & Image optimization

**Gains attendus**:
- 🚀 Time to First Byte -100ms

---

### Phase 4 - Monitoring & Cache (Sprint 4 - 2 jours)

- [ ] **Jour 1**: Setup React Query pour cache API
- [ ] **Jour 2**: Setup Lighthouse CI + Bundle Analyzer

**Gains attendus**:
- 🔄 Cache hit rate > 80%
- 📊 Métriques automatisées

---

## 9️⃣ Métriques de succès

### Objectifs de performance

#### Lighthouse Score
| Métrique | Avant | Objectif | Status |
|----------|-------|----------|--------|
| Performance | ? | > 90 | ⏳ |
| Accessibility | ? | > 95 | ⏳ |
| Best Practices | ? | 100 | ⏳ |
| SEO | ? | 100 | ⏳ |

#### Core Web Vitals
| Métrique | Avant | Objectif | Status |
|----------|-------|----------|--------|
| LCP | ? | < 2.5s | ⏳ |
| FID | ? | < 100ms | ⏳ |
| CLS | ? | < 0.1 | ⏳ |
| TTFB | ? | < 600ms | ⏳ |
| TTI | ? | < 3.8s | ⏳ |

#### Bundle Size
| Page | Avant | Objectif | Status |
|------|-------|----------|--------|
| Home | ? | < 100KB | ⏳ |
| Dashboard | ? | < 150KB | ⏳ |
| Shop | ? | < 120KB | ⏳ |
| Creature | ? | < 100KB | ⏳ |

#### Re-renders
| Composant | Avant | Objectif | Status |
|-----------|-------|----------|--------|
| ItemCard | ? | < 3/interaction | ⏳ |
| MonsterCard | ? | < 2/interaction | ⏳ |
| ShopPage | ? | < 5/filter | ⏳ |

---

## 🔟 Checklist finale

### Avant chaque release
- [ ] Tous les composants clients ont `React.memo`
- [ ] Tous les calculs coûteux utilisent `useMemo`
- [ ] Tous les callbacks utilisent `useCallback`
- [ ] Lazy loading pour composants > 10KB
- [ ] Bundle analyzer run et validé
- [ ] Lighthouse score > 90
- [ ] Pas de warnings React DevTools
- [ ] Profiler validé (pas de re-renders inutiles)

### Tests de performance
- [ ] Test sur mobile 3G
- [ ] Test sur desktop haut débit
- [ ] Test avec CPU throttling (4x slowdown)
- [ ] Test avec 100+ items dans la boutique
- [ ] Test avec 10+ monstres créés

---

## 📚 Ressources

### Documentation
- [React.memo](https://react.dev/reference/react/memo)
- [useMemo](https://react.dev/reference/react/useMemo)
- [useCallback](https://react.dev/reference/react/useCallback)
- [Next.js Dynamic Import](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Outils
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Vitals](https://web.dev/vitals/)

---

## 📝 Notes

### Anti-patterns à éviter
❌ **Mémoriser trop tôt** : Profiler d'abord, optimiser ensuite  
❌ **useCallback sans deps** : Peut causer des bugs subtils  
❌ **useMemo pour calculs simples** : Overhead > gain  
❌ **React.memo partout** : Évaluer le coût/bénéfice  

### Bonnes pratiques
✅ **Profiler avant d'optimiser**  
✅ **Mesurer l'impact de chaque optimisation**  
✅ **Commencer par les bottlenecks**  
✅ **Tester sur devices réels**  
✅ **Automatiser les métriques**  

---

**Version**: 1.0.0  
**Dernière mise à jour**: 11 novembre 2025  
**Auteur**: Équipe Tamagotcho  
**Status**: 📋 Prêt pour implémentation
