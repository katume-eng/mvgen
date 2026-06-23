export type AnimationEventType = "zoom" | "shake" | "rotate" | "opacity" | "blur";

export type AnimationEvent = {
  type: AnimationEventType | string;
  duration: number;
  // Legacy format (for backward compatibility with existing zoom events)
  time?: number;
  strength?: number;
  // New keyframe format
  start?: number;
  from?: number;
  to?: number;
  easing?: string;
};
