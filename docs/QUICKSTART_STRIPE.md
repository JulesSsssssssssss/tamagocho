# 🚀 Quick Start - Boutique de Koins Stripe

## ⚡ Installation en 5 minutes

### 1. Variables d'environnement (2 min)

Créez `.env.local` si vous ne l'avez pas :
```bash
cp .env.local.example .env.local
```

Ajoutez ces 3 lignes :
```bash
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET  
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Stripe CLI (1 min)

```bash
# Installation (macOS)
brew install stripe/stripe-cli/stripe

# Connexion
stripe login
```

### 3. Webhook local (1 min)

```bash
# Terminal 1: Lancer Next.js
npm run dev

# Terminal 2: Lancer le webhook listener
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Copiez le `webhook signing secret` affiché (commence par `whsec_`) dans `.env.local`.

### 4. Test (1 min)

1. Aller sur http://localhost:3000/wallet
2. Cliquer sur un package de Koins
3. Carte de test : `4242 4242 4242 4242`
4. Vérifier que les Koins sont ajoutés ✅

---

## 🎯 C'est tout !

Votre boutique de Koins fonctionne ! 🎉

**Pour la production** : Voir `STRIPE_SETUP.md`

---

## 🐛 Problème ?

### Webhook ne fonctionne pas
```bash
# Vérifier que Stripe CLI écoute
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Tester manuellement
stripe trigger checkout.session.completed
```

### Erreur "STRIPE_SECRET_KEY not defined"
```bash
# Vérifier .env.local
cat .env.local | grep STRIPE

# Redémarrer Next.js
npm run dev
```

### Les Koins ne s'ajoutent pas
1. Vérifier les logs du webhook listener (Terminal 2)
2. Vérifier les logs Next.js (Terminal 1)
3. Vérifier que l'utilisateur est connecté

---

## 📚 Documentation complète

- `STRIPE_SETUP.md` - Guide complet
- `STRIPE_IMPLEMENTATION.md` - Détails techniques
- `IMPLEMENTATION_SUMMARY.md` - Vue d'ensemble

---

**Bon développement ! 🚀**
