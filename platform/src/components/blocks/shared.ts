import { StyleField } from '@/components/puck/style-field'

/** Shared option sets + the per-element style field, reused across blocks. */

export const alignOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
]

export const bgOptions = [
  { label: 'None', value: 'none' },
  { label: 'Muted', value: 'muted' },
  { label: 'Brand', value: 'brand' },
]

/**
 * The per-element "Style" field — a custom inspector
 * (`src/components/puck/style-field.tsx`) backed by the registry-driven style
 * engine (`src/lib/style/*`). Shared by every block so styling is consistent;
 * stores raw CSS values keyed by the property registry (base + hover/focus +
 * tablet/mobile).
 */
export const styleField = {
  type: 'custom' as const,
  label: 'Style',
  render: StyleField,
}
