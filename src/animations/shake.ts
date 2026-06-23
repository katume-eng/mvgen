import { getActiveEvents, getEventsByType, getEventStart } from "../core/timeline";
import { getEasingFunction } from "../core/easing";
import type { AnimationEvent } from "../core/types";

// Returns a shake offset amount (pixels).
// Uses from/to as amplitude range, then applies sinusoidal oscillation during the event.
export const computeShakeAtTime = (time: number, events: AnimationEvent[]): number => {
  const shakeEvents = getEventsByType("shake", events);
  const active = getActiveEvents(time, shakeEvents);

  if (active.length === 0) {
    return 0;
  }

  // last-wins amplitude
  const event = active[active.length - 1];
  const start = getEventStart(event);

  if (event.duration <= 0) {
    return 0;
  }

  const progress = Math.min(1, Math.max(0, (time - start) / event.duration));
  const easingFn = getEasingFunction(event.easing);
  const eased = easingFn(progress);

  const from = typeof event.from === "number" ? event.from : 0;
  const to = typeof event.to === "number" ? event.to : 0;
  const amplitude = from + (to - from) * eased;

  if (amplitude === 0) return 0;

  // Oscillation (approx 25-30Hz feel for "shake")
  const phase = (time - start) * 28;
  return amplitude * Math.sin(phase);
};
