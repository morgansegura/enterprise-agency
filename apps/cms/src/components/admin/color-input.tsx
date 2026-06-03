'use client'

import { FieldLabel, useField } from '@payloadcms/ui'
import React from 'react'

/** Payload admin custom field: a real color picker (swatch + hex) for theme colors. */
export function ColorInput(props: { path: string; field?: { label?: unknown } }) {
  const { path } = props
  const { value, setValue } = useField<string>({ path })
  const label = typeof props.field?.label === 'string' ? props.field.label : path

  return (
    <div className="field-type" style={{ marginBottom: '1.25rem' }}>
      <FieldLabel label={label} path={path} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="color"
          value={value || '#1a3f56'}
          onChange={(e) => setValue(e.target.value)}
          aria-label={`${label} color`}
          style={{
            width: 42,
            height: 38,
            padding: 0,
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 4,
            background: 'none',
            cursor: 'pointer',
          }}
        />
        <input
          type="text"
          value={value || ''}
          placeholder="#hex (blank = platform default)"
          onChange={(e) => setValue(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  )
}
