/* Swedish locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Swedish: CustomLocale = {
  firstDayOfWeek: 1,
  weekAbbreviation: "v",

  weekdays: {
    shorthand: ["sön", "mån", "tis", "ons", "tor", "fre", "lör"],
    longhand: [
      "söndag",
      "måndag",
      "tisdag",
      "onsdag",
      "torsdag",
      "fredag",
      "lördag",
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
      "januari",
      "februari",
      "mars",
      "april",
      "maj",
      "juni",
      "juli",
      "augusti",
      "september",
      "oktober",
      "november",
      "december",
    ],
  },
  rangeSeparator: " till ",
  time_24hr: true,

  ordinal: () => {
    return ".";
  },
};

fp.l10ns.sv = Swedish;

export default fp.l10ns;
