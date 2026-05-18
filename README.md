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

```ts
type AnimationEvent = {
  type: "zoom" | "shake" | "flash";
  time: number;
  duration: number;
  strength: number;
};
```

## Notes

- Rendering code is isolated in `src/main.ts`.
- Time/event logic is pure and p5-independent in `src/core` and `src/animations`.
- Architecture details: `docs/architecture.md`.
