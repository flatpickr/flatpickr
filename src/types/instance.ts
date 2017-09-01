import { Options, ParsedOptions } from "./options"
import { Locale } from "./locale"
export interface Instance {
  // Elements
  element: HTMLElement,
  input: HTMLInputElement
  mobileInput?: HTMLInputElement
  selectedDateElem?: HTMLSpanElement

  calendarContainer: HTMLDivElement
  daysContainer: HTMLDivElement
  weekWrapper?: HTMLDivElement

  currentYearElement: HTMLInputElement
  hourElement?: HTMLInputElement
  minuteElement?: HTMLInputElement
  secondElement?: HTMLInputElement

  // State
  l10n: Locale
  now: Date
  amPM?: HTMLSpanElement
  config: ParsedOptions
  currentYear: number
  currentMonth: number
  isOpen: boolean
  isMobile: boolean
  latestSelectedDateObj?: Date
  _selectedDateObj?: Date
  minDateHasTime: boolean
  maxDateHasTime: boolean
  selectedDates: Date[]
  showTimeInput: boolean
  _showTimeInput: boolean

  // Methods
  changeMonth: (value: number, is_offset?: boolean, animate?: boolean) => void
  changeYear: (year: number) => void
  clear: (emitChangeEvent?: boolean) => void
  close: () => void
  destroy: () => void
  isEnabled: (date: Date, timeless?: boolean) => boolean
  jumpToDate: (date: Date) => void
  open: (e?: Event, positionElement?: HTMLElement) => void
  redraw: () => void
  set: (option: keyof Options, value: any) => void
  setDate: (date: Date | string | number, triggerChange?: boolean, format?: string) => void
  toggle: () => void

  pad: (num: string | number) => string
  parseDate: (date: Date | string | number, givenFormat?: string, timeless?: boolean) => Date | undefined,
  formatDate: (dateObj: Date, frmt: string) => string,

  // Internal Methods
  _bind: (element: HTMLElement, event: string, handler: (e: Event) => void) => void
  _createElement: (tag: string, className: string, content?: string) => HTMLElement
  _setHoursFromDate: (date: Date) => void
}
