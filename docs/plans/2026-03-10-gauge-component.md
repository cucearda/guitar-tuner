# Gauge Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an SVG gauge component with a rotating needle that shows pitch deviation from -100 to +100 cents.

**Architecture:** Pure SVG rendered in React. Tick marks are computed mathematically at render time along a 160° arc. The needle is a `<g>` element rotated via an inline SVG transform, driven by a `cents` prop. Smooth animation handled with a CSS transition.

**Tech Stack:** React 19, Vite, plain SVG (no extra deps)

---

### Task 1: Render the static SVG scaffold

**Files:**
- Modify: `src/components/Gauge.jsx`

**Step 1: Replace the placeholder with a sized SVG**

```jsx
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
```

**Step 2: Verify in browser**

Run: `npm run dev`
Expected: an empty white rectangle where the gauge will go. No errors in console.

**Step 3: Commit**

```bash
git add src/components/Gauge.jsx
git commit -m "feat: scaffold Gauge SVG"
```

---

### Task 2: Render tick marks

**Files:**
- Modify: `src/components/Gauge.jsx`

**Context:**
- Pivot point: `(100, 110)`
- Arc radius: `90` (distance from pivot to tick base)
- Sweep: 160° total, so ticks run from `-80°` to `+80°` (0° = straight up = 12 o'clock)
- 21 ticks total (indices 0–20), so step = 160/20 = 8° per tick
- In SVG, 0° is 3 o'clock. Straight up = -90°. So tick at index i:
  - `angleDeg = -90 + (-80 + i * 8)`
  - `angleRad = angleDeg * (Math.PI / 180)`
- Tick lengths:
  - Index 10 (center): 16px
  - Indices 2,4,6,8,12,14,16,18 (every 4th except center): 12px
  - All others: 8px
- Tick base point: `(cx + radius * cos, cy + radius * sin)`
- Tick tip point: `(cx + (radius - tickLen) * cos, cy + (radius - tickLen) * sin)`

**Step 1: Add tick computation and render**

```jsx
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
    </svg>
  )
}
```

**Step 2: Verify in browser**

Expected: 21 tick marks arranged in a semicircular arc. Center tick is slightly thicker. Looks like the screenshot.

**Step 3: Commit**

```bash
git add src/components/Gauge.jsx
git commit -m "feat: render Gauge tick marks"
```

---

### Task 3: Render the needle

**Files:**
- Modify: `src/components/Gauge.jsx`

**Context:**
- Needle length: 85px pointing straight up from pivot
- Straight up in SVG = negative Y direction, so needle tip is at `(cx, cy - 85)`
- Pivot circle radius: 4px
- The `<g>` group gets `transform="rotate(angle, cx, cy)"` where angle comes from cents

**Step 1: Add angle computation and needle**

Add this inside the component, before the return:

```jsx
const needleAngle = (cents / 100) * 80
```

Add this inside the `<svg>`, after the ticks:

```jsx
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
```

**Step 2: Verify in browser**

Expected: needle points straight up at `cents=0`. Try passing `cents={50}` — needle should lean right ~40°. Try `cents={-100}` — needle should lean hard left at ~80°.

**Step 3: Commit**

```bash
git add src/components/Gauge.jsx
git commit -m "feat: add rotating needle to Gauge"
```

---

### Task 4: Verify animation works

**Files:**
- Modify: `src/App.jsx` (temporarily, for manual testing)

**Step 1: Add a test slider in App.jsx**

```jsx
import { useState } from 'react'
import Gauge from './components/Gauge'

export default function App() {
  const [cents, setCents] = useState(0)
  return (
    <div style={{ padding: 40 }}>
      <Gauge cents={cents} />
      <input
        type="range" min={-100} max={100} value={cents}
        onChange={e => setCents(Number(e.target.value))}
        style={{ width: '400px', display: 'block', margin: '20px auto' }}
      />
      <p style={{ textAlign: 'center' }}>{cents} cents</p>
    </div>
  )
}
```

**Step 2: Verify in browser**

Expected: drag the slider and the needle moves smoothly with a subtle easing transition.

**Step 3: Revert App.jsx to original and commit Gauge**

Restore App.jsx to whatever it was before. The Gauge component itself is done.

```bash
git add src/components/Gauge.jsx
git commit -m "feat: complete Gauge component with animated needle"
```
