# 🎨 Design System Tamagotcho - Pixel-Art Gaming

## 🎯 Vision

Un design system cohérent inspiré des jeux rétro et du pixel-art, avec une touche moderne et accessible.

---

## 🌈 Palette de Couleurs

### Couleurs Primaires

#### Moccaccino (Rouge/Orange)
```
moccaccino-50:  #fef3f2
moccaccino-100: #fee4e2
moccaccino-200: #fecdca
moccaccino-300: #fda29b
moccaccino-400: #f97066
moccaccino-500: #f7533c  ← PRIMARY
moccaccino-600: #e02d3c
moccaccino-700: #bc1b36
moccaccino-800: #991932
moccaccino-900: #7f1d2e
```

**Utilisation :** Boutons primaires, accents, actions importantes

#### Lochinvar (Vert/Turquoise)
```
lochinvar-50:  #f0fdfa
lochinvar-100: #ccfbf1
lochinvar-200: #99f6e4
lochinvar-300: #5eead4
lochinvar-400: #2dd4bf
lochinvar-500: #469086  ← SECONDARY
lochinvar-600: #0d9488
lochinvar-700: #0f766e
lochinvar-800: #115e59
lochinvar-900: #134e4a
```

**Utilisation :** Boutons secondaires, succès, confirmations

#### Fuchsia-Blue (Violet/Bleu)
```
fuchsia-blue-50:  #faf5ff
fuchsia-blue-100: #f3e8ff
fuchsia-blue-200: #e9d5ff
fuchsia-blue-300: #d8b4fe
fuchsia-blue-400: #c084fc
fuchsia-blue-500: #8f72e0  ← TERTIARY
fuchsia-blue-600: #9333ea
fuchsia-blue-700: #7e22ce
fuchsia-blue-800: #6b21a8
fuchsia-blue-900: #581c87
```

**Utilisation :** Highlights, badges, effets spéciaux

### Couleurs Système

- **Succès :** `green-500` (#22c55e)
- **Danger :** `red-500` (#ef4444)
- **Warning :** `yellow-500` (#eab308)
- **Info :** `blue-500` (#3b82f6)

---

## 🖌️ Typographie

### Police
- **Principale :** Geist Sans (Next.js)
- **Monospace :** Geist Mono (pour chiffres, codes)

### Échelle
```
text-xs:   0.75rem  (12px)
text-sm:   0.875rem (14px)
text-base: 1rem     (16px)
text-lg:   1.125rem (18px)
text-xl:   1.25rem  (20px)
text-2xl:  1.5rem   (24px)
text-3xl:  1.875rem (30px)
text-4xl:  2.25rem  (36px)
```

### Poids
- **Regular :** `font-normal` (400)
- **Medium :** `font-medium` (500)
- **Semibold :** `font-semibold` (600)
- **Bold :** `font-bold` (700)
- **Black :** `font-black` (900) - Pour titres

---

## 🎭 Composants

### PixelButton

**Style Pixel-Art Gaming**

```tsx
<PixelButton variant="primary" icon="🎮" size="lg">
  Jouer
</PixelButton>
```

**Variantes :**
- `primary` : Moccaccino (actions principales)
- `secondary` : Lochinvar (actions secondaires)
- `success` : Vert (confirmations)
- `danger` : Rouge (suppressions)
- `warning` : Jaune (avertissements)
- `ghost` : Blanc (actions discrètes)

**Tailles :**
- `sm` : Petits boutons
- `md` : Taille standard
- `lg` : Boutons importants
- `xl` : Call-to-action

**Caractéristiques :**
- Bordure : `border-4`
- Coins : `rounded-xl`
- Ombre : `shadow-lg`
- Hover : `scale-105`
- Active : `scale-95`
- Transition : `duration-200`

### PixelInput

**Style Pixel-Art Gaming**

```tsx
<PixelInput
  label="Email"
  type="email"
  icon="📧"
  value={email}
  error={errors.email}
  onChangeText={setEmail}
/>
```

**Caractéristiques :**
- Bordure : `border-3`
- Coins : `rounded-xl`
- Focus : `border-moccaccino-500` + `ring-4`
- Erreur : `border-red-500` + `bg-red-50`
- Label : Font-bold avec emoji
- Placeholder : `text-gray-400`

---

## 📐 Espacements

### Padding/Margin
```
p-2:  0.5rem  (8px)
p-3:  0.75rem (12px)
p-4:  1rem    (16px)
p-6:  1.5rem  (24px)
p-8:  2rem    (32px)
p-12: 3rem    (48px)
```

### Gap
```
gap-2: 0.5rem  (8px)
gap-3: 0.75rem (12px)
gap-4: 1rem    (16px)
gap-6: 1.5rem  (24px)
```

---

## 🎨 Bordures

### Épaisseurs
- `border-2` : Légère (2px)
- `border-3` : Standard (3px) - **Inputs**
- `border-4` : Épaisse (4px) - **Boutons, Cards**

### Rayons
- `rounded-lg` : 0.5rem (8px) - Petits éléments
- `rounded-xl` : 0.75rem (12px) - **Standard**
- `rounded-2xl` : 1rem (16px) - Cards moyennes
- `rounded-3xl` : 1.5rem (24px) - Grandes cards

---

## ✨ Effets

### Shadows
```css
shadow-sm:  0 1px 2px rgba(0,0,0,0.05)
shadow:     0 1px 3px rgba(0,0,0,0.1)
shadow-md:  0 4px 6px rgba(0,0,0,0.1)
shadow-lg:  0 10px 15px rgba(0,0,0,0.1)  ← Standard
shadow-xl:  0 20px 25px rgba(0,0,0,0.1)
shadow-2xl: 0 25px 50px rgba(0,0,0,0.25)
```

### Transformations
```css
hover:scale-105    /* Boutons, cards cliquables */
active:scale-95    /* Feedback clic */
transition-all     /* Smooth animations */
duration-200       /* Rapide (200ms) */
duration-300       /* Standard (300ms) */
```

### Dégradés
```css
/* Primaire */
bg-gradient-to-br from-moccaccino-500 to-moccaccino-600

/* Secondaire */
bg-gradient-to-br from-lochinvar-500 to-lochinvar-600

/* Backgrounds */
bg-gradient-to-br from-moccaccino-50 via-fuchsia-blue-50 to-lochinvar-50
```

---

## 🎮 Patterns

### Card Pixel-Art
```tsx
<div className="bg-white border-4 border-moccaccino-300 rounded-2xl shadow-2xl p-8 hover:scale-[1.02] transition-all">
  {/* Barre supérieure colorée */}
  <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-moccaccino-500 via-fuchsia-blue-500 to-lochinvar-500" />
  
  {/* Coins décoratifs */}
  <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-moccaccino-500 rounded-tl" />
  {/* ... autres coins */}
  
  {/* Contenu */}
</div>
```

### Notification/Alert
```tsx
<div className="bg-red-100 border-4 border-red-500 rounded-xl shadow-2xl p-6">
  <div className="flex items-start gap-3">
    <span className="text-3xl">⚠️</span>
    <p className="text-red-700 font-bold">Message</p>
  </div>
</div>
```

### Hero Section
```tsx
<div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-12 border-4 border-moccaccino-500 shadow-[0_0_30px_rgba(247,83,60,0.3)]">
  {/* Grille rétro */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40" />
  
  {/* Pixels coins */}
  <div className="absolute top-2 left-2 w-4 h-4 bg-moccaccino-500 rounded-sm" style={{ imageRendering: 'pixelated' }} />
  
  {/* Contenu */}
</div>
```

---

## 🎯 Principes

### 1. Cohérence
- Toujours utiliser les composants UI standardisés
- Respecter la palette de couleurs
- Utiliser les mêmes espacements

### 2. Accessibilité
- Contraste minimum WCAG AA
- Focus states visibles
- Labels pour screen readers
- Tailles de clic >= 44px

### 3. Performance
- Éviter les animations lourdes
- Utiliser `transform` au lieu de `top/left`
- Limiter les `backdrop-blur`

### 4. Responsive
- Mobile-first
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Tailles flexibles

---

## 📦 Usage

### Import
```tsx
import { PixelButton, PixelInput } from '@/components/ui'
```

### Exemple complet
```tsx
<form className="space-y-4">
  <PixelInput
    label="Email"
    type="email"
    icon="📧"
    value={email}
    onChangeText={setEmail}
    error={errors.email}
  />
  
  <PixelButton
    variant="primary"
    size="lg"
    icon="🎮"
    fullWidth
    onClick={handleSubmit}
  >
    Se connecter
  </PixelButton>
</form>
```

---

## 🚀 Évolution

### Prochains composants
- [ ] PixelCard
- [ ] PixelModal
- [ ] PixelBadge
- [ ] PixelToast
- [ ] PixelTabs
- [ ] PixelSelect

---

**Version :** 1.0.0  
**Date :** 31 octobre 2025  
**Maintenu par :** Équipe Tamagotcho
