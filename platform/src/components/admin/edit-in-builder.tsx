'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import React from 'react'

/** Admin sidebar button → opens the page in the visual builder. */
export function EditInBuilderButton() {
  const { id } = useDocumentInfo()
  if (!id) return null
  return (
    <a
      href={`/builder/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        padding: '8px 14px',
        background: '#1a3f56',
        color: '#fff',
        borderRadius: 6,
        textDecoration: 'none',
        fontWeight: 600,
        textAlign: 'center',
      }}
    >
      Open Visual Builder ↗
    </a>
  )
}
