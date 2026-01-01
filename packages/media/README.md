# @enterprise/media

Enterprise-grade media components and library for the agency platform. Designed for extensibility to support future ad management, social media, and email marketing integrations.

## Installation

```bash
pnpm add @enterprise/media
```

## Features

- **Image Component** - Lazy loading, blur placeholders (BlurHash), skeleton loading, error states
- **Video Component** - Custom controls, YouTube/Vimeo embeds, poster images, captions
- **AspectRatio** - Consistent aspect ratio containers for media
- **Lightbox** - Full-screen image viewer with zoom, navigation, and keyboard controls
- **Media Library** - Context providers for selection, upload queue, and library state
- **React Query Hooks** - CRUD operations for media and folders with caching
- **Upload System** - Single and batch uploads with progress tracking
- **Bulk Operations** - Move, delete, and tag multiple items
- **Utilities** - File validation, format helpers, video URL parsing, BlurHash decoding

## Usage

### Image Component

```tsx
import { Image } from '@enterprise/media/primitives';

// Basic usage
<Image src="/photo.jpg" alt="Photo" width={800} height={600} />

// With aspect ratio
<Image src="/hero.jpg" alt="Hero" aspectRatio="16:9" />

// With blur placeholder
<Image
  src="/photo.jpg"
  alt="Photo"
  blurHash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
  loadingStyle="blur"
/>

// Circle avatar
<Image src="/avatar.jpg" alt="User" variant="circle" width={100} height={100} />

// Priority loading (above the fold)
<Image src="/hero.jpg" alt="Hero" priority />
```

### Video Component

```tsx
import { Video } from '@enterprise/media/primitives';

// With multiple sources
<Video
  sources={[
    { src: '/video.mp4', type: 'video/mp4' },
    { src: '/video.webm', type: 'video/webm' },
  ]}
  poster="/poster.jpg"
/>

// Single source
<Video src="/video.mp4" poster="/poster.jpg" />

// YouTube embed
<Video youtubeUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />

// Vimeo embed
<Video vimeoUrl="https://vimeo.com/123456789" />

// With captions
<Video
  src="/video.mp4"
  tracks={[
    { src: '/captions-en.vtt', kind: 'captions', srclang: 'en', label: 'English', default: true },
  ]}
/>
```

### AspectRatio

```tsx
import { AspectRatio } from '@enterprise/media/primitives';

<AspectRatio ratio="16:9">
  <Image src="/hero.jpg" alt="Hero" />
</AspectRatio>

// Custom ratio
<AspectRatio customRatio={2.35}>
  <Video src="/cinematic.mp4" />
</AspectRatio>
```

### Lightbox

```tsx
import {
  Lightbox,
  LightboxProvider,
  useLightbox,
} from "@enterprise/media/lightbox";
import { Image } from "@enterprise/media/primitives";

// Wrap your app with LightboxProvider
function App() {
  return (
    <LightboxProvider>
      <Gallery />
      <Lightbox />
    </LightboxProvider>
  );
}

// Use with enableLightbox on Image
function Gallery() {
  return <Image src="/photo.jpg" alt="Photo" enableLightbox />;
}

// Or use the hook directly
function CustomImage() {
  const { openLightbox } = useLightbox();

  return (
    <img
      src="/photo.jpg"
      alt="Photo"
      onClick={() =>
        openLightbox({ src: "/photo.jpg", alt: "Photo" }, [
          { src: "/photo1.jpg", alt: "Photo 1" },
          { src: "/photo2.jpg", alt: "Photo 2" },
        ])
      }
    />
  );
}
```

**Keyboard shortcuts:**

- `Escape` - Close lightbox
- `ArrowLeft` / `ArrowRight` - Navigate images
- `+` / `-` - Zoom in/out
- `0` - Reset zoom

### React Query Hooks

```tsx
import {
  useMediaList,
  useMedia,
  useUpdateMedia,
  useDeleteMedia,
} from "@enterprise/media/hooks";

// Define your API client
const apiClient = {
  list: (tenantId, params) =>
    fetch(`/api/${tenantId}/media?${new URLSearchParams(params)}`).then((r) =>
      r.json(),
    ),
  get: (tenantId, id) =>
    fetch(`/api/${tenantId}/media/${id}`).then((r) => r.json()),
  update: (tenantId, id, data) =>
    fetch(`/api/${tenantId}/media/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  delete: (tenantId, id) =>
    fetch(`/api/${tenantId}/media/${id}`, { method: "DELETE" }),
};

// List media with filters
const { data, isLoading } = useMediaList({
  apiClient,
  tenantId: "tenant-123",
  params: { type: "IMAGE", folderId: "folder-456" },
});

// Update media
const { mutate: updateMedia } = useUpdateMedia({
  apiClient,
  tenantId: "tenant-123",
});
updateMedia({ id: "media-123", title: "New Title" });
```

### Upload System

```tsx
import { useUploadFile, useBatchUpload } from "@enterprise/media/hooks";

// Single file upload
const {
  mutate: upload,
  progress,
  isPending,
} = useUploadFile({
  apiClient: uploadClient,
  tenantId: "tenant-123",
  onUploadComplete: (item, media) => console.log("Uploaded:", media),
});

upload({ file: selectedFile, folderId: "folder-456" });

// Batch upload with queue
const { items, addFiles, isUploading, startUpload, cancelUpload } =
  useBatchUpload({
    apiClient: uploadClient,
    tenantId: "tenant-123",
    maxConcurrent: 3,
  });

// Add files and start uploading
addFiles(droppedFiles, "folder-123");
startUpload();
```

### Media Library Context

```tsx
import {
  CombinedMediaLibraryProvider,
  useMediaLibrary,
  useSelection,
  useUpload,
} from "@enterprise/media/library";

// Wrap your app with the combined provider
function App() {
  return (
    <CombinedMediaLibraryProvider
      mediaLibrary={{ initialFilters: { type: "IMAGE" } }}
      selection={{ onSelectionChange: (ids) => console.log("Selected:", ids) }}
      upload={{
        onUpload: async (item, onProgress) => {
          // Your upload implementation
          return uploadedMedia;
        },
      }}
    >
      <MediaLibrary />
    </CombinedMediaLibraryProvider>
  );
}

// Use the contexts in child components
function MediaGrid() {
  const { filters, sort, setFilters, setSort } = useMediaLibrary();
  const { selectedIds, select, selectAll, clearSelection } = useSelection();
  const { items, addFiles, isUploading } = useUpload();

  // ... render media grid
}
```

### Bulk Operations

```tsx
import { useBulkOperations } from "@enterprise/media/hooks";

const { bulkMove, bulkDelete, bulkTag, isPending } = useBulkOperations({
  apiClient,
  tenantId: "tenant-123",
});

// Move selected items to a folder
bulkMove({ mediaIds: selectedIds, folderId: "folder-456" });

// Delete selected items
bulkDelete(selectedIds);

// Add tags to selected items
bulkTag({ mediaIds: selectedIds, tags: ["featured", "product"] });
```

### Utilities

```tsx
import {
  formatBytes,
  formatDuration,
  validateFile,
  parseVideoUrl,
  decodeBlurHash,
} from "@enterprise/media/utils";

// Format file size
formatBytes(1024 * 1024); // "1 MB"

// Format duration
formatDuration(125); // "2:05"

// Validate file
const result = validateFile(file, {
  maxFileSize: 10 * 1024 * 1024,
  allowedTypes: ["image/*"],
});

// Parse video URL
const parsed = parseVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
// { provider: 'youtube', videoId: 'dQw4w9WgXcQ', embedUrl: '...', thumbnailUrl: '...' }

// Decode BlurHash
const placeholder = decodeBlurHash("LEHV6nWB2yk8pyo0adR*.7kCMdnj");
// { dataUrl: 'data:image/...', width: 32, height: 32 }
```

## Package Structure

```
packages/media/
├── src/
│   ├── index.ts              # Main exports
│   ├── types/                # Type definitions
│   │   ├── media.ts          # Core media types
│   │   ├── folder.ts         # Folder types
│   │   ├── upload.ts         # Upload types
│   │   ├── component-props.ts # Component prop types
│   │   └── extensions.ts     # Extension point types
│   ├── primitives/           # Display components
│   │   ├── aspect-ratio/
│   │   ├── image/
│   │   └── video/
│   ├── lightbox/             # Full-screen image viewer
│   ├── library/              # Media library context
│   │   ├── context/          # React contexts
│   │   │   ├── media-context.tsx
│   │   │   ├── selection-context.tsx
│   │   │   └── upload-context.tsx
│   │   └── providers/        # Combined providers
│   ├── hooks/                # React Query hooks
│   │   ├── use-media.ts      # Media CRUD
│   │   ├── use-folders.ts    # Folder operations
│   │   ├── use-upload.ts     # Upload with progress
│   │   └── use-bulk-operations.ts # Bulk actions
│   ├── utils/                # Utilities
│   │   ├── format.ts
│   │   ├── file-validation.ts
│   │   ├── blurhash.ts
│   │   └── video-url-parser.ts
│   └── styles/
│       └── index.css
└── package.json
```

## Exports

The package provides multiple entry points for tree-shaking:

```tsx
// Main entry - includes everything
import { Image, Video, formatBytes } from "@enterprise/media";

// Primitives only
import { Image, Video, AspectRatio } from "@enterprise/media/primitives";

// Individual primitives
import { Image } from "@enterprise/media/primitives/image";
import { Video } from "@enterprise/media/primitives/video";

// Lightbox
import {
  Lightbox,
  LightboxProvider,
  useLightbox,
} from "@enterprise/media/lightbox";

// Media Library (contexts and providers)
import {
  CombinedMediaLibraryProvider,
  MediaLibraryProvider,
  SelectionProvider,
  UploadProvider,
  useMediaLibrary,
  useSelection,
  useUpload,
} from "@enterprise/media/library";

// React Query Hooks
import {
  useMediaList,
  useMedia,
  useUpdateMedia,
  useFolderTree,
  useUploadFile,
  useBatchUpload,
  useBulkOperations,
} from "@enterprise/media/hooks";

// Types only
import type { Media, MediaType, MediaFolder } from "@enterprise/media/types";

// Utilities only
import { formatBytes, validateFile } from "@enterprise/media/utils";

// Styles
import "@enterprise/media/styles";
```

## Dependencies

- `@enterprise/tokens` - Design tokens and utilities
- `blurhash` - BlurHash decoding
- `react` (peer) - React 18+
- `react-dom` (peer) - React DOM 18+
- `@tanstack/react-query` (peer) - For hooks (optional)

## Coming Soon

- Media Library UI components (grid, folder tree, toolbar)
- Upload dropzone component
- Dialogs (rename, move, delete, crop)
- Builder and client app integrations

## License

Private - Enterprise Agency Platform
