import { Options } from "./options";
import { Instance, FlatpickrFn } from "./instance";

/*
Some conflicting @types cause the following error:

TS2403: Subsequent variable declarations must have the same type.  Variable 'flatpickr' must be of type '(config?: Options | undefined) => Instance | Instance[]', but here has type '(config?: Options | undefined) => Instance | Instance[]'

Resorting to @ts-ignore until this is resolved.

*/

declare global {
  interface HTMLElement {
    flatpickr: (config?: Options) => Instance | Instance[];

    _flatpickr?: Instance;
  }

  interface NodeList {
    flatpickr: (config?: Options) => Instance | Instance[];
  }

  interface HTMLCollection {
    flatpickr: (config?: Options) => Instance | Instance[];
  }

  interface Window {
    flatpickr: FlatpickrFn;
  }

  interface Date {
    fp_incr: (n: number) => Date;
  }
}
