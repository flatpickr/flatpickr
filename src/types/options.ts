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
  /*
  Allows the user to enter a date directly input the input field. By default, direct entry is disabled.
  */
  allowInput?: boolean;

  /* Exactly the same as date format, but for the altInput field */
  altFormat?: string;

  /* Show the user a readable date (as per altFormat), but return something totally different to the server.*/
  altInput?: boolean;

  /* This class will be added to the input element created by the altInput option.  Note that altInput already inherits classes from the original input. */
  altInputClass?: string;

  /* Whether to enable animations, such as month transitions */
  animate?: boolean;

  /* Instead of body, appends the calendar to the specified node instead. */
  appendTo?: HTMLElement;

  /* Defines how the date will be formatted in the aria-label for calendar days, using the same tokens as dateFormat. If you change this, you should choose a value that will make sense if a screen reader reads it out loud. */
  /* Defaults to "F j, Y" */
  ariaDateFormat?: string;

  /*
    Whether clicking on the input should open the picker.
    Set it to false if you only want to open the calendar programmatically
  */
  clickOpens?: boolean;

  /* Whether calendar should close after date selection */
  closeOnSelect?: boolean;

  /*
    A string of characters which are used to define how the date will be displayed in the input box.
    See https://chmln.github.io/flatpickr/formatting
  */
  dateFormat?: string;

  /* The initial selected date(s). */
  defaultDate?: DateOption | DateOption[];

  /* Initial value of the hour element. */
  defaultHour?: number;
  defaultMinute?: number;
  defaultSeconds?: number;
  disable?: DateLimit[];
  disableMobile?: boolean;
  enable?: DateLimit[];
  enableSeconds?: boolean;
  enableTime?: boolean;
  formatDate?: (date: Date, format: string) => string;
  getWeek?: (date: Date) => string | number;
  hourIncrement?: number;
  ignoredFocusElements?: HTMLElement[];
  inline?: boolean;
  locale?: string | CustomLocale;
  maxDate?: DateOption;
  minDate?: DateOption;
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
  parseDate?: (date: string, format: string) => Date;
  plugins?: Plugin[];
  position?: "auto" | "above" | "below";
  prevArrow?: string;
  shorthandCurrentMonth?: boolean;
  static?: boolean;
  time_24hr?: boolean;
  time_numberhr?: boolean;
  weekNumbers?: boolean;
  wrap?: boolean;
}

export interface ParsedOptions {
  [k: string]: any;
  _disable: DateLimit<Date>[];
  _enable: DateLimit<Date>[];
  allowInput: boolean;
  altFormat: string;
  altInput: boolean;
  altInputClass: string;
  animate: boolean;
  appendTo?: HTMLElement;
  ariaDateFormat: string;
  clickOpens: boolean;
  closeOnSelect: boolean;
  dateFormat: string;
  defaultDate?: Date;
  defaultHour: number;
  defaultMinute: number;
  defaultSeconds: number;
  disable: DateLimit<Date>[];
  disableMobile: boolean;
  enable: DateLimit<Date>[];
  enableSeconds: boolean;
  enableTime: boolean;
  formatDate?: Options["formatDate"];
  getWeek: (date: Date) => string | number;
  hourIncrement: number;
  ignoredFocusElements: HTMLElement[];
  inline: boolean;
  locale: string | CustomLocale;
  maxDate?: Date;
  minDate?: Date;
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
  parseDate?: Options["parseDate"];
  plugins: Plugin[];
  position: "auto" | "below" | "above";
  prevArrow: string;
  shorthandCurrentMonth: boolean;
  static: boolean;
  time_24hr: boolean;
  weekNumbers: boolean;
  wrap: boolean;
}

export const defaults: ParsedOptions = {
  _disable: [],
  _enable: [],
  allowInput: false,
  altFormat: "F j, Y",
  altInput: false,
  altInputClass: "form-control input",
  animate: window && window.navigator.userAgent.indexOf("MSIE") === -1,
  ariaDateFormat: "F j, Y",
  clickOpens: true,
  closeOnSelect: true,
  dateFormat: "Y-m-d",
  defaultHour: 12,
  defaultMinute: 0,
  defaultSeconds: 0,
  disable: [],
  disableMobile: false,
  enable: [],
  enableSeconds: false,
  enableTime: false,
  getWeek,
  hourIncrement: 1,
  ignoredFocusElements: [],
  inline: false,
  locale: "default",
  minuteIncrement: 5,
  mode: "single",
  nextArrow:
    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
  noCalendar: false,
  onChange: [],
  onClose: [],
  onDayCreate: [],
  onDestroy: [],
  onKeyDown: [],
  onMonthChange: [],
  onOpen: [],
  onParseConfig: [],
  onReady: [],
  onValueUpdate: [],
  onYearChange: [],
  plugins: [],
  position: "auto",
  prevArrow:
    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
  shorthandCurrentMonth: false,
  static: false,
  time_24hr: false,
  weekNumbers: false,
  wrap: false,
};
