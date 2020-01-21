/* Uzbek locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Uzbek: CustomLocale = {
  weekdays: {
    shorthand: ["Якш", "Душ", "Сеш", "Чор", "Пай", "Жум", "Шан"],
    longhand: [
      "Якшанба",
      "Душанба",
      "Сешанба",
      "Чоршанба",
      "Пайшанба",
      "Жума",
      "Шанба",
    ],
  },
  months: {
    shorthand: [
      "янв",
      "фев",
      "мар",
      "апр",
      "май",
      "июн",
      "июл",
      "авг",
      "сен",
      "окт",
      "ноя",
      "дек",
    ],
    longhand: [
      "январ",
      "феврал",
      "март",
      "апрел",
      "май",
      "июн",
      "июл",
      "август",
      "сентябр",
      "октябр",
      "ноябр",
      "декабр",
    ],
  },
  firstDayOfWeek: 1,
  ordinal: function() {
    return "";
  },
  rangeSeparator: " — ",
  weekAbbreviation: "Ҳафта",
  scrollTitle: "Катталаштириш учун айлантиринг",
  toggleTitle: "Ўтиш учун босинг",
  amPM: ["AM", "PM"],
  yearAriaLabel: "Йил",
  time_24hr: true,
};

fp.l10ns.uz = Uzbek;

export default fp.l10ns;
