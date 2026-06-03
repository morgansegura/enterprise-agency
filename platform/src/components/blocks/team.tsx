import type { ComponentConfig } from '@puckeditor/core'

import type { BlockData } from '@/lib/generate-css'
import { MediaField } from '@/components/puck/media-field'

import { alignOptions, styleField } from './shared'

type TeamMember = {
  id?: string
  name?: string
  role?: string
  bio?: string
  photo?: {
    url?: string
    alt?: string
    width?: number
    height?: number
  } | null
}

export function Team({ id, heading, intro, columns, items, align }: BlockData) {
  const list = Array.isArray(items) ? (items as TeamMember[]) : []
  return (
    <section className={`block team b-${id}`} data-el={id} data-align={align}>
      {heading ? <h2 className="team-heading">{String(heading)}</h2> : null}
      {intro ? <p className="team-intro">{String(intro)}</p> : null}
      <div className="team-grid" data-cols={String(columns ?? '3')}>
        {list.map((member, i) => {
          const photo = member?.photo
          return (
            <div className="team-member" key={member.id ?? i}>
              {photo?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="team-photo"
                  src={photo.url}
                  alt={photo.alt ?? member.name ?? ''}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                />
              ) : null}
              {member.name ? <h3 className="team-name">{member.name}</h3> : null}
              {member.role ? <p className="team-role">{member.role}</p> : null}
              {member.bio ? <p className="team-bio">{member.bio}</p> : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export const teamConfig = {
  label: 'Team',
  fields: {
    heading: { type: 'text' },
    intro: { type: 'textarea' },
    columns: {
      type: 'select',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    items: {
      type: 'array',
      arrayFields: {
        photo: { type: 'custom', label: 'Photo', render: MediaField },
        name: { type: 'text' },
        role: { type: 'text' },
        bio: { type: 'textarea' },
      },
    },
    align: { type: 'select', options: alignOptions },
    style: styleField,
  },
  defaultProps: { columns: '3', items: [], align: 'center' },
  render: (props) => <Team {...props} />,
} satisfies ComponentConfig
