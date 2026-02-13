# Clean Architecture Migration - TODO List

## Phase 1: Folder Structure Setup
- [x] Create domain layer folders (entities, interfaces, types)
- [x] Create application layer folders (services, dto)
- [x] Create infrastructure layer folders (api, repositories, storage)
- [x] Create shared layer folders (utils, constants, assets)

## Phase 2: Domain Layer
- [x] Create Game entity
- [x] Create Session entity
- [x] Create IGameRepository interface
- [x] Create ISessionRepository interface
- [x] Consolidate and move types to domain/types

## Phase 3: Infrastructure Layer
- [x] Refactor API client (Axios setup)
- [x] Create GameRepository implementation
- [x] Create SessionRepository implementation
- [x] Create Storage service for localStorage

## Phase 4: Application Layer
- [x] Create GameService (start, submit, etc.)
- [ ] Create ScoreService (optional)

## Phase 5: Presentation Layer Refactoring
- [x] Update session store to use new repositories
- [x] Refactor useApi composable (keep for backward compat)
- [x] Clean up constants

## Phase 6: View Migration (Example)
- [ ] Migrate MemoryGameView as example
- [ ] Migrate AutomationSpotterView
- [ ] Migrate remaining views

## Phase 7: Cleanup
- [x] Remove duplicate types
- [x] Remove unused files
- [x] Update imports across project

## Architecture Summary

### New Clean Architecture Structure

```
src/
├── domain/                    # Domain Layer (Business Logic)
│   ├── entities/
│   │   ├── Game.ts           # Game entity with state management
│   │   └── Session.ts       # Session entity
│   ├── interfaces/
│   │   └── index.ts         # Repository interfaces
│   └── types/
│       └── index.ts         # Consolidated types (MinigameId, GameState, etc.)
│
├── application/               # Application Layer (Use Cases)
│   └── services/
│       └── GameService.ts   # Game lifecycle management
│
├── infrastructure/            # Infrastructure Layer (External Services)
│   ├── api/
│   │   └── ApiClient.ts     # Axios HTTP client
│   ├── repositories/
│   │   ├── GameRepository.ts    # Game API operations
│   │   └── SessionRepository.ts # Session management
│   └── storage/
│       └── LocalStorageService.ts # localStorage wrapper
│
├── stores/                    # Presentation - State Management
│   └── session.ts           # Pinia store (refactored)
│
├── composables/               # Presentation - Vue Composables
│   ├── useGame.ts            # Legacy wrapper (backward compat)
│   ├── useGame.types.ts      # Legacy types
│   ├── useApi.ts             # API composable (backward compat)
│   └── useTimer.ts           # Timer utility
│
├── components/                # Presentation - UI Components
├── views/                     # Presentation - Page Views
└── utils/                     # Shared utilities
    └── constants.ts         # Updated with MinigameId enum
```

### Key Improvements

1. **Domain Layer**: Clean entities with business logic
2. **Application Layer**: Use cases separated from UI
3. **Infrastructure Layer**: Repositories abstract API calls
4. **Backward Compatibility**: Legacy composables still work

