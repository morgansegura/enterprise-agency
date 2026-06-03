'use client'

import Link from 'next/link'
import React from 'react'
import { useActionState } from 'react'

import { createPage } from './dashboard-actions'

export type DashTenant = { id: string; name: string; domain: string | null }
export type DashPage = {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  tenantId: string | null
}

const NAVY = '#1a3f56'

const shell: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f1f5f9',
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  color: '#0f172a',
}
const bar: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 24px',
  background: '#fff',
  borderBottom: '1px solid #e2e8f0',
}
const main: React.CSSProperties = {
  maxWidth: 960,
  margin: '0 auto',
  padding: '32px 24px 64px',
}
const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  padding: 20,
  marginBottom: 24,
}
const input: React.CSSProperties = {
  padding: '8px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  fontSize: 14,
  flex: 1,
  minWidth: 140,
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
const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 0',
  borderTop: '1px solid #f1f5f9',
}
const editLink: React.CSSProperties = {
  padding: '6px 12px',
  background: NAVY,
  color: '#fff',
  borderRadius: 6,
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 600,
}
const viewLink: React.CSSProperties = {
  padding: '6px 12px',
  color: NAVY,
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  textDecoration: 'none',
  fontSize: 13,
}

function statusPill(status: 'draft' | 'published'): React.CSSProperties {
  const published = status === 'published'
  return {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    padding: '2px 8px',
    borderRadius: 999,
    color: published ? '#166534' : '#92400e',
    background: published ? '#dcfce7' : '#fef3c7',
  }
}

function liveUrl(domain: string | null, slug: string): string {
  const path = slug === 'home' ? '' : slug
  if (domain) return `http://${domain}/${path}`
  return `/${path}`
}

export function BuilderDashboard({
  pages,
  tenants,
  user,
}: {
  pages: DashPage[]
  tenants: DashTenant[]
  user: string
}) {
  const [state, formAction, pending] = useActionState(createPage, {})

  return (
    <div style={shell}>
      <header style={bar}>
        <strong style={{ fontSize: 16 }}>Visual Builder</strong>
        <span style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user ? <span style={{ fontSize: 13, color: '#64748b' }}>{user}</span> : null}
          {/* Full load into the Payload admin (separate app), not client-side nav. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/admin" style={{ fontSize: 13, color: NAVY, textDecoration: 'none' }}>
            CMS admin ↗
          </a>
        </span>
      </header>

      <main style={main}>
        <section style={card}>
          <h2 style={{ margin: '0 0 12px', fontSize: 15 }}>New page</h2>
          {tenants.length === 0 ? (
            <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
              No tenants yet — create one in the{' '}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/admin/collections/tenants" style={{ color: NAVY }}>
                CMS admin
              </a>{' '}
              first.
            </p>
          ) : (
            <form action={formAction} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <input name="title" placeholder="Page title" style={input} required />
              <input name="slug" placeholder="slug (optional)" style={input} />
              <select name="tenant" style={{ ...input, flex: '0 0 auto' }}>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <button type="submit" style={primaryBtn} disabled={pending}>
                {pending ? 'Creating…' : 'Create & open'}
              </button>
            </form>
          )}
          {state?.error ? (
            <p style={{ margin: '10px 0 0', fontSize: 13, color: '#c0392b' }}>{state.error}</p>
          ) : null}
        </section>

        {tenants.map((tenant) => {
          const tenantPages = pages.filter((p) => p.tenantId === tenant.id)
          return (
            <section style={card} key={tenant.id}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                }}
              >
                <h2 style={{ margin: 0, fontSize: 15 }}>{tenant.name}</h2>
                {tenant.domain ? (
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{tenant.domain}</span>
                ) : null}
              </div>
              {tenantPages.length === 0 ? (
                <p style={{ margin: '12px 0 0', fontSize: 14, color: '#94a3b8' }}>No pages yet.</p>
              ) : (
                tenantPages.map((p) => (
                  <div style={row} key={p.id}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>/{p.slug}</div>
                    </div>
                    <span style={statusPill(p.status)}>{p.status}</span>
                    <a
                      href={liveUrl(tenant.domain, p.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={viewLink}
                    >
                      View ↗
                    </a>
                    <Link href={`/builder/${p.id}`} style={editLink}>
                      Edit
                    </Link>
                  </div>
                ))
              )}
            </section>
          )
        })}
      </main>
    </div>
  )
}
