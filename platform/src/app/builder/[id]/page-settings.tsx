'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import { MediaField } from '@/components/puck/media-field'

import { savePageSettings } from './actions'

type Media = {
  id: string | number
  url?: string
  alt?: string
  width?: number
  height?: number
}

export type InitialSettings = {
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  metaImage: Media | null
}

const NAVY = '#1a3f56'

const backdrop: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15,23,42,0.4)',
  zIndex: 9998,
}
const panel: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: 'min(400px, 100vw)',
  background: '#fff',
  boxShadow: '-8px 0 24px rgba(0,0,0,0.12)',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  color: '#0f172a',
}
const head: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid #e2e8f0',
}
const body: React.CSSProperties = {
  padding: 20,
  overflowY: 'auto',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}
const foot: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  justifyContent: 'flex-end',
  padding: '14px 20px',
  borderTop: '1px solid #e2e8f0',
}
const label: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 4,
  color: '#475569',
}
const field: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  fontSize: 14,
  boxSizing: 'border-box',
}
const primaryBtn: React.CSSProperties = {
  padding: '8px 16px',
  background: NAVY,
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  fontWeight: 600,
  cursor: 'pointer',
}
const ghostBtn: React.CSSProperties = {
  padding: '8px 14px',
  background: 'transparent',
  color: '#475569',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  cursor: 'pointer',
}

export function PageSettingsDrawer({
  id,
  initial,
  onClose,
}: {
  id: string
  initial: InitialSettings
  onClose: () => void
}) {
  const router = useRouter()
  const [title, setTitle] = React.useState(initial.title)
  const [slug, setSlug] = React.useState(initial.slug)
  const [metaTitle, setMetaTitle] = React.useState(initial.metaTitle)
  const [metaDescription, setMetaDescription] = React.useState(initial.metaDescription)
  const [image, setImage] = React.useState<Media | null>(initial.metaImage)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function save() {
    setSaving(true)
    setError(null)
    const res = await savePageSettings(id, {
      title: title.trim(),
      slug: slug.trim(),
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
      metaImage: image?.id ?? null,
    })
    setSaving(false)
    if (res.error) {
      setError(res.error)
      return
    }
    router.refresh()
    onClose()
  }

  return (
    <>
      <div style={backdrop} onClick={onClose} />
      <aside style={panel} role="dialog" aria-label="Page settings">
        <div style={head}>
          <strong style={{ fontSize: 15 }}>Page settings</strong>
          <button
            type="button"
            onClick={onClose}
            style={{
              ...ghostBtn,
              padding: '2px 8px',
              fontSize: 18,
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div style={body}>
          <div>
            <label style={label}>Title</label>
            <input style={field} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label style={label}>URL slug</label>
            <input style={field} value={slug} onChange={(e) => setSlug(e.target.value)} />
            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>
              The page path, e.g. <code>about</code>. Use <code>home</code> for the homepage.
            </p>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: 0 }} />
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: NAVY }}>SEO</p>

          <div>
            <label style={label}>Meta title</label>
            <input
              style={field}
              value={metaTitle}
              placeholder={title || 'Defaults to the page title'}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
          </div>
          <div>
            <label style={label}>Meta description</label>
            <textarea
              style={{ ...field, minHeight: 72, resize: 'vertical' }}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>
              {metaDescription.length} chars — aim for ~155.
            </p>
          </div>
          <div>
            <MediaField
              field={{ label: 'Social share image (1200×630)' }}
              name="metaImage"
              value={image}
              onChange={setImage}
            />
          </div>

          {error ? <p style={{ margin: 0, fontSize: 13, color: '#c0392b' }}>{error}</p> : null}
        </div>

        <div style={foot}>
          <button type="button" style={ghostBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" style={primaryBtn} onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </aside>
    </>
  )
}
