import { Instance } from "./instance";
import { CustomLocale, key as LocaleKey } from "./locale";
export declare type DateOption = Date | string | number;
export declare type DateRangeLimit<D = DateOption> = {
  from: D;
  to: D;
};
export declare type DateLimit<D = DateOption> =
  | D
  | DateRangeLimit<D>
  | ((date: Date) => boolean);
export declare type Hook = (
  dates: Date[],
  currentDateString: string,
  self: Instance,
  data?: any
) => void;
export declare type HookKey =
  | "onChange"
  | "onClose"
  | "onDayCreate"
  | "onDestroy"
  | "onKeyDown"
  | "onMonthChange"
  | "onOpen"
  | "onParseConfig"
  | "onReady"
  | "onValueUpdate"
  | "onYearChange"
  | "onPreCalendarPosition";
export declare type Plugin = (fp: Instance) => Options;
export interface Options {
  allowInput?: boolean;
  altFormat?: string;
  altInput?: boolean;
  altInputClass?: string;
  animate?: boolean;
  appendTo?: HTMLElement;
  ariaDateFormat?: string;
  clickOpens?: boolean;
  closeOnSelect?: boolean;
  conjunction?: string;
  dateFormat?: string;
  defaultDate?: DateOption | DateOption[];
  defaultHour?: number;
  defaultMinute?: number;
  defaultSeconds?: number;
  disable?: DateLimit<DateOption>[];
  disableMobile?: boolean;
  enable?: DateLimit<DateOption>[];
  enableSeconds?: boolean;
  enableTime?: boolean;
  errorHandler?: (e: Error) => void;
  formatDate?: (date: Date, format: string) => string;
  getWeek?: (date: Date) => string | number;
  hourIncrement?: number;
  ignoredFocusElements?: HTMLElement[];
  inline?: boolean;
  locale?: LocaleKey | CustomLocale;
  maxDate?: DateOption;
  maxTime?: DateOption;
  minDate?: DateOption;
  minTime?: DateOption;
  minuteIncrement?: number;
  mode?: "single" | "multiple" | "range";
  nextArrow?: string;
  noCalendar?: boolean;
  onChange?: Hook | Hook[];
  onClose?: Hook | Hook[];
  onDayCreate?: Hook | Hook[];
  onDestroy?: Hook | Hook[];
  onKeyDown?: Hook | Hook[];
  onMonthChange?: Hook | Hook[];
  onOpen?: Hook | Hook[];
  onParseConfig?: Hook | Hook[];
  onReady?: Hook | Hook[];
  onValueUpdate?: Hook | Hook[];
  onYearChange?: Hook | Hook[];
  onPreCalendarPosition?: Hook | Hook[];
  parseDate?: (date: string, format: string) => Date;
  plugins?: Plugin[];
  position?: "auto" | "above" | "below";
  positionElement?: Element;
  prevArrow?: string;
  shorthandCurrentMonth?: boolean;
  static?: boolean;
  time_24hr?: boolean;
  weekNumbers?: boolean;
  wrap?: boolean;
  enableMonthScroll?: boolean;
  enableYearScroll?: boolean;
}
export interface ParsedOptions {
  _disable: DateLimit<Date>[];
  _enable: DateLimit<Date>[];
  _maxDate?: Date;
  _maxTime?: Date;
  _minDate?: Date;
  _minTime?: Date;
  allowInput: boolean;
  altFormat: string;
  altInput: boolean;
  altInputClass: string;
  animate: boolean;
  appendTo?: HTMLElement;
  ariaDateFormat: string;
  clickOpens: boolean;
  closeOnSelect: boolean;
  conjunction: string;
  dateFormat: string;
  defaultDate?: Date | Date[];
  defaultHour: number;
  defaultMinute: number;
  defaultSeconds: number;
  disable: DateLimit<Date>[];
  disableMobile: boolean;
  enable: DateLimit<Date>[];
  enableSeconds: boolean;
  enableTime: boolean;
  errorHandler: (err: Error) => void;
  formatDate?: Options["formatDate"];
  getWeek: (date: Date) => string | number;
  hourIncrement: number;
  ignoredFocusElements: HTMLElement[];
  inline: boolean;
  locale: LocaleKey | CustomLocale;
  maxDate?: Date;
  maxTime?: Date;
  minDate?: Date;
  minTime?: Date;
  minuteIncrement: number;
  mode: "single" | "multiple" | "range";
  nextArrow: string;
  noCalendar: boolean;
  onChange: Hook[];
  onClose: Hook[];
  onDayCreate: Hook[];
  onDestroy: Hook[];
  onKeyDown: Hook[];
  onMonthChange: Hook[];
  onOpen: Hook[];
  onParseConfig: Hook[];
  onReady: Hook[];
  onValueUpdate: Hook[];
  onYearChange: Hook[];
  onPreCalendarPosition: Hook[];
  parseDate?: Options["parseDate"];
  plugins: Plugin[];
  position: "auto" | "below" | "above";
  positionElement?: HTMLElement;
  prevArrow: string;
  shorthandCurrentMonth: boolean;
  static: boolean;
  time_24hr: boolean;
  weekNumbers: boolean;
  wrap: boolean;
  enableMonthScroll: boolean;
  enableYearScroll: boolean;
}
export declare const defaults: ParsedOptions;
