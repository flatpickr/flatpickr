/* Finnish locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Finnish: CustomLocale = {
  firstDayOfWeek: 1,

  weekdays: {
    shorthand: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
    longhand: [
      "Sunnuntai",
      "Maanantai",
      "Tiistai",
      "Keskiviikko",
      "Torstai",
      "Perjantai",
      "Lauantai",
    ],
  },

  months: {
    shorthand: [
      "Tammi",
      "Helmi",
      "Maalis",
      "Huhti",
      "Touko",
      "Kesä",
      "Heinä",
      "Elo",
      "Syys",
      "Loka",
      "Marras",
      "Joulu",
    ],
    longhand: [
      "Tammikuu",
      "Helmikuu",
      "Maaliskuu",
      "Huhtikuu",
      "Toukokuu",
      "Kesäkuu",
      "Heinäkuu",
      "Elokuu",
      "Syyskuu",
      "Lokakuu",
      "Marraskuu",
      "Joulukuu",
    ],
  },

  ordinal: () => {
    return ".";
  },
};

fp.l10ns.fi = Finnish;

export default fp.l10ns;
