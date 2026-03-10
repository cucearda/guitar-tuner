import React from 'react'

const COLOR = '#2d3a4a'

export default function Gauge({ cents = 0 }) {
  const cx = 100
  const cy = 110
  const radius = 90

  const ticks = Array.from({ length: 21 }, (_, i) => {
    const angleDeg = -90 + (-80 + i * 8)
    const angleRad = angleDeg * (Math.PI / 180)
    const isCenter = i === 10
    const isMedium = i % 4 === 0 && !isCenter
    const len = isCenter ? 16 : isMedium ? 12 : 8
    const x1 = cx + radius * Math.cos(angleRad)
    const y1 = cy + radius * Math.sin(angleRad)
    const x2 = cx + (radius - len) * Math.cos(angleRad)
    const y2 = cy + (radius - len) * Math.sin(angleRad)
    return { x1, y1, x2, y2, isCenter }
  })

  const needleAngle = (cents / 100) * 80

  return (
    <svg
      viewBox="0 0 200 130"
      width="400"
      height="260"
      style={{ display: 'block', margin: '0 auto' }}
    >
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1}
          x2={t.x2} y2={t.y2}
          stroke={COLOR}
          strokeWidth={t.isCenter ? 2 : 1.2}
          strokeLinecap="round"
        />
      ))}
      <g
        transform={`rotate(${needleAngle}, ${cx}, ${cy})`}
        style={{ transition: 'transform 0.15s ease-out' }}
      >
        <line
          x1={cx} y1={cy}
          x2={cx} y2={cy - 85}
          stroke={COLOR}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <circle
          cx={cx} cy={cy}
          r={4}
          fill={COLOR}
        />
      </g>
    </svg>
  )
}
