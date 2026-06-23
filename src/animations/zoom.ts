import { easeOutExpo } from "../core/easing";
import { getActiveEvents, getEventsByType, getEventStart } from "../core/timeline";
import { computeValueAtTime } from "./interpolate";
import type { AnimationEvent } from "../core/types";

// Legacy zoom behavior (strength + decay) is preserved exactly for backward compatibility.
export const computeZoomAtTime = (time: number, events: AnimationEvent[]): number => {
  const zoomEvents = getEventsByType("zoom", events);
  const activeZoomEvents = getActiveEvents(time, zoomEvents);

  // Separate legacy vs new format
  const legacyEvents = activeZoomEvents.filter((e) => typeof e.strength === "number");
  const newEvents = activeZoomEvents.filter((e) => typeof e.from === "number" && typeof e.to === "number");

  // Legacy path: unchanged behavior (additive pulses using strength + easeOutExpo decay)
  const legacyDelta = legacyEvents.reduce((sum, event) => {
    if (event.duration <= 0) {
      return sum;
    }
    const start = getEventStart(event);
    const progress = (time - start) / event.duration;
    const decay = easeOutExpo(1 - Math.min(1, Math.max(0, progress)));
    return sum + (event.strength as number) * decay;
  }, 0);

  // New keyframe path: use from/to interpolation (returns absolute scale value)
  // For simplicity with overlapping, we take the last-wins value from helper
  const keyframeValue = computeValueAtTime(time, zoomEvents, "zoom", NaN);

  if (newEvents.length > 0 && !Number.isNaN(keyframeValue)) {
    // If there are new-style events, prefer the keyframe value (absolute)
    // Still allow legacy deltas on top for mixed usage (rare)
    return keyframeValue + legacyDelta;
  }

  return 1 + legacyDelta;
};
