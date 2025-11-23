# Builder Architecture Documentation

Next.js admin application for managing all customer sites.

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **React:** 19.x
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + shadcn/ui
- **Data Fetching:** TanStack Query v5
- **State Management:** Zustand (editor state only)
- **Authentication:** JWT (same as API)
- **Forms:** React Hook Form + Zod

---

## Project Structure

```
builder/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # Auth routes (login, register)
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── (dashboard)/          # Main app routes (protected)
│   │   │   ├── layout.tsx        # Dashboard layout (sidebar, header)
│   │   │   ├── page.tsx          # Dashboard home
│   │   │   ├── tenants/          # Tenant management
│   │   │   ├── pages/            # Page list & editor
│   │   │   ├── posts/            # Blog post management
│   │   │   ├── assets/           # Media library
│   │   │   └── settings/         # Account settings
│   │   │
│   │   ├── api/                  # API routes (proxy to backend)
│   │   ├── layout.tsx            # Root layout
│   │   └── providers.tsx         # React Query & Zustand providers
│   │
│   ├── components/
│   │   ├── editor/               # Block editor components
│   │   │   ├── canvas/          # Main editing canvas
│   │   │   ├── panels/          # Sidebar panels
│   │   │   ├── toolbar/         # Top toolbar
│   │   │   ├── blocks/          # Block-specific editors
│   │   │   └── ui/              # Editor-specific UI
│   │   │
│   │   ├── layout/              # Layout components
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── breadcrumbs.tsx
│   │   │
│   │   ├── pages/               # Page management UI
│   │   │   ├── page-list.tsx
│   │   │   ├── page-card.tsx
│   │   │   └── page-filters.tsx
│   │   │
│   │   └── ui/                  # shadcn/ui components
│   │
│   ├── lib/
│   │   ├── api/                 # API client
│   │   │   ├── client.ts        # Base fetch wrapper
│   │   │   ├── pages.ts         # Pages endpoints
│   │   │   ├── tenants.ts       # Tenants endpoints
│   │   │   ├── assets.ts        # Assets endpoints
│   │   │   └── auth.ts          # Auth endpoints
│   │   │
│   │   ├── hooks/               # React Query hooks
│   │   │   ├── use-pages.ts
│   │   │   ├── use-tenants.ts
│   │   │   ├── use-assets.ts
│   │   │   └── use-auth.ts
│   │   │
│   │   ├── stores/              # Zustand stores
│   │   │   ├── editor-store.ts  # Editor state (blocks, selection, history)
│   │   │   ├── ui-store.ts      # UI state (panels, preview mode)
│   │   │   └── page-store.ts    # Current page metadata
│   │   │
│   │   ├── blocks/              # Shared from client (symlink or import)
│   │   │   └── types.ts
│   │   │
│   │   └── utils/               # Utility functions
│   │       ├── validation.ts
│   │       ├── formatting.ts
│   │       └── helpers.ts
│   │
│   └── styles/
│       └── globals.css
│
├── public/                        # Static assets
├── .env.local                     # Environment variables
├── next.config.ts                 # Next.js config
├── tailwind.config.ts             # Tailwind config
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependencies
```

---

## Data Fetching with TanStack Query

### Setup

```typescript
// src/app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

---

### API Client

```typescript
// src/lib/api/client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

class ApiError extends Error {
  constructor(
    public status: number,
    public data: any,
  ) {
    super(data.message || "An error occurred");
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include", // Send cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(response.status, error);
  }

  return response.json();
}
```

---

### Query Hooks

#### Pages Hooks

```typescript
// src/lib/hooks/use-pages.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi } from "@/lib/api/pages";
import type { Page, CreatePageDto, UpdatePageDto } from "@/types";

// Query Keys
export const pageKeys = {
  all: ["pages"] as const,
  lists: () => [...pageKeys.all, "list"] as const,
  list: (tenantId: string, filters?: any) =>
    [...pageKeys.lists(), tenantId, filters] as const,
  details: () => [...pageKeys.all, "detail"] as const,
  detail: (id: string) => [...pageKeys.details(), id] as const,
  bySlug: (tenantId: string, slug: string) =>
    [...pageKeys.all, "slug", tenantId, slug] as const,
};

// List Pages
export function usePages(tenantId: string, filters?: any) {
  return useQuery({
    queryKey: pageKeys.list(tenantId, filters),
    queryFn: () => pagesApi.list(tenantId, filters),
    enabled: !!tenantId,
  });
}

// Get Single Page
export function usePage(id: string) {
  return useQuery({
    queryKey: pageKeys.detail(id),
    queryFn: () => pagesApi.getById(id),
    enabled: !!id,
  });
}

// Create Page
export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePageDto) => pagesApi.create(data),
    onSuccess: (newPage) => {
      // Invalidate pages list
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });

      // Optimistically add to cache
      queryClient.setQueryData(pageKeys.detail(newPage.id), newPage);
    },
  });
}

// Update Page
export function useUpdatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePageDto }) =>
      pagesApi.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: pageKeys.detail(id) });

      // Snapshot previous value
      const previousPage = queryClient.getQueryData(pageKeys.detail(id));

      // Optimistically update
      queryClient.setQueryData(pageKeys.detail(id), (old: any) => ({
        ...old,
        ...data,
      }));

      return { previousPage };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousPage) {
        queryClient.setQueryData(pageKeys.detail(id), context.previousPage);
      }
    },
    onSettled: (data, error, { id }) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: pageKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });
}

// Delete Page
export function useDeletePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pagesApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
      queryClient.removeQueries({ queryKey: pageKeys.detail(id) });
    },
  });
}

// Publish Page
export function usePublishPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pagesApi.publish(id),
    onSuccess: (updatedPage) => {
      queryClient.setQueryData(pageKeys.detail(updatedPage.id), updatedPage);
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });
}

// Duplicate Page
export function useDuplicatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pagesApi.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });
}
```

---

#### Usage in Components

```typescript
// src/app/(dashboard)/pages/page.tsx
'use client'

import { usePages, useDeletePage } from '@/lib/hooks/use-pages'

export default function PagesListPage() {
  const tenantId = 'current-tenant' // Get from context or auth
  const { data: pages, isLoading, error } = usePages(tenantId)
  const deletePage = useDeletePage()

  const handleDelete = async (id: string) => {
    if (confirm('Delete this page?')) {
      await deletePage.mutateAsync(id)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {pages?.map((page) => (
        <div key={page.id}>
          <h3>{page.title}</h3>
          <button onClick={() => handleDelete(page.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
```

---

## State Management with Zustand

**Philosophy:** Use Zustand ONLY for client-side editor state. Use TanStack Query for ALL server data.

### Editor Store

```typescript
// src/lib/stores/editor-store.ts
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type { Block, Section } from "@/lib/blocks/types";

interface EditorState {
  // Current editing state
  sections: Section[];
  selectedBlockKey: string | null;
  hoveredBlockKey: string | null;

  // History (undo/redo)
  history: Section[][];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;

  // Drag & drop
  isDragging: boolean;
  draggedBlockKey: string | null;

  // Actions
  setSections: (sections: Section[]) => void;
  selectBlock: (key: string | null) => void;
  hoverBlock: (key: string | null) => void;
  updateBlock: (key: string, updates: Partial<Block>) => void;
  deleteBlock: (key: string) => void;
  duplicateBlock: (key: string) => void;
  moveBlock: (
    fromKey: string,
    toKey: string,
    position: "before" | "after",
  ) => void;
  undo: () => void;
  redo: () => void;
  startDragging: (key: string) => void;
  stopDragging: () => void;
  resetEditor: () => void;
}

export const useEditorStore = create<EditorState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      sections: [],
      selectedBlockKey: null,
      hoveredBlockKey: null,
      history: [],
      historyIndex: -1,
      canUndo: false,
      canRedo: false,
      isDragging: false,
      draggedBlockKey: null,

      // Actions
      setSections: (sections) => {
        const { history, historyIndex } = get();

        set({
          sections,
          // Add to history
          history: [...history.slice(0, historyIndex + 1), sections],
          historyIndex: historyIndex + 1,
          canUndo: true,
          canRedo: false,
        });
      },

      selectBlock: (key) => set({ selectedBlockKey: key }),

      hoverBlock: (key) => set({ hoveredBlockKey: key }),

      updateBlock: (key, updates) => {
        const { sections } = get();
        const newSections = updateBlockInSections(sections, key, updates);
        get().setSections(newSections);
      },

      deleteBlock: (key) => {
        const { sections } = get();
        const newSections = deleteBlockFromSections(sections, key);
        get().setSections(newSections);
        set({ selectedBlockKey: null });
      },

      duplicateBlock: (key) => {
        const { sections } = get();
        const newSections = duplicateBlockInSections(sections, key);
        get().setSections(newSections);
      },

      moveBlock: (fromKey, toKey, position) => {
        const { sections } = get();
        const newSections = moveBlockInSections(
          sections,
          fromKey,
          toKey,
          position,
        );
        get().setSections(newSections);
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          set({
            sections: history[historyIndex - 1],
            historyIndex: historyIndex - 1,
            canUndo: historyIndex > 1,
            canRedo: true,
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          set({
            sections: history[historyIndex + 1],
            historyIndex: historyIndex + 1,
            canUndo: true,
            canRedo: historyIndex < history.length - 2,
          });
        }
      },

      startDragging: (key) => set({ isDragging: true, draggedBlockKey: key }),

      stopDragging: () => set({ isDragging: false, draggedBlockKey: null }),

      resetEditor: () =>
        set({
          sections: [],
          selectedBlockKey: null,
          hoveredBlockKey: null,
          history: [],
          historyIndex: -1,
          canUndo: false,
          canRedo: false,
          isDragging: false,
          draggedBlockKey: null,
        }),
    })),
  ),
);

// Helper functions
function updateBlockInSections(
  sections: Section[],
  key: string,
  updates: Partial<Block>,
): Section[] {
  // Recursively find and update block
  return sections.map((section) => ({
    ...section,
    blocks: updateBlockInBlocks(section.blocks, key, updates),
  }));
}

function updateBlockInBlocks(
  blocks: Block[],
  key: string,
  updates: Partial<Block>,
): Block[] {
  return blocks.map((block) => {
    if (block._key === key) {
      return { ...block, ...updates };
    }
    if ("blocks" in block && block.blocks) {
      return {
        ...block,
        blocks: updateBlockInBlocks(block.blocks, key, updates),
      };
    }
    return block;
  });
}

// ... more helper functions for delete, duplicate, move
```

---

### UI Store

```typescript
// src/lib/stores/ui-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  // Panels
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  activePanel: "blocks" | "layers" | "settings" | null;

  // Preview
  previewMode: "desktop" | "tablet" | "mobile";

  // Theme
  darkMode: boolean;

  // Actions
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  setActivePanel: (panel: "blocks" | "layers" | "settings" | null) => void;
  setPreviewMode: (mode: "desktop" | "tablet" | "mobile") => void;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      leftPanelOpen: true,
      rightPanelOpen: true,
      activePanel: "blocks",
      previewMode: "desktop",
      darkMode: false,

      toggleLeftPanel: () =>
        set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
      toggleRightPanel: () =>
        set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
      setActivePanel: (panel) => set({ activePanel: panel }),
      setPreviewMode: (mode) => set({ previewMode: mode }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: "builder-ui-storage",
    },
  ),
);
```

---

## Editor Architecture

### Main Editor Page

```typescript
// src/app/(dashboard)/pages/[id]/edit/page.tsx
'use client'

import { usePage, useUpdatePage } from '@/lib/hooks/use-pages'
import { useEditorStore } from '@/lib/stores/editor-store'
import { useEffect } from 'react'
import { EditorCanvas } from '@/components/editor/canvas'
import { EditorToolbar } from '@/components/editor/toolbar'
import { BlocksPanel } from '@/components/editor/panels/blocks-panel'
import { SettingsPanel } from '@/components/editor/panels/settings-panel'

export default function PageEditorPage({ params }: { params: { id: string } }) {
  const { data: page, isLoading } = usePage(params.id)
  const updatePage = useUpdatePage()
  const { setSections, sections } = useEditorStore()

  // Load page content into editor
  useEffect(() => {
    if (page?.content?.sections) {
      setSections(page.content.sections)
    }
  }, [page, setSections])

  // Auto-save (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (sections.length > 0) {
        updatePage.mutate({
          id: params.id,
          data: {
            content: { sections },
          },
        })
      }
    }, 2000)

    return () => clearTimeout(timeout)
  }, [sections, params.id, updatePage])

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="editor-layout">
      <EditorToolbar />
      <div className="editor-content">
        <BlocksPanel />
        <EditorCanvas />
        <SettingsPanel />
      </div>
    </div>
  )
}
```

---

### Editor Canvas

```typescript
// src/components/editor/canvas/editor-canvas.tsx
'use client'

import { useEditorStore } from '@/lib/stores/editor-store'
import { SectionRenderer } from './section-renderer'
import { BlockOverlay } from './block-overlay'
import { DropZone } from './drop-zone'

export function EditorCanvas() {
  const sections = useEditorStore((state) => state.sections)
  const selectedBlockKey = useEditorStore((state) => state.selectedBlockKey)

  return (
    <div className="editor-canvas">
      {sections.map((section, index) => (
        <div key={section._key} className="section-wrapper">
          <DropZone position="before" sectionIndex={index} />
          <SectionRenderer section={section} />
          <DropZone position="after" sectionIndex={index} />
        </div>
      ))}

      {selectedBlockKey && <BlockOverlay blockKey={selectedBlockKey} />}
    </div>
  )
}
```

---

### Blocks Panel

```typescript
// src/components/editor/panels/blocks-panel.tsx
'use client'

import { useEditorStore } from '@/lib/stores/editor-store'
import { generateKey } from '@/lib/utils'

const BLOCK_TYPES = [
  { type: 'heading-block', label: 'Heading', icon: 'Type' },
  { type: 'text-block', label: 'Text', icon: 'AlignLeft' },
  { type: 'button-block', label: 'Button', icon: 'MousePointer' },
  { type: 'image-block', label: 'Image', icon: 'Image' },
  { type: 'card-block', label: 'Card', icon: 'Square' },
  // ... all 24+ block types
]

export function BlocksPanel() {
  const { sections, setSections } = useEditorStore()

  const addBlock = (type: string) => {
    const newBlock = {
      _key: generateKey(),
      _type: type,
      data: getDefaultDataForType(type),
    }

    // Add to first section (or create section if none)
    const newSections = [...sections]
    if (newSections.length === 0) {
      newSections.push({
        _key: generateKey(),
        _type: 'section',
        blocks: [newBlock],
      })
    } else {
      newSections[0].blocks.push(newBlock)
    }

    setSections(newSections)
  }

  return (
    <div className="blocks-panel">
      <h3>Add Blocks</h3>
      <div className="block-grid">
        {BLOCK_TYPES.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => addBlock(type)}
            className="block-card"
          >
            <Icon name={icon} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

---

## Authentication

```typescript
// src/lib/hooks/use-auth.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";

export function useAuth() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.me(),
    retry: false,
    staleTime: Infinity,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authApi.login(credentials),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
```

---

## Keyboard Shortcuts

```typescript
// src/components/editor/keyboard-shortcuts.tsx
"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/lib/stores/editor-store";
import { useUpdatePage } from "@/lib/hooks/use-pages";

export function KeyboardShortcuts({ pageId }: { pageId: string }) {
  const { undo, redo, deleteBlock, selectedBlockKey } = useEditorStore();
  const updatePage = useUpdatePage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Z - Undo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Cmd/Ctrl + Shift + Z - Redo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      // Cmd/Ctrl + S - Save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        const sections = useEditorStore.getState().sections;
        updatePage.mutate({ id: pageId, data: { content: { sections } } });
      }

      // Delete/Backspace - Delete selected block
      if ((e.key === "Delete" || e.key === "Backspace") && selectedBlockKey) {
        e.preventDefault();
        deleteBlock(selectedBlockKey);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, deleteBlock, selectedBlockKey, pageId, updatePage]);

  return null;
}
```

---

## Next Steps

1. ✅ Document architecture (DONE)
2. ⏳ Create package.json
3. ⏳ Set up Next.js app structure
4. ⏳ Install TanStack Query + Zustand
5. ⏳ Build API hooks
6. ⏳ Build editor stores
7. ⏳ Build editor UI
8. ⏳ Add keyboard shortcuts
9. ⏳ Add drag & drop
10. ⏳ Test with API
