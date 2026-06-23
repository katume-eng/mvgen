import type { AnimationEvent, AnimationEventType } from "./types";

export const getEventStart = (event: AnimationEvent): number => {
  return event.start ?? event.time ?? 0;
};

export const getActiveEvents = (
  time: number,
  events: AnimationEvent[]
): AnimationEvent[] => events.filter((event) => {
  const start = getEventStart(event);
  return time >= start && time <= start + event.duration;
});

export const getEventsByType = (
  type: AnimationEventType,
  events: AnimationEvent[]
): AnimationEvent[] => events.filter((event) => event.type === type);
