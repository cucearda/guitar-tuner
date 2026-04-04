# Temporal Smoothing Design — Stability Window

**Date:** 2026-04-04

## Problem

When a guitar string is plucked, harmonics are initially louder than the fundamental. `autoCorrelate` latches onto a harmonic frequency during this transient, causing the gauge needle to jump to the wrong position before settling on the correct note.

## Solution

A `FrequencyStabilizer` class inside `AudioService` buffers raw frequency readings and only emits a new value when consecutive readings agree within a tight cents threshold. During unstable periods, it holds the last known stable frequency so the needle stays put rather than jumping.

## Design

### `FrequencyStabilizer` (new class in `audioservice.js`)

**Parameters:**
- `bufferSize = 8` — number of consecutive frames required before a reading is considered stable (~130ms at 60fps)
- `stabilityThreshold = 15` — max cents deviation among buffer readings for stability to be declared

**State:**
- `buffer` — ring buffer of the last N valid frequency readings
- `lastStableFrequency` — last frequency that passed the stability check (`null` initially)

**`process(rawFrequency)` method:**
1. If `rawFrequency === -1` (silence): emit `-1` immediately, do not push to buffer.
2. Otherwise: push `rawFrequency` into the ring buffer (drop oldest if full).
3. If buffer is not yet full: emit `lastStableFrequency` (or `-1` if none yet).
4. If buffer is full: convert all readings to cents relative to their median. If all are within `±stabilityThreshold` cents, update `lastStableFrequency` to the buffer median and emit it. Otherwise emit `lastStableFrequency`.

**`reset()` method:**
- Clears the buffer and sets `lastStableFrequency = null`.

### Integration in `AudioService`

- Instantiate `FrequencyStabilizer` in the constructor.
- In the `detect` loop, pass the raw `autoCorrelateValue` through `stabilizer.process()` before calling `frequencyCallback`.
- Expose `resetStabilizer()` on `AudioService` that delegates to `stabilizer.reset()`.

### Wiring the reset in `TunerLayout`

- In `handleTargetChange`, call `audioServiceRef.current.resetStabilizer()` so switching strings clears stale buffer readings.

## Parameters Rationale

| Parameter | Value | Reasoning |
|---|---|---|
| `bufferSize` | 8 | ~130ms at 60fps — long enough to outlast pluck transients |
| `stabilityThreshold` | 15 cents | Tight enough to reject harmonic confusion (harmonics are 100+ cents away), loose enough to tolerate minor pitch wobble |

## Files Changed

- `src/audio/audioservice.js` — add `FrequencyStabilizer`, integrate into `detect` loop, expose `resetStabilizer()`
- `src/components/TunerLayout.jsx` — call `resetStabilizer()` in `handleTargetChange`
