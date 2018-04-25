/* Dutch locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Dutch: CustomLocale = {
  weekdays: {
    shorthand: ["zo", "ma", "di", "wo", "do", "vr", "za"],
    longhand: [
      "zondag",
      "maandag",
      "dinsdag",
      "woensdag",
      "donderdag",
      "vrijdag",
      "zaterdag",
    ],
  },

  months: {
    shorthand: [
      "jan",
      "feb",
      "mrt",
      "apr",
      "mei",
      "jun",
      "jul",
      "aug",
      "sept",
      "okt",
      "nov",
      "dec",
    ],
    longhand: [
      "januari",
      "februari",
      "maart",
      "april",
      "mei",
      "juni",
      "juli",
      "augustus",
      "september",
      "oktober",
      "november",
      "december",
    ],
  },

  firstDayOfWeek: 1,
  weekAbbreviation: "wk",
  rangeSeparator: " tot ",
  scrollTitle: "Scroll voor volgende / vorige",
  toggleTitle: "Klik om te wisselen",

  ordinal: nth => {
    if (nth === 1 || nth === 8 || nth >= 20) return "ste";

    return "de";
  },
};

fp.l10ns.nl = Dutch;

export default fp.l10ns;
