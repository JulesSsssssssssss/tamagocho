# 🚀 Configuration Webhook Stripe sur Vercel

## Problème

Le webhook Stripe fonctionne en local avec `stripe listen` mais ne fonctionne pas sur Vercel en production.

## Pourquoi ?

- **En dev** : `stripe listen` crée un tunnel vers `localhost:3000`
- **En prod** : Vercel héberge votre app sur `https://votre-app.vercel.app`, pas de tunnel automatique

## ✅ Solution : Webhook Stripe Dashboard

### Étape 1 : Créer le webhook sur Stripe

1. **Aller sur Stripe Dashboard**
   - https://dashboard.stripe.com
   - **Developers** → **Webhooks**

2. **Ajouter un endpoint**
   - Cliquez sur **"+ Add endpoint"**
   - **URL** : `https://VOTRE-APP.vercel.app/api/webhook/stripe`
     - Remplacez `VOTRE-APP` par votre domaine Vercel
     - Exemple : `https://tamagocho.vercel.app/api/webhook/stripe`

3. **Sélectionner les événements**
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.async_payment_succeeded`
   - ✅ `checkout.session.async_payment_failed`
   - ✅ `payment_intent.succeeded` (optionnel)
   - ✅ `payment_intent.payment_failed` (optionnel)

4. **Copier le Signing Secret**
   - Après création, ouvrez le webhook
   - Section **"Signing secret"** → Cliquez sur **"Reveal"**
   - Copiez le secret (commence par `whsec_...`)

### Étape 2 : Variables d'environnement sur Vercel

1. **Aller sur Vercel Dashboard**
   - https://vercel.com/dashboard
   - Sélectionnez votre projet

2. **Settings → Environment Variables**
   
   **Pour la PRODUCTION** :
   ```env
   STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_CLE_PUBLIQUE
   STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SIGNING_SECRET
   ```

   **Pour le TEST (recommandé au début)** :
   ```env
   STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_TEST
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_TEST
   STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SIGNING_SECRET_TEST
   ```

3. **Environnements** :
   - Production : Cochez **Production**
   - Preview : Cochez **Preview** (pour tester les PR)
   - Development : **NON** (utilisez `.env.local`)

4. **Sauvegarder** et **Redéployer**

### Étape 3 : Vérifier le code du webhook

Assurez-vous que votre route `/api/webhook/stripe/route.ts` est bien configurée :

```typescript
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Traiter l'événement
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Votre logique métier ici
        console.log('Payment succeeded:', session.id)
        
        // Exemple : ajouter des coins au joueur
        const userId = session.metadata?.userId
        const coinsAmount = session.metadata?.coinsAmount
        
        if (userId && coinsAmount) {
          // Appeler votre logique d'ajout de coins
          // await addCoinsToPlayer(userId, parseInt(coinsAmount))
        }
        
        break
      }

      case 'checkout.session.async_payment_succeeded': {
        // Paiement asynchrone réussi (virement bancaire, etc.)
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Async payment succeeded:', session.id)
        break
      }

      case 'checkout.session.async_payment_failed': {
        // Paiement asynchrone échoué
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Async payment failed:', session.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
```

### Étape 4 : Tester le webhook en production

#### Option A : Test avec Stripe Dashboard

1. **Aller sur Stripe Dashboard** → **Developers** → **Webhooks**
2. Cliquez sur votre webhook
3. Onglet **"Send test webhook"**
4. Sélectionnez `checkout.session.completed`
5. Cliquez sur **"Send test webhook"**
6. Vérifiez la réponse (doit être **200 OK**)

#### Option B : Test avec un vrai paiement

1. **Utiliser une carte de test Stripe** :
   - Numéro : `4242 4242 4242 4242`
   - Date : N'importe quelle date future
   - CVC : N'importe quel 3 chiffres

2. **Effectuer un achat sur votre app Vercel**

3. **Vérifier les logs** :
   - Stripe Dashboard → Webhooks → Voir les événements envoyés
   - Vercel Dashboard → Deployments → Logs

### Étape 5 : Monitoring et debug

#### Vérifier les logs Stripe

```
Stripe Dashboard → Developers → Webhooks → Votre endpoint → Recent deliveries
```

Statuts possibles :
- ✅ **200 OK** : Webhook reçu et traité avec succès
- ❌ **400** : Erreur de signature ou payload invalide
- ❌ **500** : Erreur serveur dans votre code

#### Vérifier les logs Vercel

```bash
# Via CLI Vercel
vercel logs --follow

# Ou sur le dashboard
Vercel → Deployments → Sélectionner le déploiement → Functions
```

## 🔄 Workflow Dev vs Prod

### Environnement DEV (local)

```bash
# Terminal 1 : Lancer le serveur Next.js
npm run dev

# Terminal 2 : Lancer le tunnel Stripe CLI
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Variables `.env.local` :
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (fourni par stripe listen)
```

### Environnement PROD (Vercel)

**Aucun terminal nécessaire !**

Variables Vercel (Production) :
```env
STRIPE_SECRET_KEY=sk_live_... (ou sk_test_ pour tester)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (du Stripe Dashboard)
```

Webhook configuré sur Stripe Dashboard pointant vers :
```
https://votre-app.vercel.app/api/webhook/stripe
```

## 🚨 Problèmes courants

### 1. Webhook reçoit 401/403

**Cause** : Middleware bloque la route

**Solution** : Exclure `/api/webhook/stripe` du middleware

```typescript
// src/middleware.ts
export const config = {
  matcher: [
    '/((?!api/webhook|_next/static|_next/image|favicon.ico).*)',
  ]
}
```

### 2. Signature invalide (400)

**Cause** : Mauvais `STRIPE_WEBHOOK_SECRET`

**Solution** : 
- Vérifier que le secret sur Vercel correspond au secret du webhook Stripe Dashboard
- Copier-coller soigneusement (pas d'espaces)

### 3. Webhook timeout

**Cause** : Traitement trop long (> 10s sur Vercel Free)

**Solution** : 
- Répondre 200 immédiatement
- Traiter en arrière-plan (queue, background job)

```typescript
export async function POST(req: Request) {
  // ... vérification signature ...

  // Répondre immédiatement
  const response = NextResponse.json({ received: true })

  // Traiter en arrière-plan (ne pas await)
  processWebhookAsync(event).catch(console.error)

  return response
}
```

### 4. Webhook appelé plusieurs fois

**Cause** : Stripe retry si pas de 200

**Solution** : 
- Toujours renvoyer 200 même en cas d'erreur traitée
- Implémenter l'idempotence (vérifier si déjà traité)

```typescript
// Exemple avec cache simple
const processedEvents = new Set<string>()

export async function POST(req: Request) {
  // ... vérification signature ...

  // Vérifier si déjà traité
  if (processedEvents.has(event.id)) {
    return NextResponse.json({ received: true, note: 'already processed' })
  }

  // Traiter
  await handleEvent(event)
  
  // Marquer comme traité
  processedEvents.add(event.id)

  return NextResponse.json({ received: true })
}
```

## 📚 Ressources

- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## ✅ Checklist finale

- [ ] Webhook créé sur Stripe Dashboard
- [ ] URL correcte : `https://VOTRE-APP.vercel.app/api/webhook/stripe`
- [ ] Événements sélectionnés : `checkout.session.completed`
- [ ] Signing secret copié
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Route middleware exclut `/api/webhook`
- [ ] Application redéployée
- [ ] Test avec "Send test webhook" réussi (200 OK)
- [ ] Test avec carte de test réussi
- [ ] Logs Stripe montrent 200 OK
- [ ] Logs Vercel montrent le traitement

---

**Fait avec ❤️ pour Tamagotcho**
