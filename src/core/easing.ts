const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const linear = (t: number): number => clamp01(t);

export const easeOutCubic = (t: number): number => {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
};

export const easeOutExpo = (t: number): number => {
  const x = clamp01(t);
  if (x === 1) {
    return 1;
  }

  return 1 - Math.pow(2, -10 * x);
};

export const smoothstep = (t: number): number => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

const easingMap: Record<string, (t: number) => number> = {
  linear,
  easeOutCubic,
  easeOutExpo,
  smoothstep,
};

export const getEasingFunction = (name?: string): (t: number) => number => {
  if (!name) return easeOutExpo;
  return easingMap[name] ?? easeOutExpo;
};
