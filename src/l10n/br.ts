/* Breton locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Breton: CustomLocale = {
  firstDayOfWeek: 1,

  weekdays: {
    shorthand: ["sul", "lun", "meu", "merc'h", "yaou", "gwe", "sad"],
    longhand: [
      "Disul",
      "Dilun",
      "Dimeurzh",
      "Dimerc'hed",
      "Diriaou",
      "Digwener",
      "Disadorn",
    ],
  },

  months: {
    shorthand: [
      "Gen",
      "C'hw",
      "Meu",
      "Ebr",
      "Mae",
      "Eve",
      "Gou",
      "Eos",
      "Gwe",
      "Her",
      "Du",
      "Ker",
    ],
    longhand: [
      "Genver",
      "C'hwevrer",
      "Meurzh",
      "Ebrel",
      "Mae",
      "Mezheven",
      "Gouere",
      "Eost",
      "Gwengolo",
      "Here",
      "Du",
      "Kerzu",
    ],
  },

  ordinal: (nth) => {
    if (nth > 1) return "";

    return "añ";
  },

  rangeSeparator: " betek ",
  weekAbbreviation: "Sizh",
  scrollTitle: "Dibunit da greskiñ",
  toggleTitle: "Klikit evit gwintañ",
  amPM: ["A.M", "G.M"],
  yearAriaLabel: "Bloaz",
  monthAriaLabel: "Miz",
  hourAriaLabel: "Eur",
  minuteAriaLabel: "Munud",
  time_24hr: false,
};

fp.l10ns.br = Breton;

export default fp.l10ns;
