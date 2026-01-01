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
│   ├── lightbox/             # Lightbox system (coming soon)
│   ├── library/              # Media library (coming soon)
│   ├── hooks/                # React hooks (coming soon)
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

- Lightbox component with gallery navigation
- Media Library with folder organization
- Upload system with progress tracking
- Bulk operations (move, delete, tag)
- Crop dialog
- API hooks for CRUD operations

## License

Private - Enterprise Agency Platform
