---
sidebar_position: 2
---

# Authentification

Le système d'authentification utilise **Better Auth**, une solution moderne pour Next.js.

## 🔐 Configuration

### Installation

```bash
npm install better-auth
```

### Configuration Better Auth

```typescript
// src/lib/auth.ts
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'

export const auth = betterAuth({
  database: mongodbAdapter(process.env.MONGODB_URI!),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
  },
})
```

---

## 📝 Inscription

### Formulaire d'inscription

```tsx
<SignUpForm />
```

**Champs** :
- `email` : Email (validé avec Zod)
- `password` : Mot de passe (min 8 caractères)
- `name` : Nom (optionnel)

### Validation

```typescript
const signUpSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  name: z.string().optional(),
})
```

### Server Action

```typescript
'use server'

export async function signUp(data: SignUpFormValues) {
  const result = await auth.api.signUp.email({
    email: data.email,
    password: data.password,
    name: data.name,
  })

  if (!result.user) {
    throw new Error('Échec de l\'inscription')
  }

  redirect('/dashboard')
}
```

---

## 🔑 Connexion

### Formulaire de connexion

```tsx
<SignInForm />
```

**Champs** :
- `email` : Email
- `password` : Mot de passe

### Server Action

```typescript
'use server'

export async function signIn(data: SignInFormValues) {
  const result = await auth.api.signIn.email({
    email: data.email,
    password: data.password,
  })

  if (!result.user) {
    throw new Error('Identifiants incorrects')
  }

  redirect('/dashboard')
}
```

---

## 🚪 Déconnexion

### Hook de déconnexion

```tsx
// hooks/use-logout.ts
import { useRouter } from 'next/navigation'

export function useLogout() {
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    router.push('/')
  }

  return { logout }
}
```

**Usage** :

```tsx
function Header() {
  const { logout } = useLogout()

  return (
    <button onClick={logout}>
      Déconnexion
    </button>
  )
}
```

---

## 🛡️ Protection des routes

### Middleware

```typescript
// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth()

  const isAuthPage = request.nextUrl.pathname.startsWith('/sign-in') ||
                     request.nextUrl.pathname.startsWith('/sign-up')

  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') ||
                          request.nextUrl.pathname.startsWith('/creature')

  // Rediriger vers /sign-in si non authentifié
  if (isProtectedPage && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // Rediriger vers /dashboard si déjà connecté
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## 👤 Récupération de la session

### Côté serveur

```typescript
// Dans une Server Component ou Server Action
import { auth } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in')
  }

  return (
    <div>
      <h1>Bienvenue {session.user.name}</h1>
    </div>
  )
}
```

### Côté client

```tsx
// Client Component
'use client'

import { useSession } from '@/hooks/use-session'

export function UserProfile() {
  const { session, loading } = useSession()

  if (loading) return <div>Chargement...</div>

  if (!session) return null

  return <div>Connecté en tant que {session.user.email}</div>
}
```

---

## 🔒 Sécurité

### Hachage des mots de passe

Better Auth utilise **bcrypt** automatiquement pour hasher les mots de passe.

```typescript
// Géré automatiquement par Better Auth
const hashedPassword = await bcrypt.hash(password, 10)
```

### CSRF Protection

Better Auth intègre une protection CSRF automatique.

### Session Cookies

Les sessions sont stockées dans des **cookies HTTP-only** sécurisés.

```typescript
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
}
```

---

## 🗃️ Base de données

### Collection `users`

```typescript
{
  _id: ObjectId,
  email: string,
  name?: string,
  password: string, // Hashé avec bcrypt
  createdAt: Date,
  updatedAt: Date,
}
```

### Collection `sessions`

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  token: string,
  expiresAt: Date,
  createdAt: Date,
}
```

---

## 📱 Page de connexion

### Route

```
/sign-in
```

### Composants

```tsx
// app/sign-in/page.tsx
import { SignInForm } from '@/components/forms/sign-in-form'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Connexion</h1>
        <SignInForm />
        <p className="mt-4 text-center">
          Pas encore de compte ?{' '}
          <a href="/sign-up" className="text-blue-500">
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  )
}
```

---

## ✅ Bonnes pratiques

1. **Validation côté serveur** : Toujours valider les données avec Zod
2. **Messages d'erreur génériques** : Ne pas révéler si l'email existe ou non
3. **Rate limiting** : Limiter les tentatives de connexion
4. **HTTPS uniquement** : En production, forcer HTTPS
5. **Mots de passe forts** : Imposer une longueur minimale et complexité

---

Prochaine étape : [Dashboard](/docs/features/dashboard) 🚀
