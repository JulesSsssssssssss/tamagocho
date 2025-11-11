---
sidebar_position: 1
---

# Endpoints API

Documentation des endpoints de l'API REST.

## 🔐 Authentification

### POST `/api/auth/sign-up`

Crée un nouveau compte utilisateur.

**Body** :
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optionnel
}
```

**Réponse** : `200 OK`
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2024-11-03T12:00:00Z"
  }
}
```

**Erreurs** :
- `400 Bad Request` : Email déjà utilisé
- `422 Unprocessable Entity` : Validation échouée

---

### POST `/api/auth/sign-in`

Connecte un utilisateur existant.

**Body** :
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse** : `200 OK`
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  },
  "session": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2024-11-03T12:00:00Z"
  }
}
```

**Erreurs** :
- `401 Unauthorized` : Identifiants incorrects

---

### POST `/api/auth/sign-out`

Déconnecte l'utilisateur actuel.

**Headers** :
```
Cookie: session=eyJhbGciOiJIUzI1NiIs...
```

**Réponse** : `200 OK`

---

## 🐾 Tamagotchis

### POST `/api/tamagotchis/tick`

Déclenche la dégradation naturelle de tous les Tamagotchis.

**Headers** : Aucun (endpoint public mais à rate-limiter)

**Réponse** : `200 OK`
```json
{
  "success": true,
  "updated": 15 // Nombre de Tamagotchis mis à jour
}
```

**Fréquence recommandée** : Toutes les 30 secondes

**Implémentation** :

```typescript
// app/api/tamagotchis/tick/route.ts
import { NextResponse } from 'next/server'
import { ApplyHealthDecayUseCase } from '@/application/use-cases/ApplyHealthDecayUseCase'
import { TamagotchiRepository } from '@/infrastructure/repositories/TamagotchiRepository'
import { connectDB } from '@/db'

export async function POST() {
  await connectDB()
  
  const repository = new TamagotchiRepository()
  const useCase = new ApplyHealthDecayUseCase(repository)
  
  await useCase.execute()
  
  return NextResponse.json({ success: true })
}
```

---

## 📊 Statistiques (Future)

### GET `/api/stats/user`

Récupère les statistiques globales de l'utilisateur.

**Headers** :
```
Cookie: session=eyJhbGciOiJIUzI1NiIs...
```

**Réponse** : `200 OK`
```json
{
  "totalMonsters": 5,
  "aliveMonsters": 4,
  "deadMonsters": 1,
  "averageLevel": 3.2,
  "totalExperience": 450
}
```

**Statut** : ⏳ Non implémenté

---

### GET `/api/stats/leaderboard`

Récupère le classement des joueurs.

**Query params** :
- `limit` : Nombre de résultats (défaut: 10)

**Réponse** : `200 OK`
```json
{
  "leaderboard": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "userName": "John Doe",
      "totalLevel": 25,
      "monsterCount": 5
    },
    // ...
  ]
}
```

**Statut** : ⏳ Non implémenté

---

## 🔒 Middleware d'authentification

Les routes protégées nécessitent un cookie de session valide.

```typescript
// middleware.ts
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()

  if (!session && request.nextUrl.pathname.startsWith('/api/monsters')) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  return NextResponse.next()
}
```

---

## 📝 Conventions

### Headers

Toutes les requêtes doivent inclure :

```
Content-Type: application/json
```

### Erreurs

Format standard des erreurs :

```json
{
  "error": "Message d'erreur",
  "code": "ERROR_CODE",
  "details": {} // optionnel
}
```

### Codes d'état HTTP

- `200 OK` : Succès
- `201 Created` : Ressource créée
- `400 Bad Request` : Données invalides
- `401 Unauthorized` : Non authentifié
- `403 Forbidden` : Permissions insuffisantes
- `404 Not Found` : Ressource introuvable
- `422 Unprocessable Entity` : Validation échouée
- `500 Internal Server Error` : Erreur serveur

---

Prochaine étape : [Server Actions](/docs/api/server-actions) 🚀
