/* Danish locals for flatpickr */
import { CustomLocale } from "types/locale";
import { FlatpickrFn } from "types/instance";

const fp: FlatpickrFn =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
      } as FlatpickrFn;

export const Danish: CustomLocale = {
  weekdays: {
    shorthand: ["Søn", "Man", "Tir", "Ons", "Tors", "Fre", "Lør"],
    longhand: [
      "Søndag",
      "Mandag",
      "Tirsdag",
      "Onsdag",
      "Torsdag",
      "Fredag",
      "Lørdag",
    ],
  },

  months: {
    shorthand: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Maj",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Dec",
    ],
    longhand: [
      "Januar",
      "Februar",
      "Marts",
      "April",
      "Maj",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "December",
    ],
  },

  ordinal: () => {
    return ".";
  },

  firstDayOfWeek: 1,
  rangeSeparator: " til ",
  weekAbbreviation: "Uge"
};

fp.l10ns.da = Danish;

export default fp.l10ns;
