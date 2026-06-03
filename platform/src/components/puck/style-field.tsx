'use client'

import { FieldLabel } from '@puckeditor/core'
import React from 'react'

import { STYLE_GROUPS, STYLE_PROPS, type StylePropDef } from '@/lib/style/properties'

/**
 * The per-element style inspector (Puck custom field). FUNCTIONAL pass — drives
 * the registry-backed style engine; visual polish comes later. Renders a control
 * per registry property, grouped, with a scope switcher so the same controls
 * write into base / hover / focus / tablet / mobile maps.
 */

type StyleMap = Record<string, unknown>

const SCOPES = [
  { key: 'base', label: 'Base' },
  { key: 'hover', label: 'Hover' },
  { key: 'focus', label: 'Focus' },
  { key: 'tablet', label: 'Tablet' },
  { key: 'mobile', label: 'Mobile' },
] as const
type Scope = (typeof SCOPES)[number]['key']
const RESERVED = ['hover', 'focus', 'tablet', 'mobile']

const wrap: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 }
const tabs: React.CSSProperties = { display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }
const tab = (active: boolean): React.CSSProperties => ({
  padding: '3px 8px',
  fontSize: 12,
  borderRadius: 5,
  border: '1px solid #cbd5e1',
  background: active ? '#1a3f56' : '#fff',
  color: active ? '#fff' : '#475569',
  cursor: 'pointer',
})
const groupSummary: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'capitalize',
  cursor: 'pointer',
  padding: '4px 0',
}
const ctrlRow: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1.2fr',
  alignItems: 'center',
  gap: 6,
  padding: '2px 0',
}
const ctrlLabel: React.CSSProperties = { fontSize: 11, color: '#64748b' }
const input: React.CSSProperties = {
  width: '100%',
  padding: '3px 6px',
  fontSize: 12,
  border: '1px solid #cbd5e1',
  borderRadius: 4,
  boxSizing: 'border-box',
}

function parseLength(v: unknown): { num: string; unit: string } {
  const s = typeof v === 'string' ? v.trim() : ''
  if (!s) return { num: '', unit: 'px' }
  if (s === 'auto') return { num: '', unit: 'auto' }
  const m = s.match(/^(-?[\d.]+)(px|rem|em|%|vw|vh)?$/)
  if (m) return { num: m[1], unit: m[2] ?? 'px' }
  return { num: '', unit: 'px' }
}
function combineLength(num: string, unit: string): string {
  if (unit === 'auto') return 'auto'
  return num === '' ? '' : `${num}${unit}`
}
function isHex(v: unknown): v is string {
  return typeof v === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)
}

function Control({
  def,
  value,
  onChange,
}: {
  def: StylePropDef
  value: unknown
  onChange: (v: string) => void
}) {
  if (def.control === 'length') {
    const { num, unit } = parseLength(value)
    const units = def.units ?? ['px', 'rem', '%']
    return (
      <span style={{ display: 'flex', gap: 4 }}>
        <input
          style={input}
          type="number"
          value={num}
          disabled={unit === 'auto'}
          onChange={(e) => onChange(combineLength(e.target.value, unit))}
        />
        <select
          style={{ ...input, width: 64 }}
          value={unit}
          onChange={(e) => onChange(combineLength(num, e.target.value))}
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </span>
    )
  }
  if (def.control === 'color') {
    const v = typeof value === 'string' ? value : ''
    return (
      <span style={{ display: 'flex', gap: 4 }}>
        <input
          type="color"
          value={isHex(v) ? v : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 28,
            height: 24,
            padding: 0,
            border: '1px solid #cbd5e1',
            borderRadius: 4,
          }}
        />
        <input
          style={input}
          type="text"
          value={v}
          placeholder="#hex / var()"
          onChange={(e) => onChange(e.target.value)}
        />
      </span>
    )
  }
  if (def.control === 'select') {
    return (
      <select
        style={input}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">—</option>
        {(def.options ?? []).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    )
  }
  // number | text | shadow → plain input (text/number)
  return (
    <input
      style={input}
      type={def.control === 'number' ? 'number' : 'text'}
      value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function StyleField({
  field,
  name,
  value,
  onChange,
}: {
  field: { label?: string }
  name: string
  value?: StyleMap | null
  onChange: (value: StyleMap) => void
}) {
  const style = (value ?? {}) as StyleMap
  const [scope, setScope] = React.useState<Scope>('base')

  const activeMap: StyleMap =
    scope === 'base'
      ? Object.fromEntries(Object.entries(style).filter(([k]) => !RESERVED.includes(k)))
      : ((style[scope] as StyleMap) ?? {})

  function setProp(key: string, val: string) {
    const next: StyleMap = { ...activeMap }
    if (val === '') delete next[key]
    else next[key] = val

    if (scope === 'base') {
      const reserved: StyleMap = {}
      for (const k of RESERVED) if (style[k] != null) reserved[k] = style[k]
      onChange({ ...next, ...reserved })
    } else {
      const updated = { ...style }
      if (Object.keys(next).length === 0) delete updated[scope]
      else updated[scope] = next
      onChange(updated)
    }
  }

  return (
    <FieldLabel label={field.label || name}>
      <div style={wrap}>
        <div style={tabs}>
          {SCOPES.map((s) => (
            <button
              key={s.key}
              type="button"
              style={tab(scope === s.key)}
              onClick={() => setScope(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {STYLE_GROUPS.map((group) => {
          const props = STYLE_PROPS.filter((p) => p.group === group)
          if (props.length === 0) return null
          const activeCount = props.filter(
            (p) => activeMap[p.key] != null && activeMap[p.key] !== '',
          ).length
          return (
            <details key={group} open={activeCount > 0}>
              <summary style={groupSummary}>
                {group}
                {activeCount > 0 ? ` (${activeCount})` : ''}
              </summary>
              {props.map((def) => (
                <div key={def.key} style={ctrlRow}>
                  <span style={ctrlLabel}>{def.label}</span>
                  <Control
                    def={def}
                    value={activeMap[def.key]}
                    onChange={(v) => setProp(def.key, v)}
                  />
                </div>
              ))}
            </details>
          )
        })}
      </div>
    </FieldLabel>
  )
}
