import React from 'react'

export default function Gauge({ cents = 0 }) {
  const cx = 100
  const cy = 110

  return (
    <svg
      viewBox="0 0 200 130"
      width="400"
      height="260"
      style={{ display: 'block', margin: '0 auto' }}
    >
    </svg>
  )
}
