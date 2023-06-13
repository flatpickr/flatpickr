import { int, pad } from "../utils";
import { Locale } from "../types/locale";
import { defaults, BaseOptions } from "../types/options";

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
  | "u"
  | "w"
  | "y";

const doNothing = (): undefined => undefined;

export const monthToStr = (
  monthNumber: number,
  shorthand: boolean,
  locale: Locale
) => locale.months[shorthand ? "shorthand" : "longhand"][monthNumber];

const setDateSeconds = (
  dateObj: Date,
  secondsStr: string,
  isAbsolute: boolean
): void => {
  const secondsArr = secondsStr.split(".", 2);
  let seconds = parseInt(secondsArr[0]);
  let nanos =
    secondsArr.length > 1
      ? Math.floor(
          parseInt(secondsArr[1]) * Math.pow(10, 9 - secondsArr[1].length)
        )
      : 0;

  if (isAbsolute) {
    dateObj.setTime(seconds * 1000);
  } else {
    dateObj.setSeconds(seconds);
  }

  dateObj.setMilliseconds(Math.floor(nanos / 1_000_000));
  nanos = nanos - dateObj.getMilliseconds() * 1_000_000;

  if (nanos) {
    (dateObj as any).flatpickrNanoseconds = nanos;
  } else if ((dateObj as any).flatpickrNanoseconds !== undefined) {
    delete (dateObj as any).flatpickrNanoseconds;
  }
};

const formatDateSeconds = (
  date: Date,
  isAbsolute: boolean,
  formatSecondsPrecision: number
): string => {
  const seconds = isAbsolute
    ? Math.floor(date.getTime() / 1000)
    : date.getSeconds();
  const nanos =
    date.getMilliseconds() * 1_000_000 +
    ((date as any).flatpickrNanoseconds || 0);

  if (formatSecondsPrecision > 0) {
    return seconds + "." + pad(nanos, 9).slice(0, formatSecondsPrecision);
  } else if (formatSecondsPrecision < 0 && nanos) {
    return seconds + "." + pad(nanos, 9).replace(/0+$/, "");
  }
  return "" + seconds;
};

const moveNumberDot = (number: string, offset: number): string => {
  let pos = number.indexOf(".");
  if (pos !== -1) {
    number = number.slice(0, pos) + number.slice(pos + 1);
  } else {
    pos = number.length;
  }

  const newPos = pos + offset;
  if (newPos <= 0) {
    return "0." + pad(number, -newPos + 1);
  } else if (newPos < number.length) {
    return number.slice(0, newPos) + "." + number.slice(newPos);
  }

  while (newPos > number.length) {
    number += "0";
  }
  return number;
};

export type RevFormatFn = (
  date: Date,
  data: string,
  locale: Locale
) => Date | void;
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
  S: (dateObj: Date, seconds: string) => {
    setDateSeconds(dateObj, seconds, false);
  },
  U: (dateObj: Date, unixSeconds: string) => {
    setDateSeconds(dateObj, unixSeconds, true);
  },

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
    setDateSeconds(dateObj, seconds, false);
  },
  u: (dateObj: Date, unixMilliseconds: string) => {
    setDateSeconds(dateObj, moveNumberDot(unixMilliseconds, -3), true);
  },
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
  S: "(\\d{1,2}(?:\\.\\d+)?)",
  U: "(\\d+(?:\\.\\d+)?)",
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
  s: "(\\d{1,2}(?:\\.\\d+)?)",
  u: "(\\d+(?:\\.\\d+)?)",
  w: "(\\d{1,2})",
  y: "(\\d{2})",
};

type ParsedFormatSecondsPrecision = BaseOptions["formatSecondsPrecision"];
export type Formats = Record<
  token,
  (
    date: Date,
    locale: Locale,
    formatSecondsPrecision: ParsedFormatSecondsPrecision
  ) => string
>;
export const formats: Formats = {
  // get the date in UTC
  Z: (date: Date) => date.toISOString(),

  // weekday name, short, e.g. Thu
  D: function (
    date: Date,
    locale: Locale,
    formatSecondsPrecision: ParsedFormatSecondsPrecision
  ) {
    return locale.weekdays.shorthand[
      parseInt(formats.w(date, locale, formatSecondsPrecision))
    ];
  },

  // full month name e.g. January
  F: function (
    date: Date,
    locale: Locale,
    formatSecondsPrecision: ParsedFormatSecondsPrecision
  ) {
    return monthToStr(
      parseInt(formats.n(date, locale, formatSecondsPrecision)) - 1,
      false,
      locale
    );
  },

  // padded hour 1-12
  G: function (
    date: Date,
    locale: Locale,
    formatSecondsPrecision: ParsedFormatSecondsPrecision
  ) {
    return pad(formats.h(date, locale, formatSecondsPrecision));
  },

  // hours with leading zero e.g. 03
  H: (date: Date) => pad(date.getHours()),

  // day (1-30) with ordinal suffix e.g. 1st, 2nd
  J: function (date: Date, locale: Locale) {
    return (
      date.getDate() +
      (locale.ordinal !== undefined ? locale.ordinal(date.getDate()) : "")
    );
  },

  // AM/PM
  K: (date: Date, locale: Locale) => locale.amPM[int(date.getHours() > 11)],

  // shorthand month e.g. Jan, Sep, Oct, etc
  M: function (date: Date, locale: Locale) {
    return monthToStr(date.getMonth(), true, locale);
  },

  // seconds (00-59)
  S: (
    date: Date,
    _: Locale,
    formatSecondsPrecision: ParsedFormatSecondsPrecision
  ) => {
    const res = formatDateSeconds(date, false, formatSecondsPrecision);
    const resArr = res.split(".");
    resArr[0] = pad(resArr[0], 2);
    return resArr.join(".");
  },

  // unix timestamp
  U: (
    date: Date,
    _: Locale,
    formatSecondsPrecision: ParsedFormatSecondsPrecision
  ) => formatDateSeconds(date, true, formatSecondsPrecision),

  W: (date: Date) => "" + defaults.getWeek(date), // overrided by createDateFormatter, cannot use globals here

  // full year e.g. 2016, padded (0001-9999)
  Y: (date: Date) => pad(date.getFullYear(), 4),

  // day in month, padded (01-30)
  d: (date: Date) => pad(date.getDate()),

  // hour from 1-12 (am/pm)
  h: (date: Date) => "" + (date.getHours() % 12 ? date.getHours() % 12 : 12),

  // minutes, padded with leading zero e.g. 09
  i: (date: Date) => pad(date.getMinutes()),

  // day in month (1-30)
  j: (date: Date) => "" + date.getDate(),

  // weekday name, full, e.g. Thursday
  l: function (date: Date, locale: Locale) {
    return locale.weekdays.longhand[date.getDay()];
  },

  // padded month number (01-12)
  m: (date: Date) => pad(date.getMonth() + 1),

  // the month number (1-12)
  n: (date: Date) => "" + (date.getMonth() + 1),

  // seconds (0-59)
  s: (
    date: Date,
    _: Locale,
    formatSecondsPrecision: ParsedFormatSecondsPrecision
  ) => formatDateSeconds(date, false, formatSecondsPrecision),

  // Unix Milliseconds
  u: (
    date: Date,
    _: Locale,
    formatSecondsPrecision: ParsedFormatSecondsPrecision
  ) => moveNumberDot(formatDateSeconds(date, true, formatSecondsPrecision), 3),

  // number of the day of the week
  w: (date: Date) => "" + date.getDay(),

  // last two digits of year e.g. 16 for 2016
  y: (date: Date) => String(date.getFullYear()).substring(2),
};
