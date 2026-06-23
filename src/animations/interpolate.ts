import { getActiveEvents, getEventsByType, getEventStart } from "../core/timeline";
import { getEasingFunction } from "../core/easing";
import type { AnimationEvent } from "../core/types";

export const computeValueAtTime = (
  time: number,
  events: AnimationEvent[],
  type: string,
  defaultValue: number
): number => {
  const typedEvents = getEventsByType(type as any, events);
  const active = getActiveEvents(time, typedEvents);

  if (active.length === 0) {
    return defaultValue;
  }

  // last-wins for simplicity (minimal implementation, follows no large refactor rule)
  const event = active[active.length - 1];
  const start = getEventStart(event);

  if (event.duration <= 0) {
    return defaultValue;
  }

  const progress = Math.min(1, Math.max(0, (time - start) / event.duration));
  const easingFn = getEasingFunction(event.easing);
  const eased = easingFn(progress);

  if (typeof event.from === "number" && typeof event.to === "number") {
    return event.from + (event.to - event.from) * eased;
  }

  return defaultValue;
};
