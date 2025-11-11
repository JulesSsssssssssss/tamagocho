# Guide de Test - Système d'Achat d'Items

## ✅ Vérifications Préliminaires

### 1. Vérifier votre solde actuel

```bash
node scripts/check-player-balance.js
```

Résultat attendu :
```
📊 Soldes des joueurs:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 User ID: [votre user id]
💰 Coins: [votre solde] TC
🎮 Monstres créés: [nombre]
──────────────────────────────────────────────────
```

### 2. Lancer l'application

```bash
npm run dev
```

Ouvrir : `http://localhost:3000`

## 🧪 Scénarios de Test

### Test 1 : Achat réussi avec solde suffisant

**Prérequis** : Avoir au moins 50 TC

1. Se connecter à l'application
2. Aller sur `/shop`
3. Vérifier que votre solde s'affiche correctement dans le header
4. Sélectionner un item **Commun** (50 TC) comme "Casquette Basique"
5. Cliquer sur "Acheter"
6. Sélectionner un monstre dans le modal
7. Confirmer l'achat

**Résultat attendu** :
- ✅ Message de succès
- ✅ Solde mis à jour automatiquement (- 50 TC)
- ✅ Item équipé sur le monstre
- ✅ Pas d'erreur dans la console

### Test 2 : Tentative d'achat avec solde insuffisant

**Prérequis** : Avoir moins de 250 TC

1. Aller sur `/shop`
2. Sélectionner un item **Épique** (250 TC) comme "Couronne Royale"
3. Cliquer sur "Acheter"

**Résultat attendu** :
- ✅ Alert affichée : "Solde insuffisant !"
- ✅ Modal ne s'ouvre PAS
- ✅ Solde inchangé

### Test 3 : Vérifier la persistance

1. Acheter un item
2. Rafraîchir la page (F5)
3. Vérifier le solde dans le header

**Résultat attendu** :
- ✅ Le solde reste correct après rafraîchissement
- ✅ L'item acheté est toujours équipé sur le monstre

### Test 4 : Achats multiples

1. Acheter "Casquette Basique" (50 TC) → Solde - 50
2. Acheter "Lunettes de Soleil" (75 TC) → Solde - 75
3. Acheter "Baskets Confortables" (100 TC) → Solde - 100

**Résultat attendu** :
- ✅ Solde diminue correctement à chaque achat
- ✅ Chaque item est équipé dans sa catégorie respective
- ✅ Les items de même catégorie se remplacent

## 🔍 Vérification en Base de Données

### Vérifier le solde dans MongoDB

```bash
node scripts/check-player-balance.js
```

Le solde affiché doit correspondre exactement au solde visible dans l'application.

### Console du navigateur

Ouvrir la console (F12) et vérifier :
- Pas d'erreur 400 ou 500
- Les logs de succès : `✅ [TEST MODE] Item ... acheté pour ... TC`

## 🐛 Dépannage

### Problème : "Solde insuffisant" alors que j'ai assez

**Solution** :
1. Vérifier le solde réel : `node scripts/check-player-balance.js`
2. Rafraîchir la page `/shop` (F5)
3. Vérifier que le solde affiché correspond

### Problème : Le solde ne se met pas à jour

**Solution** :
1. Ouvrir la console du navigateur
2. Vérifier la réponse de l'API : chercher `remainingBalance`
3. Si `remainingBalance` est présent, c'est un problème de synchro React
4. Rafraîchir la page

### Problème : Erreur 500 lors de l'achat

**Solution** :
1. Vérifier les logs du serveur Next.js
2. Vérifier la connexion MongoDB
3. S'assurer que le monstre sélectionné vous appartient

## ✅ Checklist Finale

- [ ] Les achats fonctionnent avec solde suffisant
- [ ] Les achats échouent proprement avec solde insuffisant
- [ ] Le solde se met à jour automatiquement après achat
- [ ] Le solde persiste après rafraîchissement de page
- [ ] Les items s'équipent correctement sur les monstres
- [ ] Pas d'erreur dans la console navigateur
- [ ] Pas d'erreur dans la console serveur

## 📊 Résumé des Prix de Test

| Catégorie | Rareté | Prix |
|-----------|--------|------|
| Chapeau | Commun | 50 TC |
| Chapeau | Rare | 125 TC |
| Chapeau | Épique | 250 TC |
| Chapeau | Légendaire | 500 TC |
| Lunettes | Commun | 75 TC |
| Lunettes | Rare | 187 TC |
| Lunettes | Épique | 375 TC |
| Lunettes | Légendaire | 750 TC |
| Chaussures | Commun | 100 TC |
| Chaussures | Rare | 250 TC |
| Chaussures | Épique | 500 TC |
| Chaussures | Légendaire | 1000 TC |
