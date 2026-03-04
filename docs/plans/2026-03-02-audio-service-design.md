# Audio Service Design

## Decision

Web Audio API interaction lives in `src/audio/audioService.js` — a plain ES module, not coupled to React.

## Rationale

- Single-screen app: no need for shared state across routes
- Plain module keeps audio logic framework-agnostic and easy to unit test in isolation
- React component manages lifecycle manually via `useEffect` (calls `start` on mount, `stop` on unmount)

## Public API

```js
audioService.start(onFrequency)  // opens mic, begins detection loop
audioService.stop()              // closes mic, cancels loop, tears down AudioContext
```

`onFrequency(hz)` is fired each animation frame with the detected dominant frequency.

## Data Flow

```
Microphone
  → MediaStream (getUserMedia)
    → AudioContext
      → MediaStreamSourceNode
        → AnalyserNode
          → frequency detection (reads getFloatTimeDomainData each frame)
            → onFrequency(hz)
```

## File Structure

```
src/
  audio/
    audioService.js   ← Web Audio logic lives here
  App.jsx             ← calls start/stop in useEffect, renders detected frequency
```
