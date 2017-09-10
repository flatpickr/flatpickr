import { Instance } from "./instance";
import { getWeek } from "utils/dates";
import { CustomLocale } from "./locale";

export type DateOption = Date | string | number;
export type DateRangeLimit<D = DateOption> = { from: D; to: D };
type DateRangeFn = (date: Date) => boolean;
export type DateLimit<D = DateOption> = D | DateRangeLimit<D> | DateRangeFn;

type Hook = (
  dates: Date[],
  currentDateString: string,
  self: Instance,
  data?: any
) => void;

export type Plugin = (fp: Instance) => Options;

export interface Options {
  mode?: "single" | "multiple" | "range";
  position?: "auto" | "above" | "below";
  animate?: boolean;
  wrap?: boolean;
  weekNumbers?: boolean;
  allowInput?: boolean;
  clickOpens?: boolean;
  closeOnSelect?: boolean;
  time_numberhr?: boolean;
  enableTime?: boolean;
  noCalendar?: boolean;
  dateFormat?: string;
  ariaDateFormat?: string;
  altInput?: boolean;
  altInputClass?: string;
  altFormat?: string;
  defaultDate?: DateOption;
  minDate?: DateOption;
  maxDate?: DateOption;
  parseDate?: (date: string, format: string) => Date;
  formatDate?: (date: Date, format: string) => string;
  getWeek?: (date: Date) => string | number;
  enable?: DateLimit[];
  disable?: DateLimit[];
  shorthandCurrentMonth?: boolean;
  inline?: boolean;

  static?: boolean;
  appendTo?: HTMLElement;
  prevArrow?: string;
  nextArrow?: string;
  enableSeconds?: boolean;
  hourIncrement?: number;
  minuteIncrement?: number;
  defaultHour?: number;
  defaultMinute?: number;
  defaultSeconds?: number;
  disableMobile?: boolean;
  locale?: string | CustomLocale;
  plugins?: Plugin[];
  ignoredFocusElements?: HTMLElement[];
  onClose?: Hook | Hook[];
  onChange?: Hook | Hook[];
  onDayCreate?: Hook | Hook[];
  onMonthChange?: Hook | Hook[];
  onOpen?: Hook | Hook[];
  onParseConfig?: Hook | Hook[];
  onReady?: Hook | Hook[]; // function (dateObj dateStr) {}
  onValueUpdate?: Hook | Hook[];
  onYearChange?: Hook | Hook[];
  onKeyDown?: Hook | Hook[];
  onDestroy?: Hook | Hook[];
  time_24hr?: boolean;
}

export interface ParsedOptions {
  [k: string]: any;
  mode: "single" | "multiple" | "range";
  position: "auto" | "below" | "above";
  animate: boolean;
  wrap: boolean;
  weekNumbers: boolean;
  allowInput: boolean;
  clickOpens: boolean;
  closeOnSelect: boolean;
  time_24hr: boolean;
  enableTime: boolean;
  noCalendar: boolean;
  dateFormat: string;
  ariaDateFormat: string;
  altInput: boolean;
  altInputClass: string;
  altFormat: string;
  defaultDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  parseDate?: Options["parseDate"];
  formatDate?: Options["formatDate"];
  getWeek: (date: Date) => string | number;
  _enable: DateLimit<Date>[];
  enable: DateLimit<Date>[];
  _disable: DateLimit<Date>[];
  disable: DateLimit<Date>[];
  shorthandCurrentMonth: boolean;
  inline: boolean;
  static: boolean;
  appendTo?: HTMLElement;
  prevArrow: string;
  nextArrow: string;
  enableSeconds: boolean;
  hourIncrement: number;
  minuteIncrement: number;
  defaultHour: number;
  defaultMinute: number;
  defaultSeconds: number;
  disableMobile: boolean;
  locale: string | CustomLocale;
  plugins: Plugin[];
  ignoredFocusElements: HTMLElement[];
  onClose: Hook[];
  onChange: Hook[];
  onDayCreate: Hook[];
  onMonthChange: Hook[];
  onOpen: Hook[];
  onParseConfig: Hook[];
  onReady: Hook[];
  onValueUpdate: Hook[];
  onYearChange: Hook[];
  onKeyDown: Hook[];
  onDestroy: Hook[];
}

export const defaults: ParsedOptions = {
  mode: "single",
  position: "auto",
  animate: window && window.navigator.userAgent.indexOf("MSIE") === -1,
  wrap: false,
  weekNumbers: false,
  allowInput: false,
  clickOpens: true,
  closeOnSelect: true,
  time_24hr: false,
  enableTime: false,
  noCalendar: false,
  dateFormat: "Y-m-d",
  ariaDateFormat: "F j, Y",
  altInput: false,
  altInputClass: "form-control input",
  altFormat: "F j, Y",
  getWeek,
  _enable: [],
  enable: [],
  _disable: [],
  disable: [],
  shorthandCurrentMonth: false,
  inline: false,
  static: false,
  prevArrow:
    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
  nextArrow:
    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
  enableSeconds: false,
  hourIncrement: 1,
  minuteIncrement: 5,
  defaultHour: 12,
  defaultMinute: 0,
  defaultSeconds: 0,
  disableMobile: false,
  locale: "default",
  plugins: [],
  ignoredFocusElements: [],

  onClose: [],
  onChange: [],
  onDayCreate: [],
  onMonthChange: [],
  onOpen: [],
  onParseConfig: [],
  onReady: [],
  onValueUpdate: [],
  onYearChange: [],
  onKeyDown: [],
  onDestroy: [],
};
