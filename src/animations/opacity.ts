import { computeValueAtTime } from "./interpolate";
import type { AnimationEvent } from "../core/types";

// Returns 0-255 for use with p5 tint()
export const computeOpacityAtTime = (time: number, events: AnimationEvent[]): number => {
  return computeValueAtTime(time, events, "opacity", 255);
};
