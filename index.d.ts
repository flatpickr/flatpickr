import { FlatpickrFn } from "./src/types/instance";
import { Instance as fpInstance } from "./src/types/instance";
import * as Options from "./src/types/options";

declare var flatpickr: FlatpickrFn;

declare namespace flatpickr {
  export type Instance = fpInstance;
}

export = flatpickr;
