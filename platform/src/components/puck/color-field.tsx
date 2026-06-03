'use client'

import { FieldLabel } from '@puckeditor/core'
import React from 'react'

/**
 * Puck custom field: a real color picker (swatch + hex). Empty hex = no
 * override (falls back to the theme). Reused across components' style props.
 */
export function ColorField({
  field,
  name,
  value,
  onChange,
}: {
  field: { label?: string }
  name: string
  value?: string
  onChange: (value: string) => void
}) {
  const current = value ?? ''
  return (
    <FieldLabel label={field.label || name}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="color"
          value={current || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 36,
            height: 36,
            padding: 0,
            border: '1px solid var(--puck-color-grey-09, #ddd)',
            borderRadius: 6,
            background: 'none',
          }}
          aria-label={`${field.label || name} swatch`}
        />
        <input
          type="text"
          value={current}
          placeholder="#hex (blank = theme default)"
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>
    </FieldLabel>
  )
}
