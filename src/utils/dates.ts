/**
 * Compute the difference in dates, measured in ms
 */
export function compareDates(date1: Date, date2: Date, timeless?: boolean) {
  if (timeless !== false) {
    return new Date(date1.getTime()).setHours(0,0,0,0)
      - new Date(date2.getTime()).setHours(0,0,0,0);
  }

  return date1.getTime() - date2.getTime();
}
