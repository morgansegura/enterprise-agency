'use client'

import React from 'react'

type FormFieldDef = {
  blockType?: string
  name?: string
  label?: string
  required?: boolean | null
  options?: { label?: string; value?: string }[] | null
}
type FormDef = {
  id: string | number
  title?: string
  fields?: FormFieldDef[]
  submitButtonLabel?: string | null
}

function FieldInput({ field }: { field: FormFieldDef }) {
  const { blockType, name, label, required } = field
  if (blockType === 'message') return <p className="form-message">{label}</p>
  if (!name) return null
  const id = `f_${name}`
  const labelEl = label ? (
    <label htmlFor={id} className="form-label">
      {label}
      {required ? <span className="form-required"> *</span> : null}
    </label>
  ) : null

  if (blockType === 'textarea') {
    return (
      <div className="form-field">
        {labelEl}
        <textarea id={id} name={name} required={!!required} rows={5} />
      </div>
    )
  }
  if (blockType === 'select') {
    return (
      <div className="form-field">
        {labelEl}
        <select id={id} name={name} required={!!required} defaultValue="">
          <option value="" disabled>
            Select…
          </option>
          {(field.options ?? []).map((o, i) => (
            <option key={i} value={o.value ?? o.label ?? ''}>
              {o.label ?? o.value}
            </option>
          ))}
        </select>
      </div>
    )
  }
  if (blockType === 'checkbox') {
    return (
      <div className="form-field form-field-inline">
        <input id={id} name={name} type="checkbox" />
        {labelEl}
      </div>
    )
  }
  const inputType =
    blockType === 'email' ? 'email' : blockType === 'number' ? 'number' : 'text'
  return (
    <div className="form-field">
      {labelEl}
      <input id={id} name={name} type={inputType} required={!!required} />
    </div>
  )
}

export function FormRenderer({ formId }: { formId?: string | number | null }) {
  const [form, setForm] = React.useState<FormDef | null>(null)
  const [status, setStatus] = React.useState<
    'idle' | 'submitting' | 'done' | 'error'
  >('idle')

  React.useEffect(() => {
    if (!formId) return
    let active = true
    fetch(`/api/forms/${formId}?depth=0`)
      .then((r) => r.json())
      .then((d) => {
        if (active) setForm(d ?? null)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [formId])

  if (!formId) return <p className="form-empty">Pick a form in the field panel.</p>
  if (!form?.fields) return <p className="form-empty">Loading form…</p>
  if (status === 'done') {
    return <div className="form-confirmation">Thanks — your message was sent.</div>
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form) return
    setStatus('submitting')
    const fd = new FormData(e.currentTarget)
    const submissionData = (form.fields ?? [])
      .filter((f) => f.name && f.blockType !== 'message')
      .map((f) => ({
        field: f.name as string,
        value: String(fd.get(f.name as string) ?? ''),
      }))
    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: form.id, submissionData }),
      })
      if (!res.ok) throw new Error('submit failed')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {(form.fields ?? []).map((f, i) => (
        <FieldInput key={i} field={f} />
      ))}
      <button type="submit" className="button" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : form.submitButtonLabel || 'Submit'}
      </button>
      {status === 'error' ? (
        <p className="form-error">Something went wrong — please try again.</p>
      ) : null}
    </form>
  )
}
