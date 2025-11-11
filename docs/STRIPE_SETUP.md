# 💳 Configuration Stripe - Guide d'Installation

## 📋 Vue d'ensemble

Cette feature ajoute un système de paiement complet via **Stripe** pour l'achat de Koins dans votre projet Tamagotchi.

## ✨ Features implémentées

### 1. **Boutique de Koins** 🪙
- Interface d'achat avec 5 packages de Koins
- Design system respecté (moccaccino, lochinvar, fuchsia-blue)
- Animations et effets visuels
- Responsive (mobile-first)

### 2. **Intégration Stripe Checkout** 💳
- Session de paiement sécurisée
- Support de tous les moyens de paiement (CB, PayPal, Apple Pay, etc.)
- Redirection vers Stripe puis retour automatique

### 3. **Webhook Stripe** 🔔
- Mise à jour automatique du solde après paiement
- Traitement des événements `checkout.session.completed`
- Logs détaillés pour le debugging

## 🔧 Variables d'environnement requises

Ajoutez ces variables dans votre fichier `.env.local` :

```bash
# ==============================================
# STRIPE CONFIGURATION
# ==============================================

# Clé secrète Stripe (commence par sk_test_ ou sk_live_)
# Obtenir: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE

# Secret du webhook Stripe (commence par whsec_)
# Obtenir: https://dashboard.stripe.com/webhooks
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_WEBHOOK

# URL de votre application (pour les redirections)
# Dev: http://localhost:3000
# Prod: https://votre-domaine.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📝 Configuration Stripe Dashboard

### Étape 1: Créer un compte Stripe
1. Aller sur [https://stripe.com](https://stripe.com)
2. Créer un compte ou se connecter
3. Passer en mode **Test** (toggle en haut à droite)

### Étape 2: Récupérer les clés API
1. Aller dans **Developers** > **API keys**
2. Copier la **Secret key** (commence par `sk_test_`)
3. Ajouter dans `.env.local` : `STRIPE_SECRET_KEY=sk_test_...`

### Étape 3: Créer les produits Koins
Vous devez créer 5 produits dans Stripe correspondant aux packages :

| Koins | Prix | Product ID à créer |
|-------|------|-------------------|
| 10    | 0.50€ | `prod_TJrIjoHwTKwg9c` |
| 50    | 1.00€ | `prod_TJrJHiNKtOkEXR` |
| 500   | 2.00€ | `prod_TJrJT9hFwWozod` |
| 1000  | 3.00€ | `prod_TJrKh3jSiA5EQ5` |
| 5000  | 10.00€ | `prod_TJrLUfvqFCZx8l` |

**Instructions:**
1. Aller dans **Products** > **Add product**
2. Créer chaque produit avec le nom et prix correspondant
3. Copier le **Product ID** (commence par `prod_`)
4. Remplacer dans `src/config/pricing.ts`

**Alternative rapide**: Vous pouvez utiliser vos propres Product IDs en modifiant le fichier `src/config/pricing.ts`.

### Étape 4: Configurer le Webhook

#### En développement local (avec Stripe CLI):

1. **Installer Stripe CLI**:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Autres OS: https://stripe.com/docs/stripe-cli
   ```

2. **Se connecter**:
   ```bash
   stripe login
   ```

3. **Écouter les webhooks**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```

4. **Copier le webhook secret** affiché (commence par `whsec_`) dans `.env.local`

5. **Tester un paiement**:
   ```bash
   # Dans un autre terminal
   stripe trigger checkout.session.completed
   ```

#### En production:

1. Aller dans **Developers** > **Webhooks**
2. Cliquer sur **Add endpoint**
3. URL du endpoint: `https://votre-domaine.com/api/webhook/stripe`
4. Sélectionner les événements:
   - `checkout.session.completed`
   - `payment_intent.succeeded` (optionnel)
5. Copier le **Signing secret** (commence par `whsec_`)
6. Ajouter dans les variables d'environnement de production

## 🧪 Tester en développement

### 1. Démarrer l'application
```bash
npm run dev
```

### 2. Démarrer le webhook listener
```bash
# Dans un autre terminal
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

### 3. Tester un achat
1. Aller sur [http://localhost:3000/wallet](http://localhost:3000/wallet)
2. Cliquer sur un package de Koins
3. Sur la page Stripe, utiliser une **carte de test**:
   - Numéro: `4242 4242 4242 4242`
   - Date: n'importe quelle date future
   - CVC: n'importe quel 3 chiffres
4. Valider le paiement
5. Vérifier que les Koins ont été ajoutés

### 4. Vérifier les logs
```bash
# Dans le terminal du webhook listener
✅ Checkout session completed
💰 Adding 50 Koins to user 123abc
✅ Wallet updated. New balance: 150
```

## 📁 Fichiers créés/modifiés

### Nouveaux fichiers:
```
src/
├── config/
│   └── pricing.ts                          # Configuration des packages
├── lib/
│   └── stripe.ts                           # Instance Stripe
├── app/
│   └── api/
│       ├── checkout/
│       │   └── sessions/
│       │       └── route.ts                # Création session Stripe
│       └── webhook/
│           └── stripe/
│               └── route.ts                # Traitement paiements
└── components/
    └── wallet/
        └── wallet-client.tsx               # Interface d'achat
```

### Fichiers modifiés:
```
src/
├── actions/
│   └── wallet.actions.ts                   # + export type DBWallet
└── app/
    └── wallet/
        └── page.tsx                        # Utilise WalletClient
```

## 🎨 Design System respecté

Le composant `WalletClient` utilise **strictement** votre palette de couleurs:

- **Primaire**: `moccaccino-*` (rouge/orange)
- **Secondaire**: `lochinvar-*` (vert/cyan)
- **Accent**: `fuchsia-blue-*` (violet)

Aucun autre CSS n'a été ajouté ou modifié.

## 🚀 Passage en production

### 1. Passer en mode Live Stripe
1. Dans le dashboard Stripe, basculer vers **Live mode**
2. Récupérer les nouvelles clés API (commencent par `sk_live_`)

### 2. Mettre à jour les variables d'environnement
```bash
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_LIVE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_LIVE
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

### 3. Recréer les produits en mode Live
Les produits de test ne sont pas disponibles en Live. Vous devez:
1. Recréer les 5 produits en mode Live
2. Mettre à jour les Product IDs dans `src/config/pricing.ts`

### 4. Configurer le webhook en production
Voir section "En production" ci-dessus.

## 🐛 Troubleshooting

### Erreur: "STRIPE_SECRET_KEY is not defined"
→ Vérifier que `.env.local` contient `STRIPE_SECRET_KEY`
→ Redémarrer le serveur Next.js

### Erreur: "Webhook signature verification failed"
→ Vérifier que `STRIPE_WEBHOOK_SECRET` est correct
→ Utiliser `stripe listen` en dev
→ Vérifier l'URL du webhook en prod

### Les Koins ne sont pas ajoutés après paiement
→ Vérifier les logs du webhook listener
→ Vérifier que le webhook reçoit bien les événements
→ Vérifier que les Product IDs correspondent

### Erreur: "Product not found"
→ Vérifier que les Product IDs dans `pricing.ts` existent dans Stripe
→ Vérifier le mode (Test vs Live)

## 📚 Documentation Stripe

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Documentation Checkout](https://stripe.com/docs/payments/checkout)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Test Cards](https://stripe.com/docs/testing)

## ✅ Checklist d'installation

- [ ] Compte Stripe créé
- [ ] Clés API récupérées
- [ ] Variables d'environnement ajoutées
- [ ] Produits créés dans Stripe
- [ ] Product IDs mis à jour dans `pricing.ts`
- [ ] Stripe CLI installé (dev)
- [ ] Webhook configuré
- [ ] Test d'achat réussi
- [ ] Vérification des logs

## 🎯 Prochaines étapes (optionnelles)

- [ ] Ajouter plus de packages de Koins
- [ ] Créer un historique des transactions
- [ ] Ajouter des notifications email (via Stripe)
- [ ] Implémenter les remboursements
- [ ] Ajouter des promotions/codes promo
- [ ] Créer un dashboard admin pour suivre les ventes

---

**Note**: Cette implémentation respecte les principes **SOLID** et **Clean Architecture** de votre projet. La logique métier est séparée de l'infrastructure Stripe.
