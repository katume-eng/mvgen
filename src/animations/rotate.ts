import { computeValueAtTime } from "./interpolate";
import type { AnimationEvent } from "../core/types";

// Returns rotation in radians (p5 default).
// from/to should be small values e.g. -0.1 to 0.1
export const computeRotateAtTime = (time: number, events: AnimationEvent[]): number => {
  return computeValueAtTime(time, events, "rotate", 0);
};
