# Testing Strategy

Enterprise testing strategy for the Agency Platform. This document outlines testing standards, infrastructure, and best practices.

---

## Test Infrastructure

### Builder (Next.js Admin)

**Framework:** Vitest with React Testing Library

```
builder/
├── vitest.config.ts      # Test configuration
├── vitest.setup.ts       # Test setup and mocks
├── tsconfig.test.json    # TypeScript config for tests
└── lib/
    ├── stores/
    │   ├── auth-store.test.ts
    │   ├── admin-store.test.ts
    │   ├── tenants-store.test.ts
    │   └── ui-store.test.ts
    └── hooks/
        └── query-keys.test.ts
```

**Dependencies:**

- `vitest` - Test runner
- `@vitejs/plugin-react` - React support
- `@testing-library/react` - Component testing
- `@testing-library/jest-dom` - DOM assertions
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - Browser environment

**Configuration:**

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
  },
});
```

### API (NestJS Backend)

**Framework:** Jest (NestJS default)

```
api/
├── jest.config.js
└── src/
    └── modules/
        └── [module]/
            └── [module].service.spec.ts
```

### Client (Next.js Frontend)

**Status:** Test infrastructure pending

---

## Testing Pyramid

```
        ┌─────────────┐
        │    E2E      │  ← Playwright (planned)
        │   Tests     │
       ┌┴─────────────┴┐
       │  Integration   │  ← Component + API tests
       │    Tests       │
      ┌┴───────────────┴┐
      │    Unit Tests    │  ← Stores, hooks, utilities
      │                  │
      └──────────────────┘
```

### Unit Tests (Current Focus)

**Purpose:** Test individual functions, stores, and hooks in isolation

**Coverage:**

- Zustand stores (auth, admin, tenants, UI)
- Query key factories
- Utility functions
- Pure business logic

**Characteristics:**

- Fast execution (<100ms per test)
- No external dependencies
- Deterministic results
- High code coverage target (80%+)

### Integration Tests (Next Phase)

**Purpose:** Test component interactions and API integrations

**Planned Coverage:**

- Page editor component tree
- Form submission flows
- API client with mocked endpoints
- React Query caching behavior

### E2E Tests (Future)

**Purpose:** Test complete user flows end-to-end

**Planned Coverage:**

- Authentication flow (login, logout, session)
- Page creation and editing
- Publish workflow
- Media upload
- E-commerce checkout

---

## Test Patterns

### Store Testing

```typescript
describe("StoreName", () => {
  beforeEach(() => {
    // Reset store state before each test
    useStore.setState(initialState);
  });

  describe("action", () => {
    it("should describe expected behavior", () => {
      const { action } = useStore.getState();
      action(input);

      const { result } = useStore.getState();
      expect(result).toBe(expected);
    });
  });
});
```

### Query Key Testing

```typescript
describe("queryKeys", () => {
  it("should generate consistent keys", () => {
    const key1 = queryKeys.resource.detail("id-1");
    const key2 = queryKeys.resource.detail("id-1");
    expect(key1).toEqual(key2);
  });

  it("should support hierarchical invalidation", () => {
    const key = queryKeys.admin.users.all();
    expect(key[0]).toBe("admin");
  });
});
```

### Hook Testing (with React Query)

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useHook", () => {
  it("should fetch data", async () => {
    const { result } = renderHook(() => useHook("id"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
```

---

## Test Commands

```bash
# Run all tests
pnpm test

# Run builder tests
pnpm --filter builder test

# Run tests in watch mode
pnpm --filter builder test:watch

# Run with coverage
pnpm --filter builder test:coverage

# Run full verification (format, lint, typecheck, test)
pnpm verify
```

---

## Mocking Strategies

### Next.js Navigation

```typescript
// vitest.setup.ts
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useParams: () => ({}),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));
```

### API Client

```typescript
vi.mock("@/lib/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));
```

### Zustand Store

```typescript
// For testing components that use stores
vi.mock("@/lib/stores/auth-store", () => ({
  useAuthStore: vi.fn(() => ({
    user: mockUser,
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  })),
}));
```

---

## Best Practices

### Test Organization

1. **One file per module** - `module.test.ts` alongside `module.ts`
2. **Descriptive test names** - Describe behavior, not implementation
3. **Arrange-Act-Assert** - Clear test structure
4. **Reset state** - Use `beforeEach` to ensure isolation

### Test Quality

1. **Test behavior, not implementation** - Focus on what, not how
2. **Avoid test interdependence** - Each test should run in isolation
3. **Use meaningful assertions** - Be specific about expected outcomes
4. **Keep tests fast** - Unit tests should complete in milliseconds

### Mock Usage

1. **Mock at boundaries** - External services, APIs, browser APIs
2. **Don't mock what you own** - Test real implementations when possible
3. **Reset mocks between tests** - Use `vi.clearAllMocks()` in `beforeEach`

---

## Test Coverage Goals

| Category   | Current | Target |
| ---------- | ------- | ------ |
| Stores     | 100%    | 100%   |
| Hooks      | ~50%    | 80%    |
| Components | 0%      | 70%    |
| Utils      | 0%      | 90%    |
| API        | 0%      | 70%    |

---

## Current Test Inventory

### Builder Tests (97 total)

| File                  | Tests | Description            |
| --------------------- | ----- | ---------------------- |
| auth-store.test.ts    | 19    | Authentication state   |
| admin-store.test.ts   | 29    | Admin panel state      |
| tenants-store.test.ts | 14    | Tenant CRUD operations |
| ui-store.test.ts      | 13    | UI state management    |
| query-keys.test.ts    | 22    | Query key factory      |

---

## Roadmap

### Phase 1: Unit Tests ✅ COMPLETE

- Store tests
- Query key tests
- Utility function tests

### Phase 2: Integration Tests (Next)

- Component tests with mocked data
- Form interaction tests
- Page editor integration tests

### Phase 3: E2E Tests (Future)

- Playwright setup
- Critical path tests
- Visual regression tests

---

**Last Updated:** 2025-12-08
**Version:** 1.0
