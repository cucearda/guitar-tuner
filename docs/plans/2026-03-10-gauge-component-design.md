# Gauge Component Design

## Overview

An SVG-based tuner gauge that displays pitch deviation in cents (-100 to +100), with a rotating needle that animates smoothly on value change.

## Component API

```jsx
<Gauge cents={number} />
```

- `cents`: number from -100 to +100. Center (0) = in tune.

## Visual Structure

- SVG viewBox: `0 0 200 130`, pivot point at `(100, 110)`
- **Tick marks**: 21 ticks arranged in a ~160° arc around the pivot
  - Outer radius: 90px from pivot
  - Short ticks: ~8px tall
  - Medium ticks at every 4th tick: ~12px tall
  - Center tick (0 cents): doubled / taller (~16px)
- **Needle**: `<line>` from pivot up ~85px, with `<circle r=4>` at pivot
- All elements use a single dark slate color (matching screenshot: `#2d3a4a`)

## Angle Mapping

- -100 cents → -80°
- 0 cents → 0°
- +100 cents → +80°
- Formula: `angle = (cents / 100) * 80`

## Animation

- CSS `transition: transform 0.15s ease-out` on the needle `<g>` element
- Rotation applied via `transform="rotate(angle, 100, 110)"` (SVG transform attribute updated via React state/prop)

## Implementation

- Single file: `src/components/Gauge.jsx`
- Pure SVG, no external dependencies
- Tick positions computed mathematically at render time (no hardcoding)
- Needle group rotated by mapping cents prop to degrees
