# 🔧 Fix: Aucun événement Stripe après paiement

## 🎯 Problème identifié

Les paiements Stripe ne créent **aucun événement** dans le Dashboard Stripe.

## 🔍 Cause racine

La variable d'environnement `NEXT_PUBLIC_APP_URL` sur Vercel pointe vers `localhost:3000` au lieu du domaine de production.

**Conséquence** : Les URLs de redirection Stripe (`success_url` et `cancel_url`) ne fonctionnent pas, empêchant la session de se compléter correctement.

## ✅ Solution

### 1. Configurer la variable d'environnement sur Vercel

**URL** : https://vercel.com/jules-projects-a1c1d0b4/tamagocho-2/settings/environment-variables

**Ajouter** :
```
Name: NEXT_PUBLIC_APP_URL
Value: https://tamagocho-2.vercel.app
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### 2. Redéployer l'application

Deux options :

**Option A - Commit vide pour forcer redéploiement** :
```bash
git commit --allow-empty -m "chore: trigger redeploy for env var update"
git push
```

**Option B - Via Vercel Dashboard** :
- Allez sur : Deployments
- Cliquez sur les 3 points (...) du dernier déploiement
- Cliquez "Redeploy"

### 3. Tester le paiement

Après le redéploiement (2-3 minutes) :

1. **Achetez un pack de coins**
   - Carte : `4242 4242 4242 4242`
   - Date : `12/34`
   - CVC : `123`

2. **Vérifiez les événements Stripe**
   - URL : https://dashboard.stripe.com/test/events
   - Vous devriez voir :
     - ✅ `checkout.session.completed`
     - ✅ `payment_intent.succeeded`
     - ✅ `charge.succeeded`

3. **Vérifiez le webhook**
   - URL : https://dashboard.stripe.com/test/webhooks
   - Dans "Recent deliveries", vérifiez :
     - ✅ Événement `checkout.session.completed`
     - ✅ Status : **200 OK**
     - ✅ Logs montrant l'ajout des coins

4. **Vérifiez votre wallet**
   - Les coins doivent apparaître immédiatement

## 🔬 Diagnostic

### Vérifier les URLs de redirection

Dans les logs Vercel, après avoir cliqué sur un pack de coins, vous devriez voir :

```
🛒 Checkout session requested
  - User ID: [votre-user-id]
  - Amount: 50 coins
  - Price: 4.99 EUR
  - Product ID: prod_xxx...
```

### Vérifier la création de session

La réponse de `/api/checkout/sessions` doit contenir :
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### Logs attendus après paiement

Dans les logs Vercel, vous devriez voir :

```
========================================
✅ Checkout session completed
Event ID: evt_...
Metadata: { userId: '...', koinsAmount: '50' }
Amount total: 499
========================================
🔍 Looking for userId: [user-id]
🔍 Player found: Yes (coins: 0)
💵 Amount paid: 4.99 EUR
🔍 Found package: [ '50', { productId: '...', price: 4.99 } ]
💰 Adding 50 Koins to user [user-id]
💰 Current coins: 0
💰 New coins after addition: 50
✅ Wallet updated successfully. New balance: 50
========================================
```

## 📋 Checklist de vérification

Avant de tester :
- [ ] Variable `NEXT_PUBLIC_APP_URL` configurée sur Vercel
- [ ] Application redéployée
- [ ] Webhook Stripe toujours actif (https://dashboard.stripe.com/test/webhooks)
- [ ] Variable `STRIPE_WEBHOOK_SECRET` configurée sur Vercel

Après le test :
- [ ] Événements visibles dans Stripe Dashboard
- [ ] Webhook a reçu l'événement (Recent deliveries)
- [ ] Logs Vercel montrent l'ajout des coins
- [ ] Coins visibles dans le wallet de l'application

## 🚨 Si ça ne fonctionne toujours pas

### Problème : Événements créés mais webhook ne reçoit rien

**Solution** : Vérifier que le webhook est configuré sur la bonne URL :
```
https://tamagocho-2.vercel.app/api/webhook/stripe
```

### Problème : Webhook reçoit 400/500

**Solution** : Vérifier que `STRIPE_WEBHOOK_SECRET` sur Vercel correspond au secret du webhook dans Stripe Dashboard.

### Problème : Coins ne s'ajoutent pas malgré webhook 200 OK

**Solutions** :
1. Vérifier les logs Vercel pour voir le détail de l'erreur
2. Vérifier que le `userId` dans metadata correspond à un utilisateur authentifié
3. Vérifier la connexion MongoDB (variable `MONGODB_*`)
4. Vérifier que le package existe dans `pricingTable`

## 📚 Documentation liée

- [WEBHOOK_VERCEL_SETUP.md](./WEBHOOK_VERCEL_SETUP.md) - Configuration complète du webhook
- [WEBHOOK_COINS_DEBUG.md](./WEBHOOK_COINS_DEBUG.md) - Débogage avancé des coins
- [QUICK_DEBUG_COINS.md](./QUICK_DEBUG_COINS.md) - Diagnostic rapide
