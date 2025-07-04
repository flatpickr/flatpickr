/* Tajik locale for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Tajik: CustomLocale = {
  weekdays: {
    shorthand: ["Яш", "Дш", "Сш", "Чш", "Пш", "Ҷм", "Шн"],
    longhand: [
      "Якшанбе",
      "Душанбе",
      "Сешанбе",
      "Чоршанбе",
      "Панҷшанбе",
      "Ҷумъа",
      "Шанбе",
    ],
  },
  months: {
    shorthand: [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июн",
      "Июл",
      "Авг",
      "Сен",
      "Окт",
      "Ноя",
      "Дек",
    ],
    longhand: [
      "Январ",
      "Феврал",
      "Март",
      "Апрел",
      "Май",
      "Июн",
      "Июл",
      "Август",
      "Сентябр",
      "Октябр",
      "Ноябр",
      "Декабр",
    ],
  },
  firstDayOfWeek: 1,
  ordinal: function () {
    return ""; // Порядковые суффиксы в таджикском не используются в датах
  },
  rangeSeparator: " то ",
  weekAbbreviation: "Ҳафта",
  scrollTitle: "Барои зиёд кардан гардонед",
  toggleTitle: "Барои интихоб кардан пахш кунед",
  amPM: ["AM", "PM"],
  yearAriaLabel: "Сол",
  time_24hr: true,
};

fp.l10ns.tj = Tajik;

export default fp.l10ns;
