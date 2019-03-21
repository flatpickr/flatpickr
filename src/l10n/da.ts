/* Danish locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Danish: CustomLocale = {
  weekdays: {
    shorthand: ["søn", "man", "tir", "ons", "tors", "fre", "lør"],
    longhand: [
      "søndag",
      "mandag",
      "tirsdag",
      "onsdag",
      "torsdag",
      "fredag",
      "lørdag",
    ],
  },

  months: {
    shorthand: [
      "jan",
      "feb",
      "mar",
      "apr",
      "maj",
      "jun",
      "jul",
      "aug",
      "sep",
      "okt",
      "nov",
      "dec",
    ],
    longhand: [
      "januar",
      "februar",
      "marts",
      "april",
      "maj",
      "juni",
      "juli",
      "august",
      "september",
      "oktober",
      "november",
      "december",
    ],
  },

  ordinal: () => {
    return ".";
  },

  firstDayOfWeek: 1,
  rangeSeparator: " til ",
  weekAbbreviation: "uge",
  time_24hr: true,
};

fp.l10ns.da = Danish;

export default fp.l10ns;
