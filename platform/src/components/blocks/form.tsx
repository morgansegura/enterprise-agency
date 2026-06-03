import type { ComponentConfig } from '@puckeditor/core'

import { FormRenderer } from '@/components/forms/form-renderer'
import { FormPickerField } from '@/components/puck/form-field'

import { styleField } from './shared'

export const formConfig = {
  label: 'Form',
  fields: {
    formId: { type: 'custom', label: 'Form', render: FormPickerField },
    style: styleField,
  },
  defaultProps: {},
  render: (props) => (
    <section className="block form-block" data-el={props.id}>
      <FormRenderer formId={props.formId} />
    </section>
  ),
} satisfies ComponentConfig
