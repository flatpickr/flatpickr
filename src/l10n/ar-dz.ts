/* Algerian Arabic locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const AlgerianArabic: CustomLocale = {
  weekdays: {
    shorthand: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
    longhand: [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ],
  },

  months: {
    shorthand: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    longhand: [
      "جانفي",
      "فيفري",
      "مارس",
      "أفريل",
      "ماي",
      "جوان",
      "جويليه",
      "أوت",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ],
  },
  firstDayOfWeek: 0,
  rangeSeparator: " إلى ",
  weekAbbreviation: "Wk",
  scrollTitle: "قم بالتمرير للزيادة",
  toggleTitle: "اضغط للتبديل",
  yearAriaLabel: "سنة",
  monthAriaLabel: "شهر",
  hourAriaLabel: "ساعة",
  minuteAriaLabel: "دقيقة",
  time_24hr: true,
};

fp.l10ns.ar = AlgerianArabic;

export default fp.l10ns;
