import { computeValueAtTime } from "./interpolate";
import type { AnimationEvent } from "../core/types";

// Returns blur amount in pixels (to be applied via drawingContext.filter)
export const computeBlurAtTime = (time: number, events: AnimationEvent[]): number => {
  return computeValueAtTime(time, events, "blur", 0);
};
