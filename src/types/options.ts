import { Instance } from "./instance";
import { CustomLocale, key as LocaleKey, Locale } from "./locale";

export type DateOption = Date | string | number;
export type DateRangeLimit<D = DateOption> = { from: D; to: D };
export type DateLimit<D = DateOption> =
  | D
  | DateRangeLimit<D>
  | ((date: Date) => boolean);

export type Hook = (
  dates: Date[],
  currentDateString: string,
  self: Instance,
  data?: any
) => void;

export type HookKey =
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

export const HOOKS: HookKey[] = [
  "onChange",
  "onClose",
  "onDayCreate",
  "onDestroy",
  "onKeyDown",
  "onMonthChange",
  "onOpen",
  "onParseConfig",
  "onReady",
  "onValueUpdate",
  "onYearChange",
  "onPreCalendarPosition",
];

export type Plugin<E = {}> = (fp: Instance & E) => Options;

export interface BaseOptions {
  /*
  Allows the user to enter a date directly input the input field. By default, direct entry is disabled.
  */
  allowInput: boolean;

  /* Allow preloading of invalid date */
  allowInvalidPreload: boolean;

  /* Exactly the same as date format, but for the altInput field */
  altFormat: string;

  /* Show the user a readable date (as per altFormat), but return something totally different to the server.*/
  altInput: boolean;

  /* This class will be added to the input element created by the altInput option.  Note that altInput already inherits classes from the original input. */
  altInputClass: string;

  /* Whether to enable animations, such as month transitions */
  animate: boolean;

  /* Instead of body, appends the calendar to the specified node instead. */
  appendTo: HTMLElement;

  /* Defines how the date will be formatted in the aria-label for calendar days, using the same tokens as dateFormat. If you change this, you should choose a value that will make sense if a screen reader reads it out loud. */
  /* Defaults to "F j, Y" */
  ariaDateFormat: string;

  /* Whether the default time should be auto-filled when the input is empty and gains or loses focus. */
  /* Defaults to true */
  autoFillDefaultTime: boolean;

  /*
    Whether clicking on the input should open the picker.
    Set it to false if you only want to open the calendar programmatically
  */
  clickOpens: boolean;

  /* Whether calendar should close after date selection */
  closeOnSelect: boolean;

  /*
    If "mode" is "multiple", this string will be used to join
    selected dates together for the date input value.
  */
  conjunction: string;

  /*
    A string of characters which are used to define how the date will be displayed in the input box.
    See https://chmln.github.io/flatpickr/formatting
  */
  dateFormat: string;

  /* The initial selected date(s). */
  defaultDate: DateOption | DateOption[];

  /* Initial value of the hour element, when no date is selected */
  defaultHour: number;

  /* Initial value of the minute element, when no date is selected */
  defaultMinute: number;

  /* Initial value of the seconds element, when no date is selected */
  defaultSeconds: number;

  /*
    Disables certain dates, preventing them from being selected.
    See https://chmln.github.io/flatpickr/examples/#disabling-specific-dates */
  disable: DateLimit<DateOption>[];

  /* Set this to true to always use the non-native picker on mobile devices.
By default, Flatpickr utilizes native datetime widgets unless certain options (e.g. disable) are used. */
  disableMobile: boolean;

  /* Disables all dates except these specified. See https://chmln.github.io/flatpickr/examples/#disabling-all-dates-except-select-few */
  enable: DateLimit<DateOption>[];

  /* Enables seconds selection in the time picker.
   */
  enableSeconds: boolean;

  /* Enables the time picker */
  enableTime: boolean;

  errorHandler: (e: Error) => void;

  /* Allows using a custom date formatting function instead of the built-in. Generally unnecessary.  */
  formatDate: (date: Date, format: string, locale: Locale) => string;

  /* If "weekNumbers" are enabled, this is the function that outputs the week number for a given dates, optionally along with other text  */
  getWeek: (date: Date) => string | number;

  /*   Adjusts the step for the hour input (incl. scrolling) */
  hourIncrement: number;

  /* By default, clicking anywhere outside of calendar/input will close the calendar.
  Clicking on elements specified in this option will not close the calendar */
  ignoredFocusElements: HTMLElement[];

  /* Displays the calendar inline */
  inline: boolean;

  /* The locale, either as a string (e.g. "ru", "en") or as an object.
  See https://chmln.github.io/flatpickr/localization/ */
  locale: LocaleKey | Partial<CustomLocale>;

  /* The maximum date that a user can pick to (inclusive). */
  maxDate: DateOption;

  /* The maximum time that a user can pick to (inclusive). */
  maxTime: DateOption;

  /* The minimum date that a user can start picking from (inclusive). */
  minDate: DateOption;

  /* The minimum time that a user can start picking from (inclusive). */
  minTime: DateOption;

  /* Adjusts the step for the minute input (incl. scrolling)
  Defaults to 5 */
  minuteIncrement: number;

  /* Date selection mode, defaults to "single" */
  mode: "single" | "multiple" | "range" | "time";

  /* How the month selector in the calendar should be shown */
  monthSelectorType: "dropdown" | "static";

  /* HTML for the right arrow icon, used to switch months. */
  nextArrow: string;

  /* Hides the day selection in calendar.
Use it along with "enableTime" to create a time picker. */
  noCalendar: boolean;

  now?: DateOption;

  /* Fires when the selected dates have changed - when a date is picked or cleared, by user or programmatically */
  onChange: Hook | Hook[];

  /* Fires when the calendar is closed */
  onClose: Hook | Hook[];

  /* Fires for every day cell in the calendar, where the fourth argument is the html element of the cell. See https://chmln.github.io/flatpickr/events/#ondaycreate*/
  onDayCreate: Hook | Hook[];

  /* Fires before the calendar instance is destroyed */
  onDestroy: Hook | Hook[];

  /* Fires when valid keyboard input for calendar is detected */
  onKeyDown: Hook | Hook[];

  /* Fires after the month has changed */
  onMonthChange: Hook | Hook[];

  /* Fires after the calendar is opened */
  onOpen: Hook | Hook[];

  /* Fires after the configuration for the calendar is parsed */
  onParseConfig: Hook | Hook[];

  /* Fires once the calendar instance is ready */
  onReady: Hook | Hook[];

  /* Like onChange, but fires immediately after any date changes */
  onValueUpdate: Hook | Hook[];

  /* Fires after the year has changed */
  onYearChange: Hook | Hook[];

  onPreCalendarPosition: Hook | Hook[];

  /* A custom datestring parser */
  parseDate: (date: string, format: string) => Date;

  /* Plugins. See https://chmln.github.io/flatpickr/plugins/ */
  plugins: Plugin[];

  /* How the calendar should be positioned with regards to the input. Defaults to "auto" */
  position:
    | "auto"
    | "above"
    | "below"
    | "auto left"
    | "auto center"
    | "auto right"
    | "above left"
    | "above center"
    | "above right"
    | "below left"
    | "below center"
    | "below right"
    | ((self: Instance, customElement: HTMLElement | undefined) => void);

  /*
    The element off of which the calendar will be positioned.
    Defaults to the date input
  */
  positionElement: Element;

  /* HTML for the left arrow icon, used to switch months. */
  prevArrow: string;

  /* Whether to display the current month name in shorthand mode, e.g. "Sep" instead "September" */
  shorthandCurrentMonth: boolean;

  /* Creates a wrapper to position the calendar. Use this if the input is inside a scrollable element */
  static: boolean;

  /* Sets the number of months to show */
  showMonths?: number;

  /* Displays time picker in 24 hour mode without AM/PM selection when enabled.*/
  time_24hr: boolean;

  /* Display week numbers left of the calendar. */
  weekNumbers: boolean;

  /* See https://chmln.github.io/flatpickr/examples/#flatpickr-external-elements */
  wrap: boolean;

  /* Handling year as locale year.*/
  useLocaleYear: boolean;
}

export type Options = Partial<BaseOptions>;

export interface ParsedOptions {
  _disable: DateLimit<Date>[];
  _enable?: DateLimit<Date>[];
  _maxDate?: Date;
  _maxTime?: Date;
  _minDate?: Date;
  _minTime?: Date;
  allowInput: boolean;
  allowInvalidPreload: boolean;
  altFormat: string;
  altInput: boolean;
  altInputClass: string;
  animate: boolean;
  appendTo?: HTMLElement;
  ariaDateFormat: string;
  autoFillDefaultTime: boolean;
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
  enable?: DateLimit<Date>[];
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
  mode: BaseOptions["mode"];
  monthSelectorType: string;
  nextArrow: string;
  noCalendar: boolean;
  now: Date;
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
  parseDate?: BaseOptions["parseDate"];
  plugins: Plugin[];
  position: BaseOptions["position"];
  positionElement?: HTMLElement;
  prevArrow: string;
  shorthandCurrentMonth: boolean;
  showMonths: number;
  static: boolean;
  time_24hr: boolean;
  weekNumbers: boolean;
  wrap: boolean;
  useLocaleYear: boolean;
}

export const defaults: ParsedOptions = {
  _disable: [],
  allowInput: false,
  allowInvalidPreload: false,
  altFormat: "F j, Y",
  altInput: false,
  altInputClass: "form-control input",
  animate:
    typeof window === "object" &&
    window.navigator.userAgent.indexOf("MSIE") === -1,
  ariaDateFormat: "F j, Y",
  autoFillDefaultTime: true,
  clickOpens: true,
  closeOnSelect: true,
  conjunction: ", ",
  dateFormat: "Y-m-d",
  defaultHour: 12,
  defaultMinute: 0,
  defaultSeconds: 0,
  disable: [],
  disableMobile: false,
  enableSeconds: false,
  enableTime: false,
  errorHandler: (err: Error) =>
    typeof console !== "undefined" && console.warn(err),
  getWeek: (givenDate: Date) => {
    const date = new Date(givenDate.getTime());
    date.setHours(0, 0, 0, 0);

    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));

    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);

    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  },
  hourIncrement: 1,
  ignoredFocusElements: [],
  inline: false,
  locale: "default",
  minuteIncrement: 5,
  mode: "single",
  monthSelectorType: "dropdown",
  nextArrow:
    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
  noCalendar: false,
  now: new Date(),
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
  onPreCalendarPosition: [],
  plugins: [],
  position: "auto",
  positionElement: undefined,
  prevArrow:
    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
  shorthandCurrentMonth: false,
  showMonths: 1,
  static: false,
  time_24hr: false,
  weekNumbers: false,
  wrap: false,
  useLocaleYear: false,
};
