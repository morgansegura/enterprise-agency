import type { ComponentConfig } from '@puckeditor/core'

import type { BlockData } from '@/lib/generate-css'
import type { StaffMember } from '@/lib/staff'

import { alignOptions, styleField } from './shared'

type StaffMeta = {
  fetchStaff?: (group?: string) => Promise<StaffMember[]>
}

export function StaffDirectory({
  id,
  heading,
  intro,
  group,
  columns,
  align,
  variant,
  items,
}: BlockData) {
  const list = (Array.isArray(items) ? items : []) as StaffMember[]

  return (
    <section
      className={`block staff-directory b-${id}`}
      data-el={id}
      data-align={align}
      data-variant={variant ? String(variant) : undefined}
    >
      {heading ? <h2 className="staff-directory-heading">{String(heading)}</h2> : null}
      {intro ? <p className="staff-directory-intro">{String(intro)}</p> : null}

      {list.length === 0 ? (
        <p className="staff-directory-empty">
          No staff to show
          {group && group !== 'all' ? ` for “${String(group)}”` : ''}. Add people in the CMS
          (Staff), then set this block’s group.
        </p>
      ) : (
        <div className="staff-directory-grid" data-cols={String(columns ?? '3')}>
          {list.map((m) => (
            <div className="staff-card" key={m.id}>
              {m.photo?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="staff-photo"
                  src={m.photo.url}
                  alt={m.photo.alt ?? m.name}
                  loading="lazy"
                />
              ) : null}
              {m.name ? <h3 className="staff-name">{m.name}</h3> : null}
              {m.role ? <p className="staff-role">{m.role}</p> : null}
              {m.bio ? <p className="staff-bio">{m.bio}</p> : null}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export const staffDirectoryConfig = {
  label: 'Staff Directory',
  fields: {
    heading: { type: 'text' },
    intro: { type: 'textarea' },
    group: {
      type: 'text',
      label: 'Group filter',
      // "all" or a Staff group label, e.g. "Coaching Staff".
    },
    variant: {
      type: 'select',
      label: 'Layout variant',
      options: [
        { label: 'Cards', value: 'cards' },
        { label: 'List', value: 'list' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
    columns: {
      type: 'select',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    align: { type: 'select', options: alignOptions },
    style: styleField,
  },
  defaultProps: { group: 'all', variant: 'cards', columns: '3', align: 'center' },
  // Hydrated server-side by resolveAllData (live site) and by Puck in the
  // editor; `fetchStaff` is injected via Render/Puck `metadata`.
  resolveData: async ({ props }: { props: BlockData }, { metadata }: { metadata?: StaffMeta }) => {
    const fetchStaff = metadata?.fetchStaff
    if (!fetchStaff) return { props }
    const items = await fetchStaff(typeof props.group === 'string' ? props.group : undefined)
    return { props: { ...props, items }, readOnly: { items: true } }
  },
  render: (props) => <StaffDirectory {...props} />,
} satisfies ComponentConfig
