export const DAILY_POST_SLOTS = (
  process.env.DEFAULT_POST_TIMES ?? "08:00,12:30,20:00"
)
  .split(",")
  .map((slot) => slot.trim())
  .filter(Boolean);

export function nextDailySlot(from = new Date()): Date {
  const candidates = DAILY_POST_SLOTS.map((slot) => {
    const [hours, minutes] = slot.split(":").map(Number);
    const date = new Date(from);
    date.setHours(hours, minutes, 0, 0);
    return date;
  });

  const todaySlot = candidates.find((candidate) => candidate > from);
  if (todaySlot) return todaySlot;

  const [hours, minutes] = DAILY_POST_SLOTS[0].split(":").map(Number);
  const tomorrow = new Date(from);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(hours, minutes, 0, 0);
  return tomorrow;
}
