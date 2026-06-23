import type { AnimationEvent } from "../core/types";

const isValidAnimationEvent = (value: unknown): value is AnimationEvent => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const event = value as Partial<AnimationEvent>;

  if (typeof event.type !== "string") return false;
  if (typeof event.duration !== "number") return false;

  // Support legacy (time + strength) OR new (start + from/to)
  const hasTime = typeof event.time === "number";
  const hasStart = typeof event.start === "number";
  if (!hasTime && !hasStart) return false;

  const hasStrength = typeof event.strength === "number";
  const hasFromTo = typeof event.from === "number" && typeof event.to === "number";
  if (!hasStrength && !hasFromTo) return false;

  return true;
};

export const loadEvents = async (path: string): Promise<AnimationEvent[]> => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load events: ${response.status} ${response.statusText}`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid events format: expected an array");
  }

  const invalidIndex = data.findIndex((event) => !isValidAnimationEvent(event));
  if (invalidIndex !== -1) {
    throw new Error(`Invalid event at index ${invalidIndex}`);
  }

  return data;
};
