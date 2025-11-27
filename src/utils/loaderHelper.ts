export const RADIUS = 58;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function getStrokeOffset(progress: number): number {
  return CIRCUMFERENCE * (1 - progress / 100);
}

export function getStepThreshold(stepsCount: number): number {
  return 100 / stepsCount;
}

export function isStepFilled(progress: number, index: number, stepThreshold: number): boolean {
  return progress >= index * stepThreshold;
}

export function getStepRotation(index: number): number {
  return -45 + index * 5;
}

export function getStepWidth(index: number): number {
  return 16 + index * 6;
}
