'use client'

import { FieldLabel } from '@puckeditor/core'
import React from 'react'

type Form = { id: string | number; title?: string }

/** Puck custom field: pick a form from the tenant's Forms collection. */
export function FormPickerField({
  field,
  name,
  value,
  onChange,
}: {
  field: { label?: string }
  name: string
  value?: string | null
  onChange: (value: string | null) => void
}) {
  const [forms, setForms] = React.useState<Form[]>([])

  React.useEffect(() => {
    let active = true
    fetch('/api/forms?limit=100&depth=0')
      .then((r) => r.json())
      .then((d) => {
        if (active) setForms(Array.isArray(d?.docs) ? (d.docs as Form[]) : [])
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return (
    <FieldLabel label={field.label || name}>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        style={{ width: '100%' }}
      >
        <option value="">— Select form —</option>
        {forms.map((f) => (
          <option key={String(f.id)} value={String(f.id)}>
            {f.title || `Form ${f.id}`}
          </option>
        ))}
      </select>
    </FieldLabel>
  )
}
