/* Faroese locale for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Faroese: CustomLocale = {
  weekdays: {
    shorthand: ["Sun", "Mán", "Týs", "Mik", "Hós", "Frí", "Ley"],
    longhand: [
      "Sunnudagur",
      "Mánadagur",
      "Týsdagur",
      "Mikudagur",
      "Hósdagur",
      "Fríggjadagur",
      "Leygardagur",
    ],
  },

  months: {
    shorthand: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mai",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
    longhand: [
      "Januar",
      "Februar",
      "Mars",
      "Apríl",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "Septembur",
      "Oktobur",
      "Novembur",
      "Desembur",
    ],
  },

  ordinal: () => {
    return ".";
  },

  firstDayOfWeek: 1,
  rangeSeparator: " til ",
  weekAbbreviation: "vika",
  scrollTitle: "Rulla fyri at broyta",
  toggleTitle: "Trýst fyri at skifta",
  yearAriaLabel: "Ár",
  time_24hr: true,
};

fp.l10ns.fo = Faroese;

export default fp.l10ns;
