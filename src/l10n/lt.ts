/* Lithuanian locals for flatpickr */
import { CustomLocale } from "types/locale";
import { FlatpickrFn } from "types/instance";

const fp: FlatpickrFn =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
      } as FlatpickrFn;

export const Lithuanian: CustomLocale = {
  weekdays: {
    shorthand: ["S", "Pr", "A", "T", "K", "Pn", "Š"],
    longhand: [
      "Sekmadienis",
      "Pirmadienis",
      "Antradienis",
      "Trečiadienis",
      "Ketvirtadienis",
      "Penktadienis",
      "Šeštadienis",
    ],
  },

  months: {
    shorthand: [
      "Sau",
      "Vas",
      "Kov",
      "Bal",
      "Geg",
      "Bir",
      "Lie",
      "Rgp",
      "Rgs",
      "Spl",
      "Lap",
      "Grd",
    ],
    longhand: [
      "Sausis",
      "Vasaris",
      "Kovas",
      "Balandis",
      "Gegužė",
      "Birželis",
      "Liepa",
      "Rugpjūtis",
      "Rugsėjis",
      "Spalis",
      "Lapkritis",
      "Gruodis",
    ],
  },

  firstDayOfWeek: 1,

  ordinal: function() {
    return "-a";
  },

  weekAbbreviation: "Sav",
  scrollTitle: "Keisti laiką pelės rateliu",
  toggleTitle: "Perjungti laiko formatą",
};

fp.l10ns.lt = Lithuanian;

export default fp.l10ns;
