import { int, pad } from "../utils";
import { Locale } from "../types/locale";
import { ParsedOptions } from "../types/options";
import { convertToNational } from "../utils/nationalcalendar";

export type token =
  | "D"
  | "F"
  | "G"
  | "H"
  | "J"
  | "K"
  | "M"
  | "S"
  | "U"
  | "W"
  | "Y"
  | "Z"
  | "d"
  | "h"
  | "i"
  | "j"
  | "l"
  | "m"
  | "n"
  | "s"
  | "w"
  | "y";

const do_nothing = (): undefined => undefined;

export const monthToStr = (
  monthNumber: number,
  shorthand: boolean,
  locale: Locale,
  typeCalendar: string
) =>
  !typeCalendar || typeCalendar === "none"
    ? locale.months[shorthand ? "shorthand" : "longhand"][monthNumber]
    : locale.monthsHijri[shorthand ? "shorthand" : "longhand"][monthNumber];

export type RevFormatFn = (
  date: Date,
  data: string,
  locale: Locale
) => Date | void | undefined;
export type RevFormat = Record<string, RevFormatFn>;
export const revFormat: RevFormat = {
  D: do_nothing,
  F: function(dateObj: Date, monthName: string, locale: Locale) {
    dateObj.setMonth(locale.months.longhand.indexOf(monthName));
  },
  G: (dateObj: Date, hour: string) => {
    dateObj.setHours(parseFloat(hour));
  },
  H: (dateObj: Date, hour: string) => {
    dateObj.setHours(parseFloat(hour));
  },
  J: (dateObj: Date, day: string) => {
    dateObj.setDate(parseFloat(day));
  },
  K: (dateObj: Date, amPM: string, locale: Locale) => {
    dateObj.setHours(
      (dateObj.getHours() % 12) +
        12 * int(new RegExp(locale.amPM[1], "i").test(amPM))
    );
  },
  M: function(dateObj: Date, shortMonth: string, locale: Locale) {
    dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
  },
  S: (dateObj: Date, seconds: string) => {
    dateObj.setSeconds(parseFloat(seconds));
  },
  U: (_: Date, unixSeconds: string) => new Date(parseFloat(unixSeconds) * 1000),

  W: function(dateObj: Date, weekNum: string) {
    const weekNumber = parseInt(weekNum);
    return new Date(
      dateObj.getFullYear(),
      0,
      2 + (weekNumber - 1) * 7,
      0,
      0,
      0,
      0
    );
  },
  Y: (dateObj: Date, year: string) => {
    dateObj.setFullYear(parseFloat(year));
  },
  Z: (_: Date, ISODate: string) => new Date(ISODate),

  d: (dateObj: Date, day: string) => {
    dateObj.setDate(parseFloat(day));
  },
  h: (dateObj: Date, hour: string) => {
    dateObj.setHours(parseFloat(hour));
  },
  i: (dateObj: Date, minutes: string) => {
    dateObj.setMinutes(parseFloat(minutes));
  },
  j: (dateObj: Date, day: string) => {
    dateObj.setDate(parseFloat(day));
  },
  l: do_nothing,
  m: (dateObj: Date, month: string) => {
    dateObj.setMonth(parseFloat(month) - 1);
  },
  n: (dateObj: Date, month: string) => {
    dateObj.setMonth(parseFloat(month) - 1);
  },
  s: (dateObj: Date, seconds: string) => {
    dateObj.setSeconds(parseFloat(seconds));
  },
  w: do_nothing,
  y: (dateObj: Date, year: string) => {
    dateObj.setFullYear(2000 + parseFloat(year));
  },
};

export type TokenRegex = { [k in token]: string };
export const tokenRegex: TokenRegex = {
  D: "(\\w+)",
  F: "(\\w+)",
  G: "(\\d\\d|\\d)",
  H: "(\\d\\d|\\d)",
  J: "(\\d\\d|\\d)\\w+",
  K: "", // locale-dependent, setup on runtime
  M: "(\\w+)",
  S: "(\\d\\d|\\d)",
  U: "(.+)",
  W: "(\\d\\d|\\d)",
  Y: "(\\d{4})",
  Z: "(.+)",
  d: "(\\d\\d|\\d)",
  h: "(\\d\\d|\\d)",
  i: "(\\d\\d|\\d)",
  j: "(\\d\\d|\\d)",
  l: "(\\w+)",
  m: "(\\d\\d|\\d)",
  n: "(\\d\\d|\\d)",
  s: "(\\d\\d|\\d)",
  w: "(\\d\\d|\\d)",
  y: "(\\d{2})",
};

export type Formats = Record<
  token,
  (date: Date, locale: Locale, options: ParsedOptions) => string | number
>;
export const formats: Formats = {
  // get the date in UTC
  Z: (date: Date) => date.toISOString(),

  // weekday name, short, e.g. Thu
  D: function(date: Date, locale: Locale, options: ParsedOptions) {
    return locale.weekdays.shorthand[
      formats.w(date, locale, options) as number
    ];
  },

  // full month name e.g. January
  F: function(date: Date, locale: Locale, options: ParsedOptions) {
    if (!options.typeCalendar || options.typeCalendar === "none") {
      return monthToStr(
        (formats.n(date, locale, options) as number) - 1,
        false,
        locale
      );
    } else {
      const nDate = convertToNational(date, options.typeCalendar);
      return monthToStr(nDate.nMonth, false, locale, options.typeCalendar);
    }
  },

  // padded hour 1-12
  G: function(date: Date, locale: Locale, options: ParsedOptions) {
    return pad(formats.h(date, locale, options));
  },

  // hours with leading zero e.g. 03
  H: (date: Date) => pad(date.getHours()),

  // day (1-30) with ordinal suffix e.g. 1st, 2nd
  J: function(date: Date, _: Locale, options: ParsedOptions) {
    if (!options.typeCalendar || options.typeCalendar === "none") {
      return locale.ordinal !== undefined
        ? date.getDate() + locale.ordinal(date.getDate())
        : date.getDate();
    } else {
      const nDate = convertToNational(date, options.typeCalendar);
      return locale.ordinal !== undefined
        ? nDate.nDay + locale.ordinal(nDate.nDay)
        : nDate.nDay;
    }
  },

  // AM/PM
  K: (date: Date, locale: Locale) => locale.amPM[int(date.getHours() > 11)],

  // shorthand month e.g. Jan, Sep, Oct, etc
  M: function(date: Date, locale: Locale, options: ParsedOptions) {
    if (!options.typeCalendar || options.typeCalendar === "none") {
      return monthToStr(date.getMonth(), true, locale);
    } else {
      const nDate = convertToNational(date, options.typeCalendar);
      return monthToStr(nDate.nMonth, true, locale, options.typeCalendar);
    }
  },

  // seconds 00-59
  S: (date: Date) => pad(date.getSeconds()),

  // unix timestamp
  U: (date: Date) => date.getTime() / 1000,

  W: function(date: Date, _: Locale, options: ParsedOptions) {
    return options.getWeek(date);
  },

  // full year e.g. 2016
  Y: function(date: Date, _: Locale, options: ParsedOptions) {
    if (!options.typeCalendar || options.typeCalendar === "none") {
      return date.getFullYear();
    } else {
      const nDate = convertToNational(date, options.typeCalendar);
      return nDate.nYear;
    }
  },

  // day in month, padded (01-30)
  d: function(date: Date, _: Locale, options: ParsedOptions) {
    if (!options.typeCalendar || options.typeCalendar === "none") {
      return pad(date.getDate());
    } else {
      const nDate = convertToNational(date, options.typeCalendar);
      return pad(nDate.nDay);
    }
  },

  // hour from 1-12 (am/pm)
  h: (date: Date) => (date.getHours() % 12 ? date.getHours() % 12 : 12),

  // minutes, padded with leading zero e.g. 09
  i: (date: Date) => pad(date.getMinutes()),

  // day in month (1-30)
  j: function(date: Date, _: Locale, options: ParsedOptions) {
    if (!options.typeCalendar || options.typeCalendar === "none") {
      return date.getDate();
    } else {
      const nDate = convertToNational(date, options.typeCalendar);
      return nDate.nDay;
    }
  },

  // weekday name, full, e.g. Thursday
  l: function(date: Date, locale: Locale) {
    return locale.weekdays.longhand[date.getDay()];
  },

  // padded month number (01-12)
  m: function(date: Date, _: Locale, options: ParsedOptions) {
    if (!options.typeCalendar || options.typeCalendar === "none") {
      pad(date.getMonth() + 1);
    } else {
      const nDate = convertToNational(date, options.typeCalendar);
      return pad(nDate.nMonth + 1);
    }
  },

  // the month number (1-12)
  n: function(date: Date, _: Locale, options: ParsedOptions) {
    if (!options.typeCalendar || options.typeCalendar === "none") {
      return date.getMonth() + 1;
    } else {
      const nDate = convertToNational(date, options.typeCalendar);
      return nDate.nMonth + 1;
    }
  },

  // seconds 0-59
  s: (date: Date) => date.getSeconds(),

  // number of the day of the week
  w: (date: Date) => date.getDay(),

  // last two digits of year e.g. 16 for 2016
  y: function(date: Date, _: Locale, options: ParsedOptions) {
    if (!options.typeCalendar || options.typeCalendar === "none") {
      return String(date.getFullYear()).substring(2);
    } else {
      const nDate = convertToNational(date, options.typeCalendar);
      return String(nDate.nYear).substring(2);
    }
  },
};
