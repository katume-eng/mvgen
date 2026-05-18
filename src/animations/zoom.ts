import { easeOutExpo } from "../core/easing";
import { getActiveEvents, getEventsByType } from "../core/timeline";
import type { AnimationEvent } from "../core/types";

export const computeZoomAtTime = (time: number, events: AnimationEvent[]): number => {
  const zoomEvents = getEventsByType("zoom", events);
  const activeZoomEvents = getActiveEvents(time, zoomEvents);

  const zoomDelta = activeZoomEvents.reduce((sum, event) => {
    if (event.duration <= 0) {
      return sum;
    }

    const progress = (time - event.time) / event.duration;
    const decay = easeOutExpo(1 - progress);
    return sum + event.strength * decay;
  }, 0);

  return 1 + zoomDelta;
};
