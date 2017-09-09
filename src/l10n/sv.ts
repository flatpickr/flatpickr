/* Swedish locals for flatpickr */
import { CustomLocale } from "types/locale";
import { FlatpickrFn } from "types/instance";

const fp: FlatpickrFn = ((window as any).flatpickr as FlatpickrFn) || {
  l10ns: {},
};

export const Swedish: CustomLocale = {
  firstDayOfWeek: 1,
  weekAbbreviation: "v",

  weekdays: {
    shorthand: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
    longhand: [
      "Söndag",
      "Måndag",
      "Tisdag",
      "Onsdag",
      "Torsdag",
      "Fredag",
      "Lördag",
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
      "Januari",
      "Februari",
      "Mars",
      "April",
      "Maj",
      "Juni",
      "Juli",
      "Augusti",
      "September",
      "Oktober",
      "November",
      "December",
    ],
  },

  ordinal: () => {
    return ".";
  },
};

fp.l10ns.sv = Swedish;

export default fp.l10ns;
