import { int, pad } from "../utils";
import { Locale } from "../types/locale";
import { ParsedOptions } from "../types/options";

export type token =
  | "D"
  | "F"
  | "G"
  | "H"
  | "J"
  | "K"
  | "M"
  | "N"
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
  | "u"
  | "w"
  | "y";

const doNothing = (): undefined => undefined;

export const monthToStr = (
  monthNumber: number,
  shorthand: boolean,
  locale: Locale
) => locale.months[shorthand ? "shorthand" : "longhand"][monthNumber];

export type RevFormatFn = (
  date: Date,
  data: string,
  locale: Locale
) => Date | void | undefined;
export type RevFormat = Record<string, RevFormatFn>;
export const revFormat: RevFormat = {
  D: doNothing,
  F: function (dateObj: Date, monthName: string, locale: Locale) {
    dateObj.setMonth(locale.months.longhand.indexOf(monthName));
  },
  G: (dateObj: Date, hour: string) => {
    dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
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
  M: function (dateObj: Date, shortMonth: string, locale: Locale) {
    dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
  },
  N: (dateObj: Date, fractionalSeconds: string) => {
    var nanos = Math.floor(
      parseFloat(fractionalSeconds) * Math.pow(10, 9 - fractionalSeconds.length)
    );
    dateObj.setMilliseconds(Math.floor(nanos / 1_000_000));
    nanos = nanos - dateObj.getMilliseconds() * 1_000_000;
    if (nanos) {
      (dateObj as any).flatpickrNanoseconds = nanos;
    } else if ((dateObj as any).flatpickrNanoseconds !== undefined) {
      delete (dateObj as any).flatpickrNanoseconds;
    }
  },
  S: (dateObj: Date, seconds: string) => {
    dateObj.setSeconds(parseFloat(seconds));
  },
  U: (_: Date, unixSeconds: string) => new Date(parseFloat(unixSeconds) * 1000),

  W: function (dateObj: Date, weekNum: string, locale: Locale) {
    const weekNumber = parseInt(weekNum);
    const date = new Date(
      dateObj.getFullYear(),
      0,
      2 + (weekNumber - 1) * 7,
      0,
      0,
      0,
      0
    );
    date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);

    return date;
  },
  Y: (dateObj: Date, year: string) => {
    dateObj.setFullYear(parseFloat(year));
  },
  Z: (_: Date, ISODate: string) => new Date(ISODate),

  d: (dateObj: Date, day: string) => {
    dateObj.setDate(parseFloat(day));
  },
  h: (dateObj: Date, hour: string) => {
    dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
  },
  i: (dateObj: Date, minutes: string) => {
    dateObj.setMinutes(parseFloat(minutes));
  },
  j: (dateObj: Date, day: string) => {
    dateObj.setDate(parseFloat(day));
  },
  l: doNothing,
  m: (dateObj: Date, month: string) => {
    dateObj.setMonth(parseFloat(month) - 1);
  },
  n: (dateObj: Date, month: string) => {
    dateObj.setMonth(parseFloat(month) - 1);
  },
  s: (dateObj: Date, seconds: string) => {
    dateObj.setSeconds(parseFloat(seconds));
  },
  u: (_: Date, unixMillSeconds: string) =>
    new Date(parseFloat(unixMillSeconds)),
  w: doNothing,
  y: (dateObj: Date, year: string) => {
    dateObj.setFullYear(2000 + parseFloat(year));
  },
};

export type TokenRegex = { [k in token]: string };
export const tokenRegex: TokenRegex = {
  D: "", // locale-dependent, setup on runtime
  F: "", // locale-dependent, setup on runtime
  G: "(\\d{1,2})",
  H: "(\\d{1,2})",
  J: "(\\d{1,2})\\w+",
  K: "", // locale-dependent, setup on runtime
  M: "", // locale-dependent, setup on runtime
  N: "((?<=\\.)\\d+(?!\\d))",
  S: "(\\d{1,2})",
  U: "(\\d+)",
  W: "(\\d{1,2})",
  Y: "(\\d{4})",
  Z: "(.+)",
  d: "(\\d{1,2})",
  h: "(\\d{1,2})",
  i: "(\\d{1,2})",
  j: "(\\d{1,2})",
  l: "", // locale-dependent, setup on runtime
  m: "(\\d{1,2})",
  n: "(\\d{1,2})",
  s: "(\\d{1,2})",
  u: "(\\d+)",
  w: "(\\d{1,2})",
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
  D: function (date: Date, locale: Locale, options: ParsedOptions) {
    return locale.weekdays.shorthand[
      formats.w(date, locale, options) as number
    ];
  },

  // full month name e.g. January
  F: function (date: Date, locale: Locale, options: ParsedOptions) {
    return monthToStr(
      (formats.n(date, locale, options) as number) - 1,
      false,
      locale
    );
  },

  // padded hour 1-12
  G: function (date: Date, locale: Locale, options: ParsedOptions) {
    return pad(formats.h(date, locale, options));
  },

  // hours with leading zero e.g. 03
  H: (date: Date) => pad(date.getHours()),

  // day (1-30) with ordinal suffix e.g. 1st, 2nd
  J: function (date: Date, locale: Locale) {
    return locale.ordinal !== undefined
      ? date.getDate() + locale.ordinal(date.getDate())
      : date.getDate();
  },

  // AM/PM
  K: (date: Date, locale: Locale) => locale.amPM[int(date.getHours() > 11)],

  // shorthand month e.g. Jan, Sep, Oct, etc
  M: function (date: Date, locale: Locale) {
    return monthToStr(date.getMonth(), true, locale);
  },

  // fractional seconds with nanosecond precision (0-999_999_999)
  N: (date: Date) =>
    pad(
      date.getMilliseconds() * 1_000_000 +
        ((date as any).flatpickrNanoseconds || 0),
      9
    ),

  // seconds (00-59)
  S: (date: Date) => pad(date.getSeconds()),

  // unix timestamp
  U: (date: Date) => Math.floor(date.getTime() / 1000),

  W: function (date: Date, _: Locale, options: ParsedOptions) {
    return options.getWeek(date);
  },

  // full year e.g. 2016, padded (0001-9999)
  Y: (date: Date) => pad(date.getFullYear(), 4),

  // day in month, padded (01-30)
  d: (date: Date) => pad(date.getDate()),

  // hour from 1-12 (am/pm)
  h: (date: Date) => (date.getHours() % 12 ? date.getHours() % 12 : 12),

  // minutes, padded with leading zero e.g. 09
  i: (date: Date) => pad(date.getMinutes()),

  // day in month (1-30)
  j: (date: Date) => date.getDate(),

  // weekday name, full, e.g. Thursday
  l: function (date: Date, locale: Locale) {
    return locale.weekdays.longhand[date.getDay()];
  },

  // padded month number (01-12)
  m: (date: Date) => pad(date.getMonth() + 1),

  // the month number (1-12)
  n: (date: Date) => date.getMonth() + 1,

  // seconds (0-59)
  s: (date: Date) => date.getSeconds(),

  // Unix Milliseconds
  u: (date: Date) => date.getTime(),

  // number of the day of the week
  w: (date: Date) => date.getDay(),

  // last two digits of year e.g. 16 for 2016
  y: (date: Date) => String(date.getFullYear()).substring(2),
};
