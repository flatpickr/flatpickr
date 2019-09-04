/* Bulgarian locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Bulgarian: CustomLocale = {
  weekdays: {
    shorthand: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    longhand: [
      "Неделя",
      "Понеделник",
      "Вторник",
      "Сряда",
      "Четвъртък",
      "Петък",
      "Събота",
    ],
  },

  months: {
    shorthand: [
      "Яну",
      "Фев",
      "Март",
      "Апр",
      "Май",
      "Юни",
      "Юли",
      "Авг",
      "Сеп",
      "Окт",
      "Ное",
      "Дек",
    ],
    longhand: [
      "Януари",
      "Февруари",
      "Март",
      "Април",
      "Май",
      "Юни",
      "Юли",
      "Август",
      "Септември",
      "Октомври",
      "Ноември",
      "Декември",
    ],
  },
  time_24hr: true,
  firstDayOfWeek: 1,
};

fp.l10ns.bg = Bulgarian;
export default fp.l10ns;
