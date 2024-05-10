import { defaultRemainingContestTime } from "model/SectorRecord";

export function getRemainingTime(
  originRemainingTime: number | undefined,
  timerStartTime: number | undefined,
  curTime: number
): number {
  const remainingTime =
    (originRemainingTime ?? defaultRemainingContestTime) -
    (curTime - (timerStartTime ?? curTime));
  return remainingTime > 0 ? remainingTime : 0;
}
