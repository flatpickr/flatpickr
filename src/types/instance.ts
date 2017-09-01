import { Options, ParsedOptions } from "./options"
export interface Instance {
  // Elements
  element: HTMLElement,
  input: HTMLElement

  calendarContainer: HTMLDivElement
  daysContainer: HTMLDivElement
  weekWrapper?: HTMLDivElement

  hourElement?: HTMLInputElement
  minuteElement?: HTMLInputElement
  secondElement?: HTMLInputElement

  // State
  amPM?: HTMLSpanElement
  config: ParsedOptions
  isOpen: boolean
  isMobile: boolean
  latestSelectedDateObj?: Date
  minDateHasTime: boolean
  selectedDates: Date[]
  showTimeInput: boolean

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
  parseDate: (date: Date | string | number, givenFormat?: string, timeless?: boolean) => Date | null,
  formatDate: (dateObj: Date, frmt: string) => string,

  // Internal Methods
  _bind: (element: HTMLElement, event: string, handler: (e: Event) => void) => void
  _createElement: (tag: string, className: string, content?: string) => HTMLElement
  _setHoursFromDate: (date: Date) => void
}
