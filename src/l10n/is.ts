/* Icelandic locale for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Icelandic: CustomLocale = {
  weekdays: {
    shorthand: ["Sun", "Mán", "Þri", "Mið", "Fim", "Fös", "Lau"],
    longhand: [
      "Sunnudagur",
      "Mánudagur",
      "Þriðjudagur",
      "Miðvikudagur",
      "Fimmtudagur",
      "Föstudagur",
      "Laugardagur",
    ],
  },

  months: {
    shorthand: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Maí",
      "Jún",
      "Júl",
      "Ágú",
      "Sep",
      "Okt",
      "Nóv",
      "Des",
    ],
    longhand: [
      "Janúar",
      "Febrúar",
      "Mars",
      "Apríl",
      "Maí",
      "Júní",
      "Júlí",
      "Ágúst",
      "September",
      "Október",
      "Nóvember",
      "Desember",
    ],
  },

  ordinal: () => {
    return ".";
  },

  firstDayOfWeek: 1,
  rangeSeparator: " til ",
  weekAbbreviation: "vika",
  yearAriaLabel: "Ár",
  time_24hr: true,
};

fp.l10ns.is = Icelandic;

export default fp.l10ns;
