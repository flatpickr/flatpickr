import { Options } from "./options";
import { Instance, FlatpickrFn } from "./instance";

/*
Some conflicting @types cause the following error:

TS2403: Subsequent variable declarations must have the same type.  Variable 'flatpickr' must be of type '(config?: Options | undefined) => Instance | Instance[]', but here has type '(config?: Options | undefined) => Instance | Instance[]'

Resorting to @ts-ignore until this is resolved.

*/

declare global {
  interface HTMLElement {
    //@ts-ignore
    flatpickr: (config?: Options) => Instance | Instance[];
    //@ts-ignore
    _flatpickr?: Instance;
  }

  interface NodeList {
    //@ts-ignore
    flatpickr: (config?: Options) => Instance | Instance[];
  }

  interface HTMLCollection {
    //@ts-ignore
    flatpickr: (config?: Options) => Instance | Instance[];
  }

  interface Window {
    //@ts-ignore
    flatpickr: FlatpickrFn;
  }

  interface Date {
    fp_incr: (n: number) => Date;
  }
}
