/* Armenian locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Armenian: CustomLocale = {
  weekdays: {
    shorthand: ["Կիր", "Երկ", "Երք", "Չրք", "Հնգ", "Ուրբ", "Շբթ"],
    longhand: [
      "Կիրակի",
      "Եկուշաբթի",
      "Երեքշաբթի",
      "Չորեքշաբթի",
      "Հինգշաբթի",
      "Ուրբաթ",
      "Շաբաթ",
    ],
  },
  months: {
    shorthand: [
      "Հնվ",
      "Փտր",
      "Մար",
      "Ապր",
      "Մայ",
      "Հնս",
      "Հլս",
      "Օգս",
      "Սեպ",
      "Հոկ",
      "Նմբ",
      "Դեկ",
    ],
    longhand: [
      "Հունվար",
      "Փետրվար",
      "Մարտ",
      "Ապրիլ",
      "Մայիս",
      "Հունիս",
      "Հուլիս",
      "Օգոստոս",
      "Սեպտեմբեր",
      "Հոկտեմբեր",
      "Նոյեմբեր",
      "Դեկտեմբեր",
    ],
  },
  firstDayOfWeek: 1,
  ordinal: function () {
    return "";
  },
  rangeSeparator: " — ",
  weekAbbreviation: "ՇԲՏ",
  scrollTitle: "Ոլորեք՝ մեծացնելու համար",
  toggleTitle: "Սեղմեք՝ փոխելու համար",
  amPM: ["ՄԿ", "ԿՀ"],
  yearAriaLabel: "Տարի",
  monthAriaLabel: "Ամիս",
  hourAriaLabel: "Ժամ",
  minuteAriaLabel: "Րոպե",
  time_24hr: true,
};

fp.l10ns.hy = Armenian;

export default fp.l10ns;
