import type { AnimationEvent, AnimationEventType } from "./types";

export const getActiveEvents = (
  time: number,
  events: AnimationEvent[]
): AnimationEvent[] => events.filter((event) => time >= event.time && time <= event.time + event.duration);

export const getEventsByType = (
  type: AnimationEventType,
  events: AnimationEvent[]
): AnimationEvent[] => events.filter((event) => event.type === type);
