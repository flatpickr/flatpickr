/* Estonian locals for flatpickr */
import { CustomLocale } from "types/locale";
import { FlatpickrFn } from "types/instance";

const fp: FlatpickrFn =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
      } as FlatpickrFn;

export const Estonian: CustomLocale = {
  weekdays: {
    shorthand: ["P", "E", "T", "K", "N", "R", "L"],
    longhand: [
      "Pühapäev",
      "Esmaspäev",
      "Teisipäev",
      "Kolmapäev",
      "Neljapäev",
      "Reede",
      "Laupäev",
    ],
  },

  months: {
    shorthand: [
      "Jaan",
      "Veebr",
      "Märts",
      "Apr",
      "Mai",
      "Juuni",
      "Juuli",
      "Aug",
      "Sept",
      "Okt",
      "Nov",
      "Dets",
    ],
    longhand: [
      "Jaanuar",
      "Veebruar",
      "Märts",
      "Aprill",
      "Mai",
      "Juuni",
      "Juuli",
      "August",
      "September",
      "Oktoober",
      "November",
      "Detsember",
    ],
  },

  firstDayOfWeek: 1,

  ordinal: function() {
    return ".";
  },

  weekAbbreviation: "Näd",
  rangeSeparator: " kuni ",
  scrollTitle: "Keri, et suurendada",
  toggleTitle: "Klõpsa, et vahetada",
};

fp.l10ns.et = Estonian;

export default fp.l10ns;
