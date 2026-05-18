export type AnimationEventType = "zoom" | "shake" | "flash" | string;

export type AnimationEvent = {
  type: AnimationEventType;
  time: number;
  duration: number;
  strength: number;
};
