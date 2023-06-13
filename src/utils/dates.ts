import { Locale } from "../types/locale";
import {
  tokenRegex,
  RevFormatFn,
  token,
  revFormat,
  formats,
} from "./formatting";
import { defaults, BaseOptions, ParsedOptions } from "../types/options";
import { english } from "../l10n/default";

export interface FormatterArgs {
  config?: ParsedOptions;
  l10n?: Locale;
  isMobile?: boolean;
}

export const createDateFormatter = ({
  config = defaults,
  l10n = english,
  isMobile = false,
}: FormatterArgs) => (
  dateObj: Date,
  format: string,
  overrideLocale?: Locale,
  overrideFormatSecondsPrecision?: BaseOptions["formatSecondsPrecision"]
): string => {
  const locale = overrideLocale || l10n;
  const formatSecondsPrecision =
    overrideFormatSecondsPrecision || config.formatSecondsPrecision || 0;

  if (config.formatDate !== undefined && !isMobile) {
    return config.formatDate(dateObj, format, locale, formatSecondsPrecision);
  }

  return format
    .split("")
    .map((c, i, arr) =>
      formats[c as token] && arr[i - 1] !== "\\"
        ? c === "W"
          ? (date: Date) => "" + config.getWeek(date)
          : formats[c as token](dateObj, locale, formatSecondsPrecision)
        : c !== "\\"
        ? c
        : ""
    )
    .join("");
};

export const createDateParser = ({ config = defaults, l10n = english }) => (
  date: string | Date | number,
  givenFormat?: string,
  timeless: boolean = false,
  overrideLocale?: Locale
): Date | undefined => {
  if (date !== 0 && !date) return undefined;

  const format = givenFormat || config.dateFormat;
  const locale = overrideLocale || l10n;

  let parsedDate: Date | undefined;
  const dateOrig = date;

  if (
    typeof date !== "string" &&
    !(date instanceof Date) &&
    (date as any).toFixed !== undefined // timestamp in milliseconds
  ) {
    date = new Date(date);
  }

  if (date instanceof Date) {
    date = createDateFormatter({ config: config, l10n: l10n })(
      date,
      format,
      locale
    );
  }

  if (typeof date === "string") {
    // date string
    const datestr = String(date).trim();

    if (datestr === "today") {
      parsedDate = new Date();
      timeless = true;
    } else if (config.parseDate) {
      parsedDate = config.parseDate(date, format, timeless, locale);
    } else if (
      /Z$/.test(datestr) ||
      /GMT$/.test(datestr) // datestrings w/ timezone
    ) {
      parsedDate = new Date(date);
    } else {
      let matched = false,
        ops: { fn: RevFormatFn; val: string }[] = [];

      for (let i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
        const token = format[i] as token;
        const isBackSlash = (token as string) === "\\";
        const escaped = format[i - 1] === "\\" || isBackSlash;

        if (tokenRegex[token] && !escaped) {
          regexStr += tokenRegex[token];
          const match = new RegExp(regexStr).exec(date);
          if (match) {
            matched = true;
            ops[token !== "Y" ? "push" : "unshift"]({
              fn: revFormat[token],
              val: match[++matchIndex],
            });
          }
        } else if (!isBackSlash) regexStr += "."; // don't really care
      }

      parsedDate =
        !config || !config.noCalendar
          ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0)
          : new Date(new Date().setHours(0, 0, 0, 0));

      ops.forEach(
        ({ fn, val }) =>
          (parsedDate = fn(parsedDate as Date, val, locale) || parsedDate)
      );

      parsedDate = matched ? parsedDate : undefined;
    }
  }

  /* istanbul ignore next */
  if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
    config.errorHandler(new Error(`Invalid date provided: ${dateOrig}`));
    return undefined;
  }

  return timeless === true
    ? new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate()
      )
    : parsedDate;
};

/**
 * Compute the difference in dates, measured in ms
 */
export function compareDates(date1: Date, date2: Date, timeless = true) {
  if (timeless !== false) {
    return (
      new Date(date1.getTime()).setHours(0, 0, 0, 0) -
      new Date(date2.getTime()).setHours(0, 0, 0, 0)
    );
  }

  return date1.getTime() - date2.getTime();
}

/**
 * Compute the difference in times, measured in ms
 */
export function compareTimes(date1: Date, date2: Date) {
  return (
    3600 * (date1.getHours() - date2.getHours()) +
    60 * (date1.getMinutes() - date2.getMinutes()) +
    date1.getSeconds() -
    date2.getSeconds()
  );
}

export const isBetween = (ts: number, ts1: number, ts2: number) => {
  return ts > Math.min(ts1, ts2) && ts < Math.max(ts1, ts2);
};

export const calculateSecondsSinceMidnight = (
  hours: number,
  minutes: number,
  seconds: number
) => {
  return hours * 3600 + minutes * 60 + seconds;
};

export const parseSeconds = (secondsSinceMidnight: number) => {
  const hours = Math.floor(secondsSinceMidnight / 3600),
    minutes = (secondsSinceMidnight - hours * 3600) / 60;
  return [hours, minutes, secondsSinceMidnight - hours * 3600 - minutes * 60];
};

export const duration = {
  DAY: 86_400_000,
};

export function getDefaultHours(config: ParsedOptions) {
  let hours = config.defaultHour;
  let minutes = config.defaultMinute;
  let seconds = config.defaultSeconds;

  if (config.minDate !== undefined) {
    const minHour = config.minDate.getHours();
    const minMinutes = config.minDate.getMinutes();
    const minSeconds = config.minDate.getSeconds();

    if (hours < minHour) {
      hours = minHour;
    }

    if (hours === minHour && minutes < minMinutes) {
      minutes = minMinutes;
    }

    if (hours === minHour && minutes === minMinutes && seconds < minSeconds)
      seconds = config.minDate.getSeconds();
  }

  if (config.maxDate !== undefined) {
    const maxHr = config.maxDate.getHours();
    const maxMinutes = config.maxDate.getMinutes();
    hours = Math.min(hours, maxHr);

    if (hours === maxHr) minutes = Math.min(maxMinutes, minutes);
    if (hours === maxHr && minutes === maxMinutes)
      seconds = config.maxDate.getSeconds();
  }

  return { hours, minutes, seconds };
}
