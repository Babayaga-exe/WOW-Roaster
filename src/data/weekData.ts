import { week27 } from "./week27";
import { week28 } from "./week28";

export const weeks: Record<number, any> = {
  27: week27,
  28: week28,
};

export const getWeekData = (weekNumber: number) => {
  return weeks[weekNumber] ?? week28; // fallback to week28
};
