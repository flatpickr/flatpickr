import { Instance } from "./instance"

export type DateOption = Date | string | number
export type DateLimit<D = DateOption> = D | { from: D, to: D }
type Hook = (dates: Date[], currentDateString: string, self: Instance, data?: any) => void

export interface Options {
  "mode"?: "single" | "multiple" | "range"
  "position"?: "auto" | "above" | "below"
  animate?: boolean
  // wrap: see https://chmln.github.io/flatpickr/examples/#flatpickr-external-elements
  wrap?: boolean
  // enables week numbers
  weekNumbers?: boolean
  // allow manual datetime input
  allowInput?: boolean
  /*
    clicking on input opens the date(time)picker.
    disable if you wish to open the calendar manually with .open()
  */
  clickOpens?: boolean
  /*
    closes calendar after date selection
    unless 'mode' is 'multiple' or enableTime is true
  */
  closeOnSelect?: boolean
  // display time picker in number hour mode
  time_numberhr?: boolean
  // enables the time picker functionality
  enableTime?: boolean
  // noCalendar: true will hide the calendar. use for a time picker along w/ enableTime
  noCalendar?: boolean
  // more date format chars at https://chmln.github.io/flatpickr/#dateformat
  dateFormat?: string
  // date format used in aria-label for days
  ariaDateFormat?: string
  // altInput - see https://chmln.github.io/flatpickr/#altinput
  altInput?: boolean
  // the created altInput element will have this class.
  altInputClass?: string
  // same as dateFormat but for altInput
  altFormat?: string // defaults to e.g. June number number
  // defaultDate - either a datestring or a date object. used for datetimepicker"s initial value
  defaultDate?: DateOption
  // the minimum date that user can pick (inclusive)
  minDate?: DateOption
  // the maximum date that user can pick (inclusive)
  maxDate?: DateOption
  // dateparser that transforms a given string to a date object
  parseDate?: (date: string, format: string) => Date
  // dateformatter that transforms a given date object to a string according to passed format
  formatDate?: (date: Date, format: string) => string
  getWeek?: (date: Date) => string | number
  // see https://chmln.github.io/flatpickr/#disable
  enable?: DateLimit[]
  // see https://chmln.github.io/flatpickr/#disable
  disable?: DateLimit[]
  // display the short version of month names - e.g. Sep instead of September
  shorthandCurrentMonth?: boolean
  // displays calendar inline. see https://chmln.github.io/flatpickr/#inline-calendar
  inline?: boolean
  // position calendar inside wrapper and next to the input element
  // leave at false unless you know what you"re doing
  "static": boolean
  // DOM node to append the calendar to in *static* mode
  appendTo?: HTMLElement
  // code for previous/next icons. this is where you put your custom icon code e.g. fontawesome
  prevArrow?: string
  nextArrow?: string
  // enables seconds in the time picker
  enableSeconds?: boolean
  // step size used when scrolling/incrementing the hour element
  hourIncrement?: number
  // step size used when scrolling/incrementing the minute element
  minuteIncrement?: number
  // initial value in the hour element
  defaultHour?: number
  // initial value in the minute element
  defaultMinute?: number
  // initial value in the seconds element
  defaultSeconds?: number
  // disable native mobile datetime input support
  disableMobile?: boolean
  // default locale
  locale?: string
  plugins?: object[]
  ignoredFocusElements?: HTMLElement[]
  // called every time calendar is closed
  onClose?: Hook | Hook[] // function (dateObj dateStr) {}
  // onChange callback when user selects a date or time
  onChange?: Hook | Hook[] // function (dateObj dateStr) {}
  // called for every day element
  onDayCreate?: Hook | Hook[]
  // called every time the month is changed
  onMonthChange?: Hook | Hook[]
  // called every time calendar is opened
  onOpen?: Hook | Hook[] // function (dateObj dateStr) {}
  // called after the configuration has been parsed
  onParseConfig?: Hook | Hook[]
  // called after calendar is ready
  onReady?: Hook  | Hook[]// function (dateObj dateStr) {}
  // called after input value updated
  onValueUpdate?: Hook | Hook[]
  // called every time the year is changed
  onYearChange?: Hook | Hook[]
  onKeyDown?: Hook | Hook[]
  onDestroy?: Hook | Hook[]
};
export interface ParsedOptions{
  [k: string]: any,
  mode: "single" | "multiple" | "range",
  position: "auto" | "below" | "above",
  animate: boolean,
  wrap: boolean,
  weekNumbers: boolean,
  allowInput: boolean,
  clickOpens: boolean,
  closeOnSelect: boolean,
  time_24hr: boolean,
  enableTime: boolean,
  noCalendar: boolean,
  dateFormat: string,
  ariaDateFormat: string,
  altInput: boolean,
  altInputClass: string,
  altFormat: string,
  defaultDate?: Date,
  minDate?: Date,
  maxDate?: Date,
  parseDate?: Options["parseDate"],
  formatDate?: Options["formatDate"],
  getWeek: (date: Date) => string,
  enable: DateLimit<Date>[],
  disable: DateLimit<Date>[],
  shorthandCurrentMonth: boolean,
  inline: boolean,
  "static": boolean,
  appendTo?: HTMLElement,
  prevArrow: string
  nextArrow: string
  enableSeconds: boolean,
  hourIncrement: number
  minuteIncrement: number
  defaultHour: number
  defaultMinute: number
  defaultSeconds: number
  disableMobile: boolean,
  locale: string
  plugins: {}[],
  ignoredFocusElements: HTMLElement[],
  onClose: Hook[],
  onChange: Hook[],
  onDayCreate: Hook[],
  onMonthChange: Hook[],
  onOpen: Hook[],
  onParseConfig: Hook[],
  onReady: Hook[],
  onValueUpdate: Hook[],
  onYearChange: Hook[],
  onKeyDown: Hook[],
  onDestroy: Hook[]
}
