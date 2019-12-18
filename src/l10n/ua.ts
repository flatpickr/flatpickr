/* Ukrainian locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Ukrainian: CustomLocale = {
  weekdays: {
    shorthand: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    longhand: [
      "Неділя",
      "Понеділок",
      "Вівторок",
      "Середа",
      "Четвер",
      "П'ятниця",
      "Суббота",
    ],
  },
  months: {
    shorthand: [
      "Січ",
      "Лют",
      "Бер",
      "Квіт",
      "Трав",
      "Чер",
      "Лип",
      "Сер",
      "Вер",
      "Жов",
      "Лис",
      "Груд",
    ],
    longhand: [
      "Січень",
      "Лютий",
      "Березень",
      "Квітень",
      "Травень",
      "Червень",
      "Липень",
      "Серпень",
      "Вересень",
      "Жовтень",
      "Листопад",
      "Грудень",
    ],
  },
  firstDayOfWeek: 1,
  ordinal: function() {
    return "";
  },
  rangeSeparator: " — ",
  weekAbbreviation: "Нед.",
  scrollTitle: "Прокрутіть для збільшення",
  toggleTitle: "Натисніть для перемикання",
  amPM: ["ДП", "ПП"],
  yearAriaLabel: "Рік",
  time_24hr: true,
};

fp.l10ns.ru = Ukrainian;

export default fp.l10ns;
