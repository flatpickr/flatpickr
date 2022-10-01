/* Basque locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Basque: CustomLocale = {
  weekdays: {
    shorthand: ["ig.", "al.", "as.", "az.", "og.", "or.", "lr."],
    longhand: [
      "Igandea",
      "Astelehena",
      "Asteartea",
      "Asteazkena",
      "Osteguna",
      "Ostirala",
      "Larunbata",
    ],
  },

  months: {
    shorthand: [
      "urt.",
      "ots.",
      "mar.",
      "api.",
      "mai.",
      "eka.",
      "uzt.",
      "abu.",
      "ira.",
      "urr.",
      "aza.",
      "abe.",
    ],
    longhand: [
      "Urtarrila",
      "Otsaila",
      "Martxoa",
      "Apirila",
      "Maiatza",
      "Ekaina",
      "Uztaila",
      "Abuztua",
      "Iraila",
      "Urria",
      "Azaroa",
      "Abendua",
    ],
  },
  firstDayOfWeek: 1,
  ordinal: () => {
    return ".";
  },
  rangeSeparator: " / ",
  weekAbbreviation: "Ast.",
  scrollTitle: "Korritu handitzeko",
  toggleTitle: "Egin klik txandakatzeko",
  yearAriaLabel: "Urtea",
  monthAriaLabel: "Hilabetea",
  hourAriaLabel: "Ordua",
  minuteAriaLabel: "Minutua",
  time_24hr: true,
};

fp.l10ns.eu = Basque;

export default fp.l10ns;
