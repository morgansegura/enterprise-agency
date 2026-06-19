'use client'

import { useAllFormFields } from '@payloadcms/ui'

/**
 * SEO health — a red/yellow/green indicator that reads the live form state and
 * scores the page's SEO essentials. Semi-smart: it checks presence + length of
 * the fields that actually move the needle, and explains each result. Rendered
 * as a `ui` field at the top of the SEO group on Pages/Posts.
 */

type Status = 'pass' | 'warn' | 'fail'
type Check = { label: string; status: Status; hint?: string }

const COLORS: Record<Status | 'off', string> = {
  pass: '#2faa5e',
  warn: '#e6a700',
  fail: '#d92d20',
  off: '#8a8f98',
}

const ICON: Record<Status, string> = { pass: '✓', warn: '!', fail: '✕' }

export function SeoHealthField() {
  const [fields] = useAllFormFields()

  const get = (path: string): unknown => fields?.[path]?.value
  const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')

  const title = str(get('title'))
  const metaTitle = str(get('meta.title'))
  const description = str(get('meta.description'))
  const slug = str(get('slug'))
  const hasImage = Boolean(get('meta.image'))
  const noindex = Boolean(get('meta.noindex'))

  const effectiveTitle = metaTitle || title
  const checks: Check[] = []

  if (!effectiveTitle) {
    checks.push({
      label: 'Title',
      status: 'fail',
      hint: 'Add a page title or an SEO title override.',
    })
  } else if (effectiveTitle.length < 20 || effectiveTitle.length > 65) {
    checks.push({
      label: `Title (${effectiveTitle.length} chars)`,
      status: 'warn',
      hint: 'Aim for 30–60 characters.',
    })
  } else {
    checks.push({ label: 'Title length', status: 'pass' })
  }

  if (!description) {
    checks.push({
      label: 'Meta description',
      status: 'fail',
      hint: 'Add a 120–160 character description.',
    })
  } else if (description.length < 110 || description.length > 170) {
    checks.push({
      label: `Meta description (${description.length} chars)`,
      status: 'warn',
      hint: 'Aim for 120–160 characters.',
    })
  } else {
    checks.push({ label: 'Meta description', status: 'pass' })
  }

  if (!slug) {
    checks.push({ label: 'URL slug', status: 'fail', hint: 'Set a URL slug.' })
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    checks.push({
      label: 'URL slug',
      status: 'warn',
      hint: 'Use lowercase words separated by hyphens.',
    })
  } else {
    checks.push({ label: 'URL slug', status: 'pass' })
  }

  checks.push(
    hasImage
      ? { label: 'Social share image', status: 'pass' }
      : {
          label: 'Social share image',
          status: 'warn',
          hint: 'Optional — falls back to the site default OG image.',
        },
  )

  const hasFail = checks.some((c) => c.status === 'fail')
  const hasWarn = checks.some((c) => c.status === 'warn')
  const overall: Status | 'off' = noindex ? 'off' : hasFail ? 'fail' : hasWarn ? 'warn' : 'pass'

  const overallLabel = noindex
    ? 'Excluded from search (noindex)'
    : overall === 'pass'
      ? 'Good — ready to index'
      : overall === 'warn'
        ? 'Needs attention'
        : 'Missing SEO essentials'

  return (
    <div
      style={{
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 6,
        padding: '12px 14px',
        margin: '10px 0 18px',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: noindex ? 0 : 10,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: COLORS[overall],
            boxShadow: `0 0 0 3px ${COLORS[overall]}22`,
            flexShrink: 0,
          }}
        />
        <strong style={{ fontSize: 13 }}>SEO — {overallLabel}</strong>
      </div>

      {!noindex && (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {checks.map((c) => (
            <li
              key={c.label}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
                fontSize: 12,
              }}
            >
              <span
                style={{
                  color: COLORS[c.status],
                  fontWeight: 700,
                  width: 12,
                  flexShrink: 0,
                }}
              >
                {ICON[c.status]}
              </span>
              <span style={{ color: 'var(--theme-elevation-800)' }}>
                {c.label}
                {c.hint ? (
                  <span style={{ color: 'var(--theme-elevation-500)' }}>
                    {' — '}
                    {c.hint}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
