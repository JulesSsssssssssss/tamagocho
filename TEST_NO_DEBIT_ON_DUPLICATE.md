# 🧪 Test Rapide - Vérification Anti-Doublons Sans Débit

## Test à effectuer IMMÉDIATEMENT

### Préparation
1. Notez votre solde actuel dans le wallet
2. Allez sur `/shop`

### Test 1 : Achat Normal (doit débiter)
1. Achetez un nouvel item pour un monstre
2. ✅ **Attendu** : Notification verte "Achat réussi !"
3. ✅ **Attendu** : Solde diminué du prix de l'item

### Test 2 : Tentative de Doublon (NE DOIT PAS débiter) ⚠️
1. **Notez votre solde actuel**
2. Essayez d'acheter **le même item** pour **le même monstre**
3. ✅ **Attendu** : Notification jaune "Item déjà possédé"
4. ✅ **CRITIQUE** : **Solde inchangé** (pas de débit)

### Test 3 : Vérification Wallet
1. Rechargez la page `/dashboard`
2. Vérifiez que votre solde est correct
3. ✅ Le solde doit être : `solde_initial - prix_item_test1`
4. ❌ Si le solde est inférieur → BUG (double débit)

## Résultat du Correctif

### Avant (❌)
```
Solde : 1000 TC
Achat item A (100 TC) → Solde : 900 TC ✅
Réachat item A → Solde : 800 TC ❌ (débité à tort)
Message : "Item déjà possédé"
```

### Après (✅)
```
Solde : 1000 TC
Achat item A (100 TC) → Solde : 900 TC ✅
Réachat item A → Solde : 900 TC ✅ (PAS de débit)
Message : "Item déjà possédé"
```

## Si le bug persiste

1. Vérifiez que vous êtes en mode développement
2. Redémarrez le serveur : `npm run dev`
3. Videz le cache du navigateur
4. Retestez la séquence

## Code Modifié

**Fichier** : `src/app/api/shop/purchase/route.ts`

**Lignes 106-132** : Ordre des opérations corrigé
- ✅ Vérification `hasItem()` AVANT débit
- ✅ Vérification solde AVANT débit
- ✅ Débit UNIQUEMENT si tout est OK
