import { ParsedOptions } from "./options"
export interface Instance {
  // Elements
  element: HTMLElement,
  input: HTMLElement

  // State
  config: ParsedOptions
  isOpen: boolean
  isMobile: boolean

  // Methods
  _bind: (element: HTMLElement, event: string, handler: (e: Event) => void) => void
  _setHoursFromDate: (date: Date) => void
}
