export const timeRangesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string): boolean => {
  const startA = new Date(aStart).getTime();
  const endA = new Date(aEnd).getTime();
  const startB = new Date(bStart).getTime();
  const endB = new Date(bEnd).getTime();
  if ([startA, endA, startB, endB].some((value) => Number.isNaN(value))) return false;
  return startA < endB && startB < endA;
};

export const isValidTimeRange = (start: string, end: string): boolean => {
  const startAt = new Date(start).getTime();
  const endAt = new Date(end).getTime();
  return !Number.isNaN(startAt) && !Number.isNaN(endAt) && startAt < endAt;
};
