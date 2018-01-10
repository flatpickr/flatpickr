import { Locale } from "../types/locale";
import { ParsedOptions } from "../types/options";
export interface FormatterArgs {
  config?: ParsedOptions;
  l10n?: Locale;
}
export declare const createDateFormatter: (
  { config, l10n }: FormatterArgs
) => (dateObj: Date, frmt: string) => string;
export declare const createDateParser: (
  {
    config,
    l10n,
  }: {
    config?: ParsedOptions;
    l10n?: Locale;
  }
) => (
  date: string | number | Date,
  givenFormat?: string | undefined,
  timeless?: boolean | undefined
) => Date | undefined;
export declare function compareDates(
  date1: Date,
  date2: Date,
  timeless?: boolean
): number;
export declare function compareTimes(date1: Date, date2: Date): number;
export declare const monthToStr: (
  monthNumber: number,
  shorthand: boolean,
  locale: Locale
) => string;
export declare const getWeek: (givenDate: Date) => number;
export declare const duration: {
  DAY: number;
};
