# Builder Features Roadmap

Complete feature list for a professional page builder experience.

**See also:** [Enterprise Platform Roadmap](../enterprise-platform.md) for full system overview.

---

## Current State Assessment

### What Exists
- [x] Block editors (24 types)
- [x] Drag-and-drop blocks
- [x] Drag-and-drop sections
- [x] Section settings (background, padding)
- [x] Responsive preview (desktop/tablet/mobile)
- [x] Draft/publish workflow
- [x] Basic autosave
- [x] Media library
- [x] SEO editor

### Critical Missing Features
- [ ] Undo/Redo
- [ ] History panel
- [ ] Keyboard shortcuts
- [ ] Copy/paste blocks
- [ ] Command palette
- [ ] Block search
- [ ] Zoom controls

---

## Feature Categories

### 1. Core Editing (Priority: CRITICAL)

#### 1.1 Undo/Redo System
**Status:** Not implemented

**Requirements:**
- Cmd/Ctrl+Z for undo
- Cmd/Ctrl+Shift+Z for redo
- Visual undo/redo buttons in toolbar
- Support for all operations:
  - Block content changes
  - Block add/remove
  - Block reorder
  - Section add/remove
  - Section reorder
  - Settings changes

**Implementation:**
```typescript
// lib/stores/history-store.ts
interface HistoryState {
  past: PageState[];
  present: PageState;
  future: PageState[];

  // Actions
  push: (state: PageState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
}
```

**UI Components:**
- Toolbar buttons (undo/redo with disabled state)
- Keyboard shortcut handler
- History dropdown showing recent changes

#### 1.2 History Panel
**Status:** Not implemented

**Requirements:**
- Show list of all changes in session
- Each entry shows:
  - Action type (edit, add, delete, move)
  - Target (block type, section name)
  - Timestamp
- Click to restore to that point
- Clear distinction between saved/unsaved states

**UI:**
```
┌─────────────────────────────┐
│ History                  ✕ │
├─────────────────────────────┤
│ ○ Changed heading text      │
│   2 minutes ago             │
├─────────────────────────────┤
│ ○ Added Image block         │
│   5 minutes ago             │
├─────────────────────────────┤
│ ● Saved                     │
│   10 minutes ago            │
├─────────────────────────────┤
│ ○ Deleted Button block      │
│   12 minutes ago            │
└─────────────────────────────┘
```

#### 1.3 Copy/Paste Blocks
**Status:** Not implemented

**Requirements:**
- Cmd/Ctrl+C to copy selected block
- Cmd/Ctrl+V to paste
- Cmd/Ctrl+D to duplicate in place
- Copy across sections
- Copy across pages (clipboard persistence)
- Paste with or without styles

**Implementation:**
```typescript
interface ClipboardStore {
  copiedBlock: Block | null;
  copiedSection: Section | null;

  copyBlock: (block: Block) => void;
  copySection: (section: Section) => void;
  paste: (targetSectionId: string, position: number) => Block;
  canPaste: boolean;
}
```

### 2. Navigation & Discovery (Priority: HIGH)

#### 2.1 Command Palette
**Status:** Not implemented

**Requirements:**
- Cmd/Ctrl+K to open
- Search for:
  - Actions (add block, publish, save, undo)
  - Blocks (jump to specific block)
  - Pages (switch pages)
  - Settings (open specific setting)
- Keyboard navigation
- Recent commands

**UI:**
```
┌─────────────────────────────────────────┐
│ 🔍 Search commands...                   │
├─────────────────────────────────────────┤
│ ACTIONS                                 │
│   → Add Heading block                   │
│   → Add Image block                     │
│   → Save page                           │
│   → Publish page                        │
├─────────────────────────────────────────┤
│ SETTINGS                                │
│   → Open SEO settings                   │
│   → Open page settings                  │
└─────────────────────────────────────────┘
```

#### 2.2 Block Search / Jump To
**Status:** Not implemented

**Requirements:**
- Quick search to find blocks on page
- Filter by block type
- Jump to block location
- Highlight matching blocks

#### 2.3 Layers Panel (Page Structure)
**Status:** Not implemented

**Requirements:**
- Tree view of page structure
- Section → Container → Block hierarchy
- Drag to reorder in tree
- Click to select/scroll to
- Show/hide blocks
- Lock blocks
- Rename sections

**UI:**
```
┌─────────────────────────────┐
│ Layers                   ✕ │
├─────────────────────────────┤
│ ▼ Section: Hero             │
│   ├─ Heading: "Welcome"     │
│   ├─ Text: "Lorem ipsum..." │
│   └─ Button: "Get Started"  │
├─────────────────────────────┤
│ ▼ Section: Features         │
│   ├─ Grid                   │
│   │   ├─ Card: "Feature 1"  │
│   │   ├─ Card: "Feature 2"  │
│   │   └─ Card: "Feature 3"  │
│   └─ Button: "Learn More"   │
└─────────────────────────────┘
```

### 3. Keyboard Shortcuts (Priority: HIGH)

#### 3.1 Essential Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl+S | Save |
| Cmd/Ctrl+Z | Undo |
| Cmd/Ctrl+Shift+Z | Redo |
| Cmd/Ctrl+C | Copy block |
| Cmd/Ctrl+V | Paste block |
| Cmd/Ctrl+D | Duplicate block |
| Cmd/Ctrl+K | Command palette |
| Delete/Backspace | Delete selected block |
| Escape | Deselect / Close panel |
| Tab | Next block |
| Shift+Tab | Previous block |
| Arrow keys | Navigate blocks |
| Enter | Edit selected block |

#### 3.2 Advanced Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl+Shift+P | Publish |
| Cmd/Ctrl+E | Toggle preview mode |
| Cmd/Ctrl+1/2/3 | Switch to desktop/tablet/mobile |
| Cmd/Ctrl+/ | Show shortcuts help |
| Cmd/Ctrl+. | Toggle right panel |
| Cmd/Ctrl+, | Open settings |
| Cmd/Ctrl+Shift+S | Save as template |

### 4. Canvas Controls (Priority: MEDIUM)

#### 4.1 Zoom Controls
**Status:** Not implemented

**Requirements:**
- Zoom in/out (25%, 50%, 75%, 100%, 125%, 150%)
- Fit to screen
- Cmd/Ctrl+0 to reset to 100%
- Cmd/Ctrl++ to zoom in
- Cmd/Ctrl+- to zoom out
- Mouse wheel zoom (with modifier key)

#### 4.2 Preview Mode
**Status:** Partially implemented (responsive only)

**Requirements:**
- Full preview without editing UI
- Toggle between edit and preview
- Preview in new tab option
- Share preview link

#### 4.3 Grid/Guide Overlays
**Status:** Not implemented

**Requirements:**
- Show grid overlay
- Show spacing guides
- Snap to grid
- Show alignment guides when dragging

### 5. Selection & Multi-Select (Priority: MEDIUM)

#### 5.1 Block Selection
**Status:** Single selection only

**Requirements:**
- Click to select
- Shift+Click for range select
- Cmd/Ctrl+Click for multi-select
- Drag to box select
- Select all in section
- Selection count indicator

#### 5.2 Bulk Actions
**Status:** Not implemented

**Requirements:**
- Delete multiple blocks
- Move multiple blocks
- Duplicate multiple blocks
- Group into container
- Change shared properties

### 6. Templates & Reusability (Priority: MEDIUM)

#### 6.1 Block Templates
**Status:** Not implemented

**Requirements:**
- Save block as template
- Save section as template
- Template library browser
- Apply template
- Edit template (update all instances)

#### 6.2 Style Presets
**Status:** Not implemented

**Requirements:**
- Save styling as preset
- Apply preset to blocks
- Share presets across pages

### 7. Collaboration (Priority: LOW - Phase 2)

#### 7.1 Comments
- Add comments to blocks
- Reply threads
- Resolve comments
- Notification system

#### 7.2 Version History
- See all saved versions
- Compare versions
- Restore previous version
- Version notes/descriptions

#### 7.3 Real-time Collaboration
- See other editors' cursors
- Conflict resolution
- Presence indicators

### 8. Accessibility (Priority: HIGH)

#### 8.1 Keyboard Navigation
- Full keyboard accessibility
- Focus indicators
- Skip links
- ARIA labels

#### 8.2 Screen Reader Support
- Announce actions
- Describe UI state
- Navigate by landmarks

---

## Implementation Priority

### Phase 1: Core Editing (Week 1-2)
1. **Undo/Redo system** - Most requested, most impactful
2. **Keyboard shortcuts** - Power users need this
3. **Copy/paste blocks** - Basic editing necessity

### Phase 2: Navigation (Week 2-3)
4. **Command palette** - Quick access to everything
5. **Layers panel** - Visual structure navigation
6. **History panel** - Audit trail and recovery

### Phase 3: Canvas (Week 3-4)
7. **Zoom controls** - Detailed editing
8. **Preview mode** - See without UI
9. **Multi-select** - Bulk operations

### Phase 4: Templates (Week 4-5)
10. **Block templates** - Reusability
11. **Section templates** - Quick page building
12. **Style presets** - Consistency

---

## Technical Architecture

### History Store (Zustand)
```typescript
// lib/stores/history-store.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface HistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  description: string;
  state: PageState;
}

interface HistoryStore {
  entries: HistoryEntry[];
  currentIndex: number;
  maxEntries: number;

  // Actions
  record: (action: string, description: string, state: PageState) => void;
  undo: () => PageState | null;
  redo: () => PageState | null;
  jumpTo: (index: number) => PageState | null;

  // Getters
  canUndo: () => boolean;
  canRedo: () => boolean;
  getCurrentEntry: () => HistoryEntry | null;
}
```

### Keyboard Handler
```typescript
// lib/hooks/use-keyboard-shortcuts.ts
import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : true;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (e.key.toLowerCase() === shortcut.key.toLowerCase() &&
            ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}
```

### Command Palette Component
```typescript
// components/editor/command-palette.tsx
import { Command } from 'cmdk'; // or build custom

interface CommandItem {
  id: string;
  label: string;
  icon?: React.ComponentType;
  shortcut?: string;
  action: () => void;
  category?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  // Cmd+K to open
  useKeyboardShortcuts([
    { key: 'k', ctrl: true, action: () => setOpen(true) }
  ]);

  return (
    <Command.Dialog open={open} onOpenChange={setOpen}>
      <Command.Input placeholder="Search commands..." />
      <Command.List>
        <Command.Group heading="Actions">
          {/* Action items */}
        </Command.Group>
        <Command.Group heading="Blocks">
          {/* Block items */}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
```

---

## Success Metrics

- **Undo usage:** Track how often users undo (indicates mistakes being caught)
- **Keyboard shortcut adoption:** % of actions via keyboard
- **Time to find block:** Reduced with layers/search
- **Template usage:** Sections saved and reused
- **Error recovery:** Users restoring from history

---

**Last Updated:** 2025-12-30
**Status:** Planning
