'use client'

import { FieldLabel } from '@puckeditor/core'
import React from 'react'

import { uploadMedia } from '@/lib/media-actions'

type Media = {
  id: string | number
  url?: string
  alt?: string
  filename?: string
  width?: number
  height?: number
}

function toSelection(m: Media): Media {
  return { id: m.id, url: m.url, alt: m.alt, width: m.width, height: m.height }
}

/**
 * Puck custom field: pick an image from the Payload Media library OR upload a
 * new one inline. Stores a minimal {id,url,alt,w,h} for the renderer.
 */
export function MediaField({
  field,
  name,
  value,
  onChange,
}: {
  field: { label?: string }
  name: string
  value?: Media | null
  onChange: (value: Media | null) => void
}) {
  const [items, setItems] = React.useState<Media[]>([])
  const [loading, setLoading] = React.useState(true)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    let active = true
    fetch('/api/media?limit=100&depth=0')
      .then((r) => r.json())
      .then((d) => {
        if (active) setItems(Array.isArray(d?.docs) ? (d.docs as Media[]) : [])
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function handleUpload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const result = await uploadMedia(fd)
      if ('error' in result && result.error) {
        setError(`Upload failed: ${result.error}`)
        return
      }
      const doc = (result as { doc?: Media }).doc
      if (doc?.id != null) {
        setItems((prev) => [doc, ...prev])
        onChange(toSelection(doc))
      } else {
        setError('Upload returned no document')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <FieldLabel label={field.label || name}>
      {value?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value.url}
          alt={value.alt || ''}
          style={{
            maxWidth: '100%',
            borderRadius: 6,
            marginBottom: 8,
            display: 'block',
          }}
        />
      ) : null}
      <select
        value={value?.id != null ? String(value.id) : ''}
        onChange={(e) => {
          const m = items.find((x) => String(x.id) === e.target.value)
          onChange(m ? toSelection(m) : null)
        }}
        style={{ width: '100%' }}
      >
        <option value="">{loading ? 'Loading…' : '— Select image —'}</option>
        {items.map((m) => (
          <option key={String(m.id)} value={String(m.id)}>
            {m.alt || m.filename || `media ${m.id}`}
          </option>
        ))}
      </select>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleUpload(f)
          e.target.value = ''
        }}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        style={{ marginTop: 8 }}
      >
        {uploading ? 'Uploading…' : 'Upload new image'}
      </button>
      {error ? (
        <p style={{ color: '#c0392b', fontSize: 12, marginTop: 6 }}>{error}</p>
      ) : null}
    </FieldLabel>
  )
}
