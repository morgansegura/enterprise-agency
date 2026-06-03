'use client'

import { Puck, type Data } from '@puckeditor/core'
import '@puckeditor/core/puck.css'
import '../builder-theme.css'
import Link from 'next/link'
import React from 'react'

import { puckConfig } from '@/lib/puck-config'
import { generatePuckCSS } from '@/lib/puck-css'

import { publishPage, saveDraft } from './actions'
import { PageSettingsDrawer, type InitialSettings } from './page-settings'

type Content = Parameters<typeof generatePuckCSS>[0]

// Save is the primary action; Publish is the deliberate, secondary "last step".
const saveBtn: React.CSSProperties = {
  padding: '8px 16px',
  background: '#1a3f56',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  fontWeight: 600,
  cursor: 'pointer',
}
const publishBtn: React.CSSProperties = {
  padding: '8px 14px',
  background: 'transparent',
  color: '#1a3f56',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  cursor: 'pointer',
}
const cmsLink: React.CSSProperties = {
  padding: '8px 10px',
  color: '#1a3f56',
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 500,
  whiteSpace: 'nowrap',
}

type StaffDoc = {
  id: string | number
  name?: string
  role?: string
  group?: string
  bio?: string
  email?: string
  photo?: { url?: string; alt?: string } | null
}

export function BuilderClient({
  id,
  data,
  settings,
  viewUrl,
  tenantId,
}: {
  id: string
  data: Data
  settings: InitialSettings
  viewUrl: string
  tenantId: string
}) {
  const [css, setCss] = React.useState(() =>
    generatePuckCSS((data as { content?: Content }).content),
  )
  const dataRef = React.useRef(data)
  const [saving, setSaving] = React.useState(false)
  const [publishing, setPublishing] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const title = settings.title

  // Data-bound blocks hydrate in the canvas via Puck's resolveData reading
  // these tenant-scoped fetchers from `metadata` (Payload's REST API). The live
  // site uses the same resolveData with Local-API fetchers (see PageView).
  const metadata = React.useMemo(() => {
    if (!tenantId) return {}
    return {
      fetchStaff: async (group?: string) => {
        const params = new URLSearchParams({
          depth: '1',
          limit: '200',
          sort: 'order',
          'where[tenant][equals]': tenantId,
        })
        if (group && group !== 'all') {
          params.set('where[group][equals]', group)
        }
        const res = await fetch(`/api/staff?${params.toString()}`)
        if (!res.ok) return []
        const json = (await res.json()) as { docs?: StaffDoc[] }
        return (json.docs ?? []).map((d) => ({
          id: String(d.id),
          name: d.name ?? '',
          role: d.role ?? '',
          group: d.group ?? '',
          bio: d.bio ?? '',
          email: d.email ?? '',
          photo:
            d.photo && typeof d.photo === 'object' ? { url: d.photo.url, alt: d.photo.alt } : null,
        }))
      },
    }
  }, [tenantId])

  return (
    <>
      {/* Live per-element CSS so the (non-iframe) canvas is WYSIWYG */}
      {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
      <Puck
        config={puckConfig}
        data={data}
        metadata={metadata}
        iframe={{ enabled: false }}
        viewports={[
          { width: '100%', label: 'Desktop', icon: 'Monitor' },
          { width: 768, label: 'Tablet', icon: 'Tablet' },
          { width: 480, label: 'Mobile', icon: 'Smartphone' },
        ]}
        onChange={(next) => {
          dataRef.current = next
          setCss(generatePuckCSS((next as { content?: Content }).content))
        }}
        overrides={{
          headerActions: () => (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Link href="/builder" style={cmsLink}>
                ← All pages
              </Link>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#1a3f56',
                  maxWidth: 220,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={title}
              >
                {title}
              </span>
              <span style={{ color: '#cbd5e1' }}>·</span>
              <a href={viewUrl} target="_blank" rel="noopener noreferrer" style={cmsLink}>
                View live ↗
              </a>
              <button
                type="button"
                style={{ ...cmsLink, background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setSettingsOpen(true)}
              >
                Settings
              </button>
              <button
                type="button"
                disabled={saving}
                style={saveBtn}
                onClick={async () => {
                  setSaving(true)
                  await saveDraft(id, dataRef.current)
                  setSaving(false)
                }}
              >
                {saving ? 'Saving…' : 'Save draft'}
              </button>
              <button
                type="button"
                disabled={publishing}
                style={publishBtn}
                onClick={async () => {
                  setPublishing(true)
                  await publishPage(id, dataRef.current)
                  setPublishing(false)
                }}
              >
                {publishing ? 'Publishing…' : 'Publish'}
              </button>
            </div>
          ),
        }}
      />
      {settingsOpen ? (
        <PageSettingsDrawer id={id} initial={settings} onClose={() => setSettingsOpen(false)} />
      ) : null}
    </>
  )
}
