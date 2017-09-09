/* Latvian locals for flatpickr */
import { CustomLocale } from "types/locale";
import { FlatpickrFn } from "types/instance";

const fp: FlatpickrFn = ((window as any).flatpickr as FlatpickrFn) || {
  l10ns: {},
};

export const Latvian: CustomLocale = {
  firstDayOfWeek: 1,

  weekdays: {
    shorthand: ["Sv", "P", "Ot", "Tr", "Ce", "Pk", "Se"],
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
      "Mai",
      "Apr",
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
};

fp.l10ns.lv = Latvian;

export default fp.l10ns;
