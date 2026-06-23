# mvgen

Offline audio-reactive MV engine MVP built with TypeScript + p5.js + Vite.

## Phase 1 MVP

- Generate BPM-based animation events via CLI
- Load `public/events.json`
- Render zoom pulse animation on a background image
- Run locally with Vite

## Setup

```bash
npm install
npm run generate:events
npm run dev
```

Then open the local Vite URL.

## Event format

Events are defined in `public/events.json` (or generated via the CLI for legacy zoom).

### New keyframe format (recommended)
```ts
type AnimationEvent = {
  type: "zoom" | "shake" | "rotate" | "opacity" | "blur";
  start: number;     // seconds (start time)
  duration: number;  // seconds
  from: number;
  to: number;
  easing?: "linear" | "easeOutCubic" | "easeOutExpo" | "smoothstep";
};
```

- `from`/`to` semantics:
  - `zoom`: scale multiplier (e.g. `1.0` → `1.2`)
  - `shake`: amplitude in pixels
  - `rotate`: rotation in radians
  - `opacity`: 0–255 (for `tint()`)
  - `blur`: pixels (via canvas filter)

### Legacy format (still supported for zoom)
```ts
type AnimationEvent = {
  type: "zoom";
  time: number;
  duration: number;
  strength: number;
};
```
Legacy zoom events continue to work exactly as before (additive pulses). The renderer supports mixing legacy and new events.

Example mixed events (see `public/events.json`):
```json
[
  { "type": "zoom", "time": 0, "duration": 0.5, "strength": 0.08 },
  { "type": "shake", "start": 2.0, "duration": 0.35, "from": 0, "to": 22, "easing": "easeOutExpo" },
  { "type": "rotate", "start": 5.5, "duration": 2.0, "from": -0.07, "to": 0.07, "easing": "easeOutCubic" }
]
```

## Notes

- Rendering code is isolated in `src/main.ts`.
- Time/event logic is pure and p5-independent in `src/core` and `src/animations`.
- Architecture details: `docs/architecture.md`.
