# 🚨 Solution : Webhook ne reçoit aucun événement

## Problème identifié

Votre webhook Stripe est configuré mais **ne reçoit aucun événement** ("En attente d'événements...").

## ✅ Actions immédiates

### 1️⃣ Vérifier que les paiements créent bien des événements

1. **Aller sur Stripe Dashboard** : https://dashboard.stripe.com/test/events
2. **Regarder la liste des événements récents**
3. **Cherchez** `checkout.session.completed` dans les dernières heures

**Si vous voyez des événements** → Le problème est la configuration du webhook  
**Si vous ne voyez AUCUN événement** → Les paiements ne se créent pas correctement

### 2️⃣ Vérifier la configuration du webhook

**Sur Stripe Dashboard** :
- https://dashboard.stripe.com/test/webhooks
- Cliquez sur votre webhook `https://tamagocho-2.vercel.app/api/webhook/stripe`

**Vérifiez ces points** :

#### Point 1 : URL correcte
```
✅ BON : https://tamagocho-2.vercel.app/api/webhook/stripe
❌ MAUVAIS : https://tamagocho-2.vercel.app/api/webhooks/stripe (avec 's')
❌ MAUVAIS : http://tamagocho-2.vercel.app... (http au lieu de https)
```

#### Point 2 : Événements écoutés
Vérifiez que vous écoutez bien ces événements :
- ✅ `checkout.session.completed`
- ✅ `checkout.session.async_payment_succeeded` (optionnel)
- ✅ `checkout.session.async_payment_failed` (optionnel)

Si vous n'écoutez AUCUN événement spécifique, le webhook ne sera jamais appelé !

**Comment vérifier** :
1. Cliquez sur votre webhook
2. Section **"Events to send"** ou **"Événements à écouter"**
3. Devrait montrer : `checkout.session.completed` minimum

**Comment corriger** :
1. Cliquez sur "..." (3 points) → **"Update details"**
2. Section **"Select events to listen to"**
3. Cherchez `checkout.session.completed`
4. Cochez la case ✅
5. Sauvegardez

### 3️⃣ Tester manuellement le webhook

**Sur Stripe Dashboard** :
1. Allez sur votre webhook
2. Cliquez sur **"Send test webhook"** (en haut à droite)
3. Sélectionnez `checkout.session.completed`
4. Cliquez sur **"Send test webhook"**

**Résultat attendu** :
```
✅ 200 OK
Response: ok
```

**Si vous voyez une erreur** :
- ❌ 400 : Problème de signature (mauvais secret)
- ❌ 404 : URL incorrecte
- ❌ 500 : Erreur dans votre code

### 4️⃣ Vérifier que STRIPE_WEBHOOK_SECRET est correct

**IMPORTANT** : Le secret sur Vercel doit être **exactement** le même que sur Stripe Dashboard.

**Sur Stripe Dashboard** :
1. Allez sur votre webhook
2. Section **"Signing secret"**
3. Cliquez sur **"Reveal"** (œil)
4. Copiez le secret (commence par `whsec_...`)

**Sur Vercel Dashboard** :
1. Settings → Environment Variables
2. Trouvez `STRIPE_WEBHOOK_SECRET`
3. Cliquez sur **"Edit"**
4. Remplacez par le secret copié depuis Stripe
5. **IMPORTANT** : Cochez **Production**, **Preview**, **Development**
6. Sauvegardez
7. **Redéployez** l'application

### 5️⃣ Faire un nouveau test de paiement COMPLET

**Étapes détaillées** :

1. **Ouvrir 2 onglets** :
   - Onglet 1 : https://dashboard.stripe.com/test/webhooks (votre webhook)
   - Onglet 2 : https://tamagocho-2.vercel.app/wallet (votre app)

2. **Dans l'onglet 2** (votre app) :
   - Connectez-vous
   - Allez sur le wallet
   - Notez vos coins actuels (ex: 100 TC)
   - Cliquez sur un package (ex: 10 coins pour 0.50€)

3. **Sur la page Stripe Checkout** :
   - Carte de test : `4242 4242 4242 4242`
   - Date : `12/34`
   - CVC : `123`
   - Email : `test@example.com`
   - Cliquez sur **"Payer"**

4. **Immédiatement après le paiement** :
   - **Onglet 1** : Rafraîchissez → Vous devriez voir un nouvel événement
   - **Onglet 2** : Rafraîchissez → Les coins devraient avoir augmenté

### 6️⃣ Si toujours rien : Vérifier les événements Stripe

**Aller sur** : https://dashboard.stripe.com/test/events

**Cherchez** `checkout.session.completed` dans les dernières minutes.

**Si vous voyez l'événement** :
- Cliquez dessus
- Section **"Webhook attempts"** ou **"Tentatives de webhook"**
- Devrait montrer une tentative d'envoi vers votre URL Vercel

**Si "No webhook endpoints configured"** :
- Le webhook n'écoute pas cet événement !
- Retournez au **Point 2** ci-dessus

### 7️⃣ Vérifier que le middleware Next.js n'interdit pas le webhook

**Fichier** : `src/middleware.ts`

**Vérifiez que `/api/webhook` est EXCLU** :

```typescript
export const config = {
  matcher: [
    // Exclure /api/webhook de l'authentification
    '/((?!api/webhook|_next/static|_next/image|favicon.ico).*)',
  ]
}
```

Si ce n'est pas le cas, le middleware pourrait bloquer les requêtes Stripe (qui n'ont pas de session).

## 🧪 Test de diagnostic complet

Créez ce fichier temporaire pour tester :

```typescript
// src/app/api/webhook/test/route.ts
export async function POST(req: Request) {
  console.log('🧪 TEST WEBHOOK CALLED')
  console.log('Headers:', Object.fromEntries(req.headers.entries()))
  
  const body = await req.text()
  console.log('Body:', body)
  
  return new Response('Test OK', { status: 200 })
}

export async function GET() {
  return new Response('Webhook test endpoint is working', { status: 200 })
}
```

**Testez** :
```bash
# Depuis votre terminal
curl https://tamagocho-2.vercel.app/api/webhook/test

# Devrait retourner : "Webhook test endpoint is working"
```

Si ça fonctionne, votre route webhook est bien accessible.

## 📊 Checklist de résolution

- [ ] Les événements `checkout.session.completed` apparaissent sur https://dashboard.stripe.com/test/events
- [ ] Le webhook écoute bien l'événement `checkout.session.completed`
- [ ] L'URL du webhook est exactement : `https://tamagocho-2.vercel.app/api/webhook/stripe`
- [ ] Le secret `STRIPE_WEBHOOK_SECRET` sur Vercel est le même que sur Stripe
- [ ] "Send test webhook" sur Stripe retourne 200 OK
- [ ] Le middleware n'interfère pas avec `/api/webhook`
- [ ] Un paiement test déclenche bien un événement visible sur Stripe Dashboard

## 🎯 Solution la plus probable

**Le webhook n'écoute pas les bons événements.**

1. Allez sur votre webhook Stripe
2. Cliquez sur **"..."** → **"Update details"**
3. Section **"Events to send"**
4. Ajoutez : `checkout.session.completed`
5. Sauvegardez
6. Refaites un paiement test

---

**Testez ces points dans l'ordre et dites-moi ce que vous trouvez !** 🔍
