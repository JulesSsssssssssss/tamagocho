# Copilot Instructions - Tamagotcho Project

## Project Overview
This is a Next.js 15.5.4 project using the App Router architecture, built for a school project (My Digital School). It's a Tamagotchi-style application using React 19, TypeScript, and Tailwind CSS 4 with custom color palette.

## Tech Stack & Key Dependencies
- **Framework**: Next.js 15.5.4 with App Router and Turbopack
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS 4 with custom color themes
- **Fonts**: Geist Sans & Geist Mono from Google Fonts
- **Linting**: ts-standard for TypeScript linting

## Development Workflow
```bash
# Development with Turbopack (faster builds)
npm run dev

# Build with Turbopack
npm run build

# Linting with auto-fix
npm run lint
```

## Architecture Patterns

### File Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable React components
- `src/services/` - Service layer (currently empty, planned for Tamagotchi logic)
- `specs/` - Project specifications (PDF documentation)

### Component Patterns
Components follow a functional approach with explicit TypeScript interfaces:

```tsx
// Example from src/components/button.tsx
function Button ({
  children = 'Click me',
  onClick,
  size = 'md',
  variant = 'primary',
  disabled = false
}: {
  children: React.ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'ghost' | 'underline' | 'outline'
  disabled?: boolean
}): React.ReactNode
```

### Styling Conventions
- **Custom Color Palette**: Uses `moccaccino`, `lochinvar`, and `fuchsia-blue` color scales defined in `globals.css`
- **Component Styling**: Utility functions for size/variant mapping (see `getSize()` and `getVariant()` in Button component)
- **Responsive Design**: Mobile-first approach with `sm:` breakpoints
- **Animations**: Consistent `transition-all duration-300` and `active:scale-95` for interactive elements

### Import Patterns
- Use `@/` alias for src imports: `import Button from '@/components/button'`
- Explicit return type annotations: `(): React.ReactNode`
- CSS imports in layout: `import './globals.css'`

## Project-Specific Guidelines

### Component Development
- **Size Variants**: Use `sm | md | lg | xl` pattern for consistent sizing
- **Visual Variants**: Follow `primary | ghost | underline | outline` pattern
- **Disabled States**: Always handle disabled styling separately from hover states
- **Default Props**: Provide sensible defaults in destructuring

### Color Usage Notes
- Primary brand color: `moccaccino-500` (#f7533c)
- Secondary accent: `lochinvar-500` (#469086) 
- Tertiary accent: `fuchsia-blue-500` (#8f72e0)
- Use color-50 variants for subtle backgrounds, color-700+ for emphasis

### TypeScript Configuration
- **Strict Mode**: All strict TypeScript rules enabled
- **Path Mapping**: `@/*` resolves to `./src/*`
- **Target**: ES2017 for compatibility
- **JSX**: Preserve mode for Next.js processing

## Programming Principles & Architecture

### SOLID Principles (APPLICATION SYSTÉMATIQUE OBLIGATOIRE)

#### S - Single Responsibility Principle (SRP)
- **Règle**: Chaque classe/composant/fonction a UNE SEULE raison de changer
- **Application**:
  - Séparer la logique UI de la logique métier
  - Un composant = une responsabilité visuelle
  - Un service = une responsabilité métier
  - Un hook = une responsabilité de gestion d'état
- **Exemples**:
  - ✅ `Button` s'occupe uniquement du rendu visuel
  - ✅ `TamagotchiService` s'occupe uniquement de la logique du jeu
  - ❌ Pas de logique métier dans les composants React
  - ❌ Pas de manipulation DOM directe dans les services

#### O - Open/Closed Principle (OCP)
- **Règle**: Ouvert à l'extension, fermé à la modification
- **Application**:
  - Utiliser la composition plutôt que l'héritage
  - Props pour les variations de comportement
  - Patterns Strategy/Factory pour extensibilité
  - Types union pour les variants (`'primary' | 'ghost' | ...`)
- **Exemples**:
  - ✅ Ajouter un variant via props sans modifier le composant
  - ✅ Injecter des dépendances via constructeur/props
  - ❌ Modifier le code existant pour ajouter une fonctionnalité

#### L - Liskov Substitution Principle (LSP)
- **Règle**: Les sous-types doivent être substituables à leurs types de base
- **Application**:
  - Respecter les contrats d'interface
  - Les composants dérivés ne doivent pas casser les attentes
  - Polymorphisme respectueux des signatures
- **Exemples**:
  - ✅ `IconButton extends Button` doit accepter les mêmes props
  - ✅ Les implémentations d'interface respectent le contrat
  - ❌ Ne pas lancer d'erreur si le type parent ne le fait pas

#### I - Interface Segregation Principle (ISP)
- **Règle**: Plusieurs interfaces spécifiques valent mieux qu'une générale
- **Application**:
  - Props interfaces focalisées et minimales
  - Pas de props inutilisées dans les composants
  - Composer les interfaces complexes à partir de petites
- **Exemples**:
  ```typescript
  // ✅ BON: Interfaces séparées
  interface Clickable { onClick: () => void }
  interface Styleable { className?: string }
  interface ButtonProps extends Clickable, Styleable { ... }
  
  // ❌ MAUVAIS: Interface fourre-tout
  interface ComponentProps { onClick?, className?, onHover?, ... }
  ```

#### D - Dependency Inversion Principle (DIP)
- **Règle**: Dépendre d'abstractions, pas de concrétions
- **Application**:
  - Injecter les services via props/context
  - Définir des interfaces pour les dépendances
  - Utiliser des factories pour l'instanciation
  - Inverser le contrôle (IoC)
- **Exemples**:
  ```typescript
  // ✅ BON: Injection de dépendance
  interface IGameService { ... }
  function GameComponent({ gameService }: { gameService: IGameService }) {}
  
  // ❌ MAUVAIS: Couplage fort
  function GameComponent() {
    const service = new TamagotchiService() // Instanciation directe
  }
  ```

### Clean Code Standards (RÈGLES STRICTES)

#### Nommage
- **Variables/Fonctions**: camelCase descriptif (`getUserById`, `isAuthenticated`)
- **Classes/Composants**: PascalCase (`TamagotchiService`, `MonsterCard`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_HEALTH`, `DEFAULT_TIMEOUT`)
- **Interfaces**: PascalCase avec préfixe `I` optionnel (`IGameService` ou `GameService`)
- **Types**: PascalCase (`ButtonVariant`, `GameState`)
- **Fichiers**: kebab-case pour utils, PascalCase pour composants
- **Règle**: Le nom doit révéler l'intention sans commentaire

#### Fonctions
- **Taille**: Maximum 20 lignes (idéalement 5-10)
- **Paramètres**: Maximum 3 (utiliser un objet au-delà)
- **Un seul niveau d'abstraction par fonction**
- **Pas d'effets de bord cachés**
- **Préférer les fonctions pures**
- **Exemples**:
  ```typescript
  // ✅ BON: Pure, focalisée, descriptive
  function calculateHealth(current: number, damage: number): number {
    return Math.max(0, current - damage)
  }
  
  // ❌ MAUVAIS: Effets de bord, trop longue, nom vague
  function update(x: number) {
    // 30 lignes de code...
    globalState.value = x // Effet de bord
  }
  ```

#### Commentaires
- **Préférer le code auto-documenté aux commentaires**
- **Commenter le "pourquoi", pas le "quoi"**
- **JSDoc pour les APIs publiques uniquement**
- **Supprimer le code commenté (utiliser Git)**

#### Gestion d'erreur
- **Utiliser des types Error personnalisés**
- **Fail-fast: valider tôt, échouer tôt**
- **Pas de catch vide**
- **Logger avec contexte**
- **Exemple**:
  ```typescript
  // ✅ BON
  class GameError extends Error {
    constructor(message: string, public code: string) {
      super(message)
    }
  }
  
  try {
    validateInput(data)
    return processGame(data)
  } catch (error) {
    logger.error('Game processing failed', { error, data })
    throw new GameError('Invalid game state', 'GAME_001')
  }
  ```

#### Formatage
- **Indentation**: 2 espaces (TypeScript standard)
- **Lignes**: Maximum 100 caractères
- **Organisation**: Déclarer avant utiliser
- **Ordre**: public → protected → private
- **Imports**: Groupés et triés (external → internal → relative)

### Clean Architecture Layers (STRUCTURE OBLIGATOIRE)

#### Layer 1: Domain (Core Business Logic)
- **Localisation**: `src/domain/` ou `src/services/domain/`
- **Contenu**: Entities, Value Objects, Domain Services, Interfaces
- **Règles**:
  - AUCUNE dépendance externe (pas de React, Next.js, DB)
  - Logique métier pure
  - Interfaces pour les abstractions
- **Exemple**:
  ```typescript
  // src/domain/entities/Tamagotchi.ts
  export class Tamagotchi {
    constructor(
      private id: string,
      private health: number,
      private hunger: number
    ) {}
    
    feed(amount: number): void {
      this.hunger = Math.max(0, this.hunger - amount)
    }
    
    isAlive(): boolean {
      return this.health > 0
    }
  }
  ```

#### Layer 2: Application (Use Cases)
- **Localisation**: `src/application/` ou `src/use-cases/`
- **Contenu**: Use cases, DTOs, Application Services
- **Règles**:
  - Orchestration de la logique métier
  - Pas de détails d'implémentation
  - Dépend uniquement du Domain
- **Exemple**:
  ```typescript
  // src/application/use-cases/FeedTamagotchi.ts
  export class FeedTamagotchiUseCase {
    constructor(private repo: ITamagotchiRepository) {}
    
    async execute(id: string, foodAmount: number): Promise<void> {
      const tamagotchi = await this.repo.findById(id)
      tamagotchi.feed(foodAmount)
      await this.repo.save(tamagotchi)
    }
  }
  ```

#### Layer 3: Infrastructure (Technical Details)
- **Localisation**: `src/infrastructure/`
- **Contenu**: Repositories, API clients, DB access, External services
- **Règles**:
  - Implémente les interfaces du Domain
  - Détails techniques (HTTP, DB, etc.)
  - Peut dépendre de librairies externes
- **Exemple**:
  ```typescript
  // src/infrastructure/repositories/TamagotchiRepository.ts
  export class TamagotchiRepository implements ITamagotchiRepository {
    async findById(id: string): Promise<Tamagotchi> {
      const data = await db.query('SELECT * FROM tamagotchis WHERE id = ?', [id])
      return new Tamagotchi(data.id, data.health, data.hunger)
    }
  }
  ```

#### Layer 4: Presentation (UI)
- **Localisation**: `src/components/`, `src/app/`
- **Contenu**: React components, Pages, Hooks
- **Règles**:
  - Aucune logique métier
  - Appelle les Use Cases via injection
  - Gestion de l'UI et des états visuels uniquement
- **Exemple**:
  ```typescript
  // src/components/TamagotchiView.tsx
  export function TamagotchiView({ 
    useCase 
  }: { 
    useCase: FeedTamagotchiUseCase 
  }) {
    const handleFeed = async () => {
      await useCase.execute(id, 10)
    }
    return <Button onClick={handleFeed}>Feed</Button>
  }
  ```

#### Dependency Flow (RÈGLE ABSOLUE)
```
Presentation → Application → Domain
Infrastructure → Application → Domain

JAMAIS: Domain → Application
JAMAIS: Domain → Infrastructure
JAMAIS: Application → Presentation
```

### Code Organization Rules (STRUCTURE PROJET)

#### Structure de dossiers
```
src/
├── domain/               # Entités, Value Objects, Interfaces
│   ├── entities/
│   ├── value-objects/
│   └── services/
├── application/          # Use Cases, DTOs
│   ├── use-cases/
│   └── dtos/
├── infrastructure/       # Implémentations techniques
│   ├── repositories/
│   ├── api/
│   └── db/
├── presentation/         # UI (ou directement components/)
│   ├── components/
│   ├── hooks/
│   └── pages/
└── shared/              # Utilitaires partagés
    ├── types/
    ├── constants/
    └── utils/
```

#### Barrel Exports (index.ts)
- **Utiliser** pour exposer les APIs publiques de chaque module
- **Exemple**:
  ```typescript
  // src/domain/entities/index.ts
  export { Tamagotchi } from './Tamagotchi'
  export { Monster } from './Monster'
  export type { ITamagotchiRepository } from './ITamagotchiRepository'
  ```

#### Type Safety (RÈGLES STRICTES)
- **Pas de `any`** (utiliser `unknown` si nécessaire)
- **Interfaces explicites** pour toutes les props
- **Types pour les retours de fonction**
- **Enums ou Union Types** pour les valeurs limitées
- **Exemple**:
  ```typescript
  // ✅ BON
  interface UserProps {
    name: string
    age: number
  }
  function getUser(id: string): Promise<UserProps> { ... }
  
  // ❌ MAUVAIS
  function getUser(id: any): any { ... }
  ```

#### Error Boundaries & Validation
- **Validation Zod** pour les inputs externes
- **Error Boundaries React** pour les composants
- **Try/Catch** dans les Use Cases
- **Custom Errors** pour chaque domaine

### Checklist Avant Commit
- [ ] Chaque classe/fonction a UNE responsabilité (SRP)
- [ ] Code extensible sans modification (OCP)
- [ ] Interfaces respectées (LSP)
- [ ] Props minimales et focalisées (ISP)
- [ ] Dépendances injectées (DIP)
- [ ] Fonctions < 20 lignes
- [ ] Noms descriptifs sans commentaire
- [ ] Aucun `any` type
- [ ] Dépendances pointent vers le Domain
- [ ] Tests unitaires pour la logique métier
- [ ] Linting passé (`npm run lint`)

### Anti-Patterns à ÉVITER ABSOLUMENT
❌ **Logique métier dans les composants React**
❌ **Import de composants dans le Domain**
❌ **Instanciation directe (new) dans les composants**
❌ **Fonctions > 30 lignes**
❌ **Props avec plus de 5 paramètres**
❌ **Type `any`**
❌ **Catch vide**
❌ **Variables globales mutables**
❌ **Commentaires qui expliquent le code**
❌ **Duplication de code (DRY)**

## Next Steps / Incomplete Areas
- `src/services/` directory is empty - likely for Tamagotchi game logic
- Layout uses generic "Create Next App" metadata - needs project-specific updates
- Only basic Button component exists - UI component library needs expansion

## File References
- **Main Page**: `src/app/page.tsx` - Shows Button component variations
- **Component Example**: `src/components/button.tsx` - Reference for component patterns
- **Styling**: `src/app/globals.css` - Custom color definitions and theme setup