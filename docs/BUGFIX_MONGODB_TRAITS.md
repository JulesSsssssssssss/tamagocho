# 🐛 Correctif - Bug de validation MongoDB

**Date**: 27 octobre 2025  
**Type**: Bug Fix  
**Sévérité**: 🔴 Critique (bloquait la création de monstres)  
**Statut**: ✅ Résolu

---

## 🔍 Description du problème

### Erreur rencontrée
```
Monster validation failed: traits: Cast to string failed for value "{
  bodyColor: '#FFE8B5',
  accentColor: '#FFD89C',
  ...
}" (type Object) at path "traits"
```

### Cause racine
Le champ `traits` dans le schéma MongoDB est défini comme `String`, mais la server action `createMonster` recevait un **objet JavaScript** (`MonsterTraits`) et l'envoyait directement à Mongoose sans le convertir en JSON string.

**Flow problématique** :
```
Formulaire → MonsterTraits (objet) → createMonster → MongoDB ❌
```

---

## ✅ Solution appliquée

### Modification du fichier
**`src/actions/monsters/monsters.actions.ts`**

**Avant** :
```typescript
export async function createMonster (monsterData: CreateMonsterFormValues): Promise<void> {
  await connectMongooseToDatabase()
  const session = await getCurrentSession()

  const monster = new Monster({
    ownerId: session.user.id,
    name: monsterData.name,
    traits: monsterData.traits, // ❌ Objet envoyé directement
    state: monsterData.state,
    level: monsterData.level
  })

  await monster.save()
  revalidatePath('/dashboard')
}
```

**Après** :
```typescript
export async function createMonster (monsterData: CreateMonsterFormValues): Promise<void> {
  await connectMongooseToDatabase()
  const session = await getCurrentSession()

  // ✅ Conversion des traits en JSON string (MongoDB attend une string)
  const traitsJson = typeof monsterData.traits === 'string' 
    ? monsterData.traits 
    : JSON.stringify(monsterData.traits)

  const monster = new Monster({
    ownerId: session.user.id,
    name: monsterData.name,
    traits: traitsJson, // ✅ String JSON envoyée
    state: monsterData.state,
    level: monsterData.level
  })

  await monster.save()
  revalidatePath('/dashboard')
}
```

**Flow corrigé** :
```
Formulaire → MonsterTraits (objet) → JSON.stringify → MongoDB ✅
```

---

## 🧪 Validation

### Vérifications effectuées

✅ **Schéma MongoDB** (`monster.model.ts`) :
```typescript
traits: {
  type: String, // ✅ Attend bien une string
  required: true
}
```

✅ **Type TypeScript** (`create-monster-form.ts`) :
```typescript
export interface CreateMonsterFormValues {
  traits: MonsterTraits // ✅ Objet correctement typé
}
```

✅ **Conversion sécurisée** :
- Si `traits` est déjà une string → pas de conversion
- Si `traits` est un objet → `JSON.stringify()`

✅ **Erreurs TypeScript** : 0 erreur

---

## 📊 Impact

### Avant le fix
- ❌ Impossible de créer un monstre depuis le Dashboard
- ❌ Erreur de validation MongoDB systématique
- ❌ Fonctionnalité principale bloquée

### Après le fix
- ✅ Création de monstres fonctionnelle
- ✅ Validation MongoDB réussie
- ✅ Données correctement stockées en JSON string
- ✅ Parsing JSON dans les composants (déjà implémenté dans `CreatureAvatar`)

---

## 🔗 Composants liés

### Lecture des traits (déjà compatible)
Le composant `CreatureAvatar` parse déjà correctement le JSON :

```typescript
// src/components/creature/creature-avatar.tsx
const parsedTraits = useMemo(() => {
  try {
    return typeof traits === 'string' 
      ? JSON.parse(traits) as MonsterTraits
      : traits
  } catch {
    console.error('Invalid traits JSON')
    return null
  }
}, [traits])
```

✅ Compatible avec le nouveau format

### Autres composants utilisant traits
- ✅ `MonsterCard` (Dashboard) - Parse déjà le JSON
- ✅ `PixelMonster` - Accepte un objet MonsterTraits
- ✅ `CreateMonsterForm` - Envoie un objet (conversion faite dans l'action)

---

## 📝 Recommandations

### Best practices appliquées
1. ✅ **Conversion centralisée** : La logique de stringification est dans la server action
2. ✅ **Type safety** : Les types TypeScript restent cohérents (`MonsterTraits` objet)
3. ✅ **Gestion d'erreur** : Vérification du type avant conversion
4. ✅ **Commentaires** : Explication de la conversion dans le code

### Points à surveiller
- ⚠️ **Consistency** : Toujours parser le JSON en lecture (déjà fait)
- ⚠️ **Validation** : S'assurer que le JSON est valide avant de le stocker
- ⚠️ **Migration** : Si des données existent déjà, vérifier leur format

---

## ✅ Checklist de résolution

- [x] Identifier la cause (objet vs string)
- [x] Implémenter la conversion JSON.stringify
- [x] Vérifier la compatibilité avec le schéma MongoDB
- [x] Valider les types TypeScript
- [x] Tester la création de monstre
- [x] Vérifier les composants de lecture
- [x] Documenter le fix

---

**Statut final** : ✅ **RÉSOLU**  
**Tests** : ✅ Création de monstre fonctionnelle  
**Type Safety** : ✅ Aucune erreur TypeScript  
**Performance** : ✅ Aucun impact (JSON.stringify très rapide)
