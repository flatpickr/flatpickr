/* Polish locals for flatpickr */
import { CustomLocale } from "types/locale";
import { FlatpickrFn } from "types/instance";

const fp: FlatpickrFn = ((window as any).flatpickr as FlatpickrFn) || {
  l10ns: {},
};

export const Polish: CustomLocale = {
  weekdays: {
    shorthand: ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"],
    longhand: [
      "Niedziela",
      "Poniedziałek",
      "Wtorek",
      "Środa",
      "Czwartek",
      "Piątek",
      "Sobota",
    ],
  },

  months: {
    shorthand: [
      "Sty",
      "Lut",
      "Mar",
      "Kwi",
      "Maj",
      "Cze",
      "Lip",
      "Sie",
      "Wrz",
      "Paź",
      "Lis",
      "Gru",
    ],
    longhand: [
      "Styczeń",
      "Luty",
      "Marzec",
      "Kwiecień",
      "Maj",
      "Czerwiec",
      "Lipiec",
      "Sierpień",
      "Wrzesień",
      "Październik",
      "Listopad",
      "Grudzień",
    ],
  },

  ordinal: () => {
    return ".";
  },
};

fp.l10ns.pl = Polish;

export default fp.l10ns;
