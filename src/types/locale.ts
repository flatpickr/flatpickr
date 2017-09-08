interface MonthsWeekDays {
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
  }
}

export type Locale = MonthsWeekDays & {
  daysInMonth: [number, number, number, number, number, number, number, number, number, number, number, number],
  firstDayOfWeek: number,
  ordinal: (nth: number) => string,
  rangeSeparator: string,
  weekAbbreviation: string,
  scrollTitle: string,
  toggleTitle: string
}

export type CustomLocale = MonthsWeekDays & {
  ordinal?: Locale["ordinal"]
  daysInMonth?: Locale["daysInMonth"]
  firstDayOfWeek?: Locale["firstDayOfWeek"]
  rangeSeparator?: Locale["rangeSeparator"]
  weekAbbreviation?: Locale["weekAbbreviation"]
  scrollTitle?: Locale["scrollTitle"]
  toggleTitle?: Locale["toggleTitle"]
}
