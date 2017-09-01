export type token = "D" | "F" | "G" | "H" | "J" | "K" | "M" | "S" | "U" | "W" | "Y" | "Z" | "d" | "h" | "i" | "j" | "l" | "m" | "n" | "s" | "w" | "y"

const do_nothing = () => undefined;

export const revFormat: Record<string, (date: Date, data: string) => Date | void | undefined> =  {
  D: do_nothing,
  F: function(dateObj: Date, monthName: string) {
    dateObj.setMonth(this.l10n.months.longhand.indexOf(monthName));
  },
  G: (dateObj: Date, hour: string) => {
    dateObj.setHours(parseFloat(hour))
  },
  H: (dateObj: Date, hour: string) => {
    dateObj.setHours(parseFloat(hour))
  },
  J: (dateObj: Date, day: string) => {
    dateObj.setDate(parseFloat(day))
  },
  K: (dateObj: Date, amPM: string) => {
    const hours = dateObj.getHours();

    if (hours !== 12)
      dateObj.setHours(hours % 12 + 12 * /pm/i.test(amPM));
  },
  M: function(dateObj: Date, shortMonth: string) {
    dateObj.setMonth(this.l10n.months.shorthand.indexOf(shortMonth));
  },
  S: (dateObj: Date, seconds: string) => {
    dateObj.setSeconds(parseFloat(seconds));
  },
  U: (_: Date, unixSeconds: string) => new Date(parseFloat(unixSeconds) * 1000),

  W: function(dateObj: Date, weekNum: string){
    const weekNumber = parseInt(weekNum);
    return new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
  },
  Y: (dateObj: Date, year: string) =>  {
    dateObj.setFullYear(parseFloat(year));
  },
  Z: (_: Date, ISODate: string) => new Date(ISODate),

  d: (dateObj: Date, day: string) =>  {
    dateObj.setDate(parseFloat(day))
  },
  h: (dateObj: Date, hour: string) =>  {
    dateObj.setHours(parseFloat(hour))
  },
  i: (dateObj: Date, minutes: string) =>  {
    dateObj.setMinutes(parseFloat(minutes))
  },
  j: (dateObj: Date, day: string) =>  {
    dateObj.setDate(parseFloat(day))
  },
  l: do_nothing,
  m: (dateObj: Date, month: string) =>  {
    dateObj.setMonth(parseFloat(month) - 1)
  },
  n: (dateObj: Date, month: string) =>  {
    dateObj.setMonth(parseFloat(month) - 1)
  },
  s: (dateObj: Date, seconds: string) =>  {
    dateObj.setSeconds(parseFloat(seconds))
  },
  w: do_nothing,
  y: (dateObj: Date, year: string) =>  {
    dateObj.setFullYear(2000 + parseFloat(year))
  },
}

export const tokenRegex: Record<token, string> = {
  D:"(\\w+)",
  F:"(\\w+)",
  G: "(\\d\\d|\\d)",
  H:"(\\d\\d|\\d)",
  J:"(\\d\\d|\\d)\\w+",
  K:"(am|AM|Am|aM|pm|PM|Pm|pM)",
  M:"(\\w+)",
  S:"(\\d\\d|\\d)",
  U: "(.+)",
  W:"(\\d\\d|\\d)",
  Y:"(\\d{4})",
  Z:"(.+)",
  d:"(\\d\\d|\\d)",
  h:"(\\d\\d|\\d)",
  i:"(\\d\\d|\\d)",
  j:"(\\d\\d|\\d)",
  l:"(\\w+)",
  m:"(\\d\\d|\\d)",
  n:"(\\d\\d|\\d)",
  s:"(\\d\\d|\\d)",
  w: "(\\d\\d|\\d)",
  y:"(\\d{2})"
}

export const formats: Record<token, (date: Date) => string | number> =  {
  // get the date in UTC
  Z: (date: Date) => date.toISOString(),

  // weekday name, short, e.g. Thu
  D: function (date: Date) {
    return self.l10n.weekdays.shorthand[formats.w(date)];
  },

  // full month name e.g. January
  F: function (date: Date) {
    return self.utils.monthToStr(formats.n(date) - 1, false);
  },

  // padded hour 1-12
  G: function (date: Date) {
    return FlatpickrInstance.prototype.pad(
      FlatpickrInstance.prototype.formats.h(date)
    )
  },

  // hours with leading zero e.g. 03
  H: (date: Date) => FlatpickrInstance.prototype.pad(date.getHours()),

  // day (1-30) with ordinal suffix e.g. 1st, 2nd
  J: function (date: Date) {
    return date.getDate() + self.l10n.ordinal(date.getDate())
  },

  // AM/PM
  K: (date: Date) => date.getHours() > 11 ? "PM" : "AM",

  // shorthand month e.g. Jan, Sep, Oct, etc
  M: function (date: Date) {
    return self.utils.monthToStr(date.getMonth(), true);
  },

  // seconds 00-59
  S: (date: Date) => FlatpickrInstance.prototype.pad(date.getSeconds()),

  // unix timestamp
  U: (date: Date) => date.getTime() / 1000,

  W: function (date: Date) {
    return self.config.getWeek(date);
  },

  // full year e.g. 2016
  Y: (date: Date) => date.getFullYear(),

  // day in month, padded (01-30)
  d: (date: Date) => FlatpickrInstance.prototype.pad(date.getDate()),

  // hour from 1-12 (am/pm)
  h: (date: Date) => date.getHours() % 12 ? date.getHours() % 12 : 12,

  // minutes, padded with leading zero e.g. 09
  i: (date: Date) => FlatpickrInstance.prototype.pad(date.getMinutes()),

  // day in month (1-30)
  j: (date: Date) => date.getDate(),

  // weekday name, full, e.g. Thursday
  l: function (date: Date) {
    return self.l10n.weekdays.longhand[date.getDay()];
  },

  // padded month number (01-12)
  m: (date: Date) => FlatpickrInstance.prototype.pad(date.getMonth() + 1),

  // the month number (1-12)
  n: (date: Date) => date.getMonth() + 1,

  // seconds 0-59
  s: (date: Date) => date.getSeconds(),

  // number of the day of the week
  w: (date: Date) => date.getDay(),

  // last two digits of year e.g. 16 for 2016
  y: (date: Date) => String(date.getFullYear()).substring(2)
}
