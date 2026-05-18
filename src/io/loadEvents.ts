import type { AnimationEvent } from "../core/types";

const isValidAnimationEvent = (value: unknown): value is AnimationEvent => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const event = value as Partial<AnimationEvent>;
  return (
    typeof event.type === "string" &&
    typeof event.time === "number" &&
    typeof event.duration === "number" &&
    typeof event.strength === "number"
  );
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

  return data.filter(isValidAnimationEvent);
};
