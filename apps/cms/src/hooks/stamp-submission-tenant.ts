import type { CollectionBeforeValidateHook } from 'payload'

/**
 * Public form submissions arrive with no logged-in user, so the multi-tenant
 * plugin can't infer their tenant. Copy it from the form being submitted so each
 * submission is scoped to the right client (and never leaks across tenants).
 * Runs beforeValidate so the tenant is set before the required-field check.
 */
export const stampSubmissionTenant: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || !data || data.tenant) return data

  const formRef = data.form
  if (!formRef) return data
  const formId = typeof formRef === 'object' ? formRef.id : formRef

  try {
    const form = await req.payload.findByID({
      collection: 'forms',
      id: formId,
      depth: 0,
      req,
    })
    const tenant = (form as { tenant?: unknown })?.tenant
    if (tenant) {
      data.tenant = typeof tenant === 'object' ? (tenant as { id: unknown }).id : tenant
    }
  } catch {
    // Form not found — leave tenant unset; validation will surface it.
  }

  return data
}
