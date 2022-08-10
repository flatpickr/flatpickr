/* Afrikaans locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Afrikaans: CustomLocale = {
  weekdays: {
    shorthand: ["So.", "Ma.", "Di.", "Wo.", "Do.", "Vr.", "Sa."],
    longhand: [
      "Sondag",
      "Maandag",
      "Dinsdag",
      "Woensdag",
      "Donderdag",
      "Vrydag",
      "Saterdag",
    ],
  },

  months: {
    shorthand: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
    longhand: [
      "Januarie",
      "Februarie",
      "Maart",
      "April",
      "Mei",
      "Junie",
      "Julie",
      "Augustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
  },
  ordinal: (nth: number) => {
    const s = nth % 100;
    if (s == 1 || s == 8 || s > 19) return "ste";
    return "de";
  },
  weekAbbreviation: "Wk",
  rangeSeparator: " tot ",
  scrollTitle: "Rol om te verander",
  toggleTitle: "Kliek om te wissel",
  yearAriaLabel: "Jaar",
  monthAriaLabel: "Maand",
  hourAriaLabel: "Uur",
  minuteAriaLabel: "Minuut",
  time_24hr: false,
  firstDayOfWeek: 0,
};

fp.l10ns.af = Afrikaans;

export default fp.l10ns;
