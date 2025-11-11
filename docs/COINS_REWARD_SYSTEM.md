# Système de Récompense en Coins

## Vue d'ensemble

Le système de récompense en coins permet aux joueurs de gagner des TamaCoins (TC) à chaque interaction avec leurs monstres. Cette fonctionnalité encourage l'engagement et récompense les joueurs pour prendre soin de leurs créatures.

## Fonctionnalités

### Récompenses par Action

Chaque action effectuée sur un monstre rapporte **10 TamaCoins** :

- 🍖 **Nourrir** : +10 TC
- 🎾 **Jouer** : +10 TC
- 😴 **Dormir** : +10 TC
- 🧼 **Nettoyer** : +10 TC

### Notifications Toast

Après chaque action, un toast personnalisé s'affiche avec :
- Le nombre de coins gagnés
- Le nouveau solde du wallet
- Un design pixel art avec animation de pièce
- Style gaming avec bordure dorée et effet de brillance

## Architecture

### Constantes

**Fichier** : `src/shared/types/coins.ts`

```typescript
// Récompense en coins pour chaque action effectuée sur un monstre
export const COINS_PER_ACTION = 10
```

### Server Actions Modifiées

**Fichier** : `src/actions/monsters/monsters.actions.ts`

Toutes les actions de monstre ont été modifiées pour :

1. **Retourner un objet `MonsterActionResult`** contenant :
   ```typescript
   interface MonsterActionResult {
     success: boolean
     coinsEarned?: number
     newBalance?: number
     error?: string
   }
   ```

2. **Appeler `addCoins()`** après chaque action réussie :
   ```typescript
   const coinsResult = await addCoins(
     COINS_PER_ACTION, 
     'REWARD', 
     'Récompense pour avoir nourri le monstre'
   )
   ```

3. **Retourner les informations de récompense** :
   ```typescript
   return {
     success: true,
     coinsEarned: COINS_PER_ACTION,
     newBalance: coinsResult.newBalance
   }
   ```

### Actions Modifiées

- ✅ `feedMonster()` - Nourrir le monstre
- ✅ `playWithMonster()` - Jouer avec le monstre
- ✅ `sleepMonster()` - Faire dormir le monstre
- ✅ `cleanMonster()` - Nettoyer le monstre

### Composant UI

**Fichier** : `src/components/creature/creature-actions.tsx`

Le composant a été mis à jour pour :

1. **Gérer les résultats asynchrones** :
   ```typescript
   const result = await action(creatureId)
   ```

2. **Afficher des toasts de succès** avec le composant personnalisé :
   ```typescript
   toast.success(
     <CoinsToast 
       coinsEarned={result.coinsEarned} 
       newBalance={result.newBalance ?? 0} 
     />,
     { /* styles */ }
   )
   ```

3. **Gérer les erreurs** avec des toasts d'alerte

### Composant Toast Personnalisé

**Fichier** : `src/components/coins-toast.tsx`

Composant React dédié pour afficher une notification stylisée :
- Animation bounce sur l'icône de pièce
- Affichage du montant gagné en jaune doré
- Affichage du nouveau solde
- Style pixel art cohérent avec le design du jeu

## Flux de Données

```
┌─────────────────────────────────────────────────────────┐
│ 1. Utilisateur clique sur action (ex: Nourrir)         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 2. CreatureActions.handleAction() est appelé           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 3. feedMonster() server action s'exécute               │
│    - Met à jour les stats du monstre                   │
│    - Sauvegarde en DB                                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 4. addCoins() est appelé                                │
│    - Ajoute 10 TC au wallet du joueur                   │
│    - Crée une transaction REWARD                        │
│    - Retourne le nouveau solde                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Retour à CreatureActions                             │
│    - Reçoit MonsterActionResult                         │
│    - Affiche toast avec CoinsToast                      │
│    - Mise à jour du cache (revalidatePath)             │
└─────────────────────────────────────────────────────────┘
```

## Intégration avec le Wallet

### Transaction Repository

Les gains de coins sont enregistrés comme transactions avec :
- **Type** : `'EARN'`
- **Raison** : `'REWARD'`
- **Description** : Message spécifique à l'action (ex: "Récompense pour avoir nourri le monstre")

### Mise à Jour du Solde

Le solde du joueur (`Player.coins`) est automatiquement mis à jour :

```typescript
// Dans wallet.actions.ts
player.coins = currentCoins + COINS_PER_ACTION
await player.save()

// Création de la transaction
await transactionRepository.create(
  player._id.toString(),
  'EARN',
  amount,
  'REWARD',
  description
)
```

## Principes de Clean Architecture Respectés

### Single Responsibility Principle (SRP)
- ✅ `COINS_PER_ACTION` : Constante dédiée aux récompenses
- ✅ `CoinsToast` : Composant UI uniquement pour afficher les gains
- ✅ Server actions : Orchestration métier
- ✅ `addCoins()` : Gestion du wallet uniquement

### Open/Closed Principle (OCP)
- ✅ Extension via la constante `COINS_PER_ACTION` (modifiable sans toucher au code)
- ✅ Interface `MonsterActionResult` pour extensions futures

### Dependency Inversion Principle (DIP)
- ✅ `addCoins()` injecté dans les actions de monstre
- ✅ Pas de couplage direct avec l'implémentation du wallet

## Expérience Utilisateur

### Feedback Visuel

1. **Toast animé** : Apparaît en haut à droite avec animation
2. **Icône de pièce** : Animation bounce pour attirer l'attention
3. **Couleurs dorées** : Jaune/or pour symboliser la récompense
4. **Progression** : Barre de progression jaune dorée
5. **Auto-close** : Disparaît après 4 secondes

### Accessibilité

- ✅ Fermeture au clic
- ✅ Pause au survol
- ✅ Draggable pour repositionner
- ✅ Theme dark pour cohérence visuelle

## Tests Manuels

Pour tester la fonctionnalité :

1. Se connecter à l'application
2. Naviguer vers un monstre
3. Cliquer sur l'un des boutons d'action (Nourrir, Jouer, etc.)
4. Vérifier :
   - ✅ Le toast apparaît avec "+10 TamaCoins"
   - ✅ Le nouveau solde est affiché
   - ✅ Le wallet est mis à jour (vérifier via `/wallet`)
   - ✅ La transaction est créée (vérifier en DB)

## Performance

### Optimisations

- ✅ **Actions asynchrones** : Pas de blocage de l'UI
- ✅ **Revalidation sélective** : Uniquement le path de la créature
- ✅ **Memo sur CreatureActions** : Évite les re-renders inutiles
- ✅ **Toast avec timeout** : Libère la mémoire après 4s

## Évolutions Futures

### Idées d'amélioration

- 🎯 **Multiplicateurs** : Bonus si plusieurs actions d'affilée
- 🎯 **Combo** : Récompenses progressives pour actions enchaînées
- 🎯 **Événements spéciaux** : Double coins certains jours
- 🎯 **Quêtes quotidiennes** : Bonus pour X actions par jour
- 🎯 **Achievements** : Récompenses pour paliers d'actions (100, 500, 1000...)

## Compatibilité

- ✅ Next.js 15.5.4
- ✅ React 19.1.0
- ✅ TypeScript strict mode
- ✅ react-toastify 11.0.5
- ✅ MongoDB/Mongoose

## Conclusion

Le système de récompense en coins améliore l'engagement des joueurs en récompensant chaque interaction avec leurs monstres. L'architecture respecte les principes SOLID et Clean Architecture, assurant maintenabilité et extensibilité.

---

**Auteur** : GitHub Copilot  
**Date** : 6 novembre 2025  
**Version** : 1.0.0
