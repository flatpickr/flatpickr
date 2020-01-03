/* Catalan locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Occitan: CustomLocale = {
  weekdays: {
    shorthand: ["Dg", "Dl", "Dm", "Dc", "Dj", "Dv", "Ds"],
    longhand: [
      "Dimenge",
      "Diluns",
      "Dimars",
      "Dimècres",
      "Dijòus",
      "Divendres",
      "Dissabte",
    ],
  },

  months: {
    shorthand: [
      "Gen",
      "Febr",
      "Març",
      "Abr",
      "Mai",
      "Junh",
      "Julh",
      "Ag",
      "Set",
      "Oct",
      "Nov",
      "Dec",
    ],
    longhand: [
      "Genièr",
      "Febrièr",
      "Març",
      "Abrial",
      "Mai",
      "Junh",
      "Julhet",
      "Agost",
      "Setembre",
      "Octòbre",
      "Novembre",
      "Decembre",
    ],
  },

  ordinal: nth => {
    const s = nth % 100;
    if (s > 3 && s < 21) return "è";
    switch (s % 10) {
      case 1:
        return "r";
      case 2:
        return "n";
      case 3:
        return "r";
      case 4:
        return "t";
      default:
        return "è";
    }
  },

  firstDayOfWeek: 1,
  time_24hr: true,
};

fp.l10ns.oc = Occitan;

export default fp.l10ns;
