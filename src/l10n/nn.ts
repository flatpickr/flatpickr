/* Norwegian locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const NorwegianNynorsk: CustomLocale = {
  weekdays: {
    shorthand: ["Sø.", "Må.", "Ty.", "On.", "To.", "Fr.", "La."],
    longhand: [
      "Søndag",
      "Måndag",
      "Tysdag",
      "Onsdag",
      "Torsdag",
      "Fredag",
      "Laurdag",
    ],
  },

  months: {
    shorthand: [
      "Jan",
      "Feb",
      "Mars",
      "Apr",
      "Mai",
      "Juni",
      "Juli",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
    longhand: [
      "Januar",
      "Februar",
      "Mars",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
  },

  firstDayOfWeek: 1,
  rangeSeparator: " til ",
  weekAbbreviation: "Veke",
  scrollTitle: "Scroll for å endre",
  toggleTitle: "Klikk for å veksle",
  time_24hr: true,

  ordinal: () => {
    return ".";
  },
};

fp.l10ns.nn = NorwegianNynorsk;

export default fp.l10ns;
