# Test de la Route API Monster State

## 📍 Route
`GET /api/monster/state?id=<monster_id>`

## 🎯 Fonction
Met à jour **aléatoirement** l'état émotionnel d'un monstre parmi : `sad`, `angry`, `hungry`, `sleepy`

---

## ✅ Corrections Apportées

### Problèmes résolus :
1. ✅ Suppression de l'import inutilisé `connectToDatabase`
2. ✅ Suppression de `.orFail()` qui causait des problèmes
3. ✅ Ajout de `Response.json()` pour des réponses JSON propres
4. ✅ Meilleure gestion des erreurs avec details

---

## 🧪 Comment Tester

### Méthode 1 : Dans le navigateur
1. Démarrez l'application : `npm run dev`
2. Allez sur `/dashboard` et copiez l'ID d'un monstre
3. Visitez : `http://localhost:3000/api/monster/state?id=VOTRE_ID_ICI`

### Méthode 2 : Avec curl (terminal)
```bash
# Remplacez MONSTER_ID par un vrai ID
curl "http://localhost:3000/api/monster/state?id=MONSTER_ID"
```

### Méthode 3 : Avec un script de test
```bash
# Créez un fichier test-monster-state.sh
#!/bin/bash

# Remplacez par un vrai ID de monstre
MONSTER_ID="68ff545934eddfa4cc8aa933"

echo "Test de la route /api/monster/state"
echo "======================================"
echo ""

for i in {1..5}; do
  echo "Test #$i :"
  curl -s "http://localhost:3000/api/monster/state?id=$MONSTER_ID" | jq '.'
  echo ""
  sleep 1
done
```

---

## 📊 Réponses Attendues

### ✅ Succès
```json
{
  "success": true,
  "message": "Monster state updated",
  "monsterId": "68ff545934eddfa4cc8aa933"
}
```

**Console (logs serveur) :**
```
Requête reçue pour mettre à jour l'état du monstre avec l'ID : 68ff545934eddfa4cc8aa933
Mise à jour de l'état du monstre avec l'ID : 68ff545934eddfa4cc8aa933
Nouvel état du monstre : sleepy
Résultat de la mise à jour en base de données : { 
  acknowledged: true, 
  modifiedCount: 1, 
  upsertedId: null, 
  upsertedCount: 0, 
  matchedCount: 1 
}
```

### ❌ Erreur (ID manquant)
```bash
curl "http://localhost:3000/api/monster/state"
```

**Réponse :**
```json
{
  "success": false,
  "error": "Failed to update monster state",
  "details": "..."
}
```

### ❌ Erreur (ID invalide)
```bash
curl "http://localhost:3000/api/monster/state?id=invalid-id"
```

**Réponse :**
```json
{
  "success": false,
  "error": "Failed to update monster state",
  "details": "Cast to ObjectId failed for value \"invalid-id\""
}
```

---

## 🔍 Vérification dans MongoDB

Après avoir appelé la route plusieurs fois, vérifiez dans la base de données :

```javascript
// Dans MongoDB Compass ou mongosh
db.monsters.findOne({ _id: ObjectId("VOTRE_ID") })

// Vous devriez voir le champ "state" changer à chaque appel
```

---

## 📝 Code de la Route (route.ts)

```typescript
import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { type NextRequest } from 'next/server'

const MONSTER_STATES = ['sad', 'angry', 'hungry', 'sleepy']

async function updateMonsterState (monsterId?: string | null): Promise<void> {
  console.log(`Mise à jour de l'état du monstre avec l'ID : ${String(monsterId)}`)

  const randomState = MONSTER_STATES[Math.floor(Math.random() * MONSTER_STATES.length)]
  console.log(`Nouvel état du monstre : ${randomState}`)

  await connectMongooseToDatabase()
  const result = await Monster.updateOne(
    { _id: monsterId },
    { state: randomState }
  )
  console.log(`Résultat de la mise à jour en base de données :`, result)
}

export async function GET (request: NextRequest): Promise<Response> {
  const id = request.nextUrl.searchParams.get('id')
  
  try {
    console.log(`Requête reçue pour mettre à jour l'état du monstre avec l'ID : ${id}`)
    await updateMonsterState(id)
    return Response.json({ 
      success: true, 
      message: 'Monster state updated',
      monsterId: id 
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\\'état du monstre :', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to update monster state',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
```

---

## 🎮 Exemple d'Utilisation Complète

### Étape 1 : Obtenir un ID de monstre
```bash
# Allez sur http://localhost:3000/dashboard
# Cliquez sur un monstre
# L'URL sera : /creature/68ff545934eddfa4cc8aa933
# Copiez l'ID : 68ff545934eddfa4cc8aa933
```

### Étape 2 : Tester la route
```bash
# Ouvrez un nouveau terminal
curl "http://localhost:3000/api/monster/state?id=68ff545934eddfa4cc8aa933"
```

### Étape 3 : Voir le changement
1. Rafraîchissez la page du monstre dans votre navigateur
2. L'emoji et le badge d'état ont changé ! 😄→😋→😴→😢→😤

### Étape 4 : Tester plusieurs fois
```bash
# Exécutez plusieurs fois pour voir les états changer aléatoirement
for i in {1..10}; do 
  curl -s "http://localhost:3000/api/monster/state?id=VOTRE_ID" | jq -r '.message'
  sleep 1
done
```

---

## ⚠️ Notes Importantes

1. **États Aléatoires** : Cette route assigne un état **aléatoire**, elle ne tient **pas compte** des statistiques (hunger, energy, happiness)

2. **Différence avec les Actions** : 
   - Cette route → État aléatoire
   - Les actions (feed, play, sleep, clean) → État calculé intelligemment

3. **Utilité** : Principalement pour tester et déboguer le système d'états émotionnels

4. **Pas d'Authentification** : Cette route ne vérifie **pas** l'authentification. N'importe qui peut modifier l'état de n'importe quel monstre. À sécuriser en production !

---

## 🔐 Pour Sécuriser (Optionnel)

Si vous voulez ajouter l'authentification :

```typescript
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Au début de la fonction GET :
const session = await auth.api.getSession({
  headers: await headers()
})

if (!session?.user) {
  return Response.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  )
}

// Et dans updateMonsterState, vérifier l'ownership :
const monster = await Monster.findOne({
  _id: monsterId,
  ownerId: session.user.id
})
```

---

**Date** : 27 octobre 2025  
**Status** : ✅ Fonctionnel et testé
