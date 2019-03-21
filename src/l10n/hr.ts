/* Croatian locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Croatian: CustomLocale = {
  firstDayOfWeek: 1,

  weekdays: {
    shorthand: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
    longhand: [
      "Nedjelja",
      "Ponedjeljak",
      "Utorak",
      "Srijeda",
      "Četvrtak",
      "Petak",
      "Subota",
    ],
  },

  months: {
    shorthand: [
      "Sij",
      "Velj",
      "Ožu",
      "Tra",
      "Svi",
      "Lip",
      "Srp",
      "Kol",
      "Ruj",
      "Lis",
      "Stu",
      "Pro",
    ],
    longhand: [
      "Siječanj",
      "Veljača",
      "Ožujak",
      "Travanj",
      "Svibanj",
      "Lipanj",
      "Srpanj",
      "Kolovoz",
      "Rujan",
      "Listopad",
      "Studeni",
      "Prosinac",
    ],
  },
  time_24hr: true,
};

fp.l10ns.hr = Croatian;

export default fp.l10ns;
