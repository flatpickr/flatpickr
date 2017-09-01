export interface Locale {
  weekdays: {
    shorthand: [string, string, string, string, string, string, string],
    longhand: [
      string, string, string, string,
      string, string, string
    ]
  },
  months: {
    shorthand: [
      string, string, string, string,
      string, string, string, string,
      string, string, string, string
    ],
    longhand: [
      string, string, string,  string,
      string, string, string, string,
      string, string, string, string
    ]
  },
  daysInMonth: [number, number, number, number, number, number, number, number, number, number, number, number],
  firstDayOfWeek: number,
  ordinal?: (nth: number) => string,
  rangeSeparator: string,
  weekAbbreviation: string,
  scrollTitle: string,
  toggleTitle: string
}
