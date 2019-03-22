/* Latvian locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Latvian: CustomLocale = {
  firstDayOfWeek: 1,

  weekdays: {
    shorthand: ["Sv", "Pr", "Ot", "Tr", "Ce", "Pk", "Se"],
    longhand: [
      "Svētdiena",
      "Pirmdiena",
      "Otrdiena",
      "Trešdiena",
      "Ceturtdiena",
      "Piektdiena",
      "Sestdiena",
    ],
  },

  months: {
    shorthand: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mai",
      "Jūn",
      "Jūl",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Dec",
    ],
    longhand: [
      "Janvāris",
      "Februāris",
      "Marts",
      "Aprīlis",
      "Maijs",
      "Jūnijs",
      "Jūlijs",
      "Augusts",
      "Septembris",
      "Oktobris",
      "Novembris",
      "Decembris",
    ],
  },

  rangeSeparator: " līdz ",
  time_24hr: true,
};

fp.l10ns.lv = Latvian;

export default fp.l10ns;
