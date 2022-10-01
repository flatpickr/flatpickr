/* Turkmen locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Turkmen: CustomLocale = {
  weekdays: {
    shorthand: ["Ýek", "Du", "Si", "Çar", "Pen", "An", "Şen"],
    longhand: [
      "Ýekşenbe",
      "Duşenbe",
      "Sişenbe",
      "Çarşenbe",
      "Penşenbe",
      "Anna",
      "Şenbe",
    ],
  },
  months: {
    shorthand: [
      "Ýan",
      "Few",
      "Mart",
      "Apr",
      "Maý",
      "Iýun",
      "Iýul",
      "Awg",
      "Sen",
      "Okt",
      "Noý",
      "Dek",
    ],
    longhand: [
      "Ýanwar",
      "Fewral",
      "Mart",
      "Aprel",
      "Maý",
      "Iýun",
      "Iýul",
      "Awgust",
      "Sentýabr",
      "Oktýabr",
      "Noýabr",
      "Dekabr",
    ],
  },
  firstDayOfWeek: 1,
  ordinal: (nth: number) => {
    var s = nth % 10 == 0 ? nth % 100 : nth % 10;
    switch (s) {
      case 0:
        return "-njy";
      case 6:
        return "-njy";
      case 9:
        return "-njy";
      case 10:
        return "-njy";
      case 30:
        return "-njy";
      default:
        return "-nji";
    }
  },
  rangeSeparator: " — ",
  weekAbbreviation: "Hp",
  scrollTitle: "Artdyrmak üçin basyň",
  toggleTitle: "Aç/Ýap",
  amPM: ["AM", "PM"],
  yearAriaLabel: "Ýyl",
  monthAriaLabel: "Aý",
  hourAriaLabel: "Sagat",
  minuteAriaLabel: "Minut",
  time_24hr: true,
};

fp.l10ns.tm = Turkmen;

export default fp.l10ns;
