import React from 'react'

/** Admin icon — the compact mark (collapsed nav). Agency brand. */
export function Icon() {
  return (
    <span
      style={{
        fontSize: '1.4rem',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        color: 'var(--theme-elevation-1000)',
      }}
    >
      W<span style={{ color: '#c9a227' }}>&amp;</span>F
    </span>
  )
}
