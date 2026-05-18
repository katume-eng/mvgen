# MV Engine Architecture (Phase 1 MVP)

## Data Flow

`events.json` (time-based animation events) → pure animation logic → rendering layer (p5.js)

## Modules

- `src/core/types.ts`: shared event model (`AnimationEvent`)
- `src/core/timeline.ts`: event selection helpers
- `src/core/easing.ts`: reusable easing functions
- `src/animations/zoom.ts`: pure zoom value computation
- `src/io/loadEvents.ts`: JSON loading + shape validation
- `src/main.ts`: p5 rendering orchestration (no business logic)
- `scripts/generateEvents.ts`: BPM-based event generation CLI

## Extensibility Notes

- Event model remains abstract (`zoom`, `shake`, `flash`) to avoid audio-source coupling.
- New animation modules can be added as pure functions in `src/animations/`.
- Future offline render/export can reuse core timeline + animation logic with ffmpeg.
