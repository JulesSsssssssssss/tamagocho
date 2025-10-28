# 💰 Système Économique Tamagotcho

## 🪙 Définition de la Monnaie

### Nom
**TamaCoins** (symbole: 🪙 TC)

### Valeur de Base
- **1 TamaCoin = 1 TC**
- Monnaie entière (pas de décimales)
- Minimum: 0 TC
- Maximum: 999,999 TC par wallet

## 💱 Modalités d'Échange

### Comment Gagner des TamaCoins ?

1. **Actions quotidiennes avec les monstres**
   - Nourrir un monstre: +10 TC
   - Jouer avec un monstre: +15 TC
   - Soigner un monstre: +20 TC
   - Mettre au repos un monstre: +5 TC

2. **Progression et niveaux**
   - Monter un monstre au niveau 2: +50 TC
   - Monter un monstre au niveau 3: +100 TC
   - Chaque niveau supplémentaire: +50 TC

3. **Bonus de connexion**
   - Connexion quotidienne: +25 TC
   - Série de 7 jours consécutifs: +100 TC bonus
   - Série de 30 jours: +500 TC bonus

4. **Création de monstres**
   - Créer un nouveau monstre: -200 TC (coût)
   - Mais obtenir un monstre rare/légendaire: +300 TC bonus

5. **Récompenses temporelles**
   - Garder un monstre en vie 7 jours: +75 TC
   - Garder un monstre en vie 30 jours: +300 TC

### Comment Dépenser des TamaCoins ?

1. **Magasin de monstres**
   - Créer un monstre commun: 200 TC
   - Créer un monstre rare: 500 TC
   - Créer un monstre légendaire: 1000 TC

2. **Soins et items**
   - Nourriture premium: 30 TC (restaure +50 hunger au lieu de +10)
   - Potion d'énergie: 40 TC (restaure +50 energy)
   - Potion de bonheur: 50 TC (restaure +50 happiness)

3. **Personnalisation**
   - Changer le nom d'un monstre: 50 TC
   - Débloquer une couleur rare: 100 TC
   - Débloquer un pattern spécial: 150 TC

4. **Gameplay avancé**
   - Réanimer un monstre mort: 500 TC
   - Accélérer la croissance (gain de XP): 100 TC
   - Garantir un trait spécifique: 200 TC

## 🏦 Système de Wallet

### Structure
```typescript
interface Wallet {
  id: string                // ID unique du wallet
  ownerId: string          // ID du joueur propriétaire
  balance: number          // Montant en TamaCoins
  currency: 'TC'           // Type de monnaie
  createdAt: Date          // Date de création
  updatedAt: Date          // Dernière modification
  totalEarned: number      // Total gagné (statistique)
  totalSpent: number       // Total dépensé (statistique)
}
```

### Transactions
```typescript
interface Transaction {
  id: string
  walletId: string
  type: 'EARN' | 'SPEND'
  amount: number
  reason: string           // Description de la transaction
  metadata?: object        // Données supplémentaires
  createdAt: Date
}
```

## 💳 Règles de Gestion

### Validations
- ✅ Le solde ne peut JAMAIS être négatif
- ✅ Les montants doivent être des entiers positifs
- ✅ Chaque transaction est enregistrée (traçabilité)
- ✅ Un utilisateur = un seul wallet
- ✅ Maximum 999,999 TC par wallet

### Sécurité
- 🔒 Vérification du propriétaire avant transaction
- 🔒 Validation serveur pour toute modification
- 🔒 Historique immuable des transactions
- 🔒 Protection contre les race conditions (transactions concurrentes)

## 📊 Affichage Frontend

### Dashboard Principal
```
┌─────────────────────────────────────┐
│  💰 Mon Portefeuille                │
│  ─────────────────────────────────  │
│  Solde actuel: 1,234 🪙 TC          │
│  Total gagné: 5,678 🪙 TC           │
│  Total dépensé: 4,444 🪙 TC         │
└─────────────────────────────────────┘
```

### Page Dédiée Wallet
- Solde en grand et visible
- Graphique d'évolution (derniers 7 jours)
- Historique des transactions (10 dernières)
- Statistiques (revenus par catégorie)
- Boutons d'action:
  - 🎁 Réclamer récompense quotidienne
  - 🛒 Aller au magasin
  - 📊 Voir statistiques complètes

## 🎯 Implémentation Technique

### Architecture (Clean Architecture)

```
src/
├── domain/
│   ├── entities/
│   │   ├── Wallet.ts              # Entité Wallet
│   │   └── Transaction.ts         # Entité Transaction
│   └── repositories/
│       └── IWalletRepository.ts   # Interface repository
│
├── application/
│   └── use-cases/
│       ├── GetWallet.ts           # Récupérer le wallet
│       ├── AddCoins.ts            # Ajouter des coins
│       ├── SpendCoins.ts          # Dépenser des coins
│       └── GetTransactions.ts     # Historique
│
├── infrastructure/
│   └── repositories/
│       └── MongoWalletRepository.ts
│
└── presentation/
    └── components/
        └── wallet/
            ├── wallet-balance.tsx
            ├── wallet-actions.tsx
            └── transaction-history.tsx
```

## 🚀 Plan d'Implémentation

### Phase 1: Modèles et Database
1. Créer le modèle MongoDB Wallet
2. Créer le modèle MongoDB Transaction
3. Créer les migrations si nécessaire

### Phase 2: Domain Layer
1. Créer l'entité Wallet
2. Créer l'entité Transaction
3. Définir les interfaces de repository

### Phase 3: Application Layer
1. Use case: GetWallet
2. Use case: AddCoins
3. Use case: SpendCoins
4. Use case: GetTransactionHistory

### Phase 4: Infrastructure
1. Implémenter WalletRepository
2. Implémenter TransactionRepository
3. Créer les Server Actions

### Phase 5: Presentation
1. Composant WalletBalance (affichage)
2. Composant WalletActions (boutons)
3. Composant TransactionHistory
4. Page dédiée /wallet

### Phase 6: Intégration
1. Afficher le wallet dans le dashboard
2. Intégrer les gains lors des actions (feed, play, etc.)
3. Intégrer les coûts lors de la création de monstres

## 📐 Principes SOLID Appliqués

- **S (SRP)**: Chaque use case a une seule responsabilité
- **O (OCP)**: Extensible via nouvelles raisons de transactions
- **L (LSP)**: Les implémentations respectent les interfaces
- **I (ISP)**: Interfaces minimales et focalisées
- **D (DIP)**: Dépendance vers abstractions (IWalletRepository)

## 🎨 Design UI/UX

### Couleurs
- Primary (coins): `#FFD700` (gold)
- Success (gain): `#10B981` (green)
- Danger (dépense): `#EF4444` (red)
- Neutral: Couleurs existantes du thème

### Animations
- Compteur animé lors du changement de solde
- Effet de "coin drop" lors d'un gain
- Transition douce pour les transactions

### Icônes
- 🪙 TamaCoin principal
- 💰 Wallet/Portefeuille
- 📈 Gains/Revenus
- 📉 Dépenses
- 🎁 Récompenses
- 🛒 Magasin
