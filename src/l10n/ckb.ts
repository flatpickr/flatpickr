/* Kurdish (Sorani) locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Kurdish: CustomLocale = {
  weekdays: {
    shorthand: [
      "یەکشەممە",
      "دووشەممە",
      "سێشەممە",
      "چوارشەممە",
      "پێنجشەممە",
      "هەینی",
      "شەممە",
    ],
    longhand: [
      "یەکشەممە",
      "دووشەممە",
      "سێشەممە",
      "چوارشەممە",
      "پێنجشەممە",
      "هەینی",
      "شەممە",
    ],
  },

  months: {
    shorthand: [
      "ڕێبەندان",
      "ڕەشەمە",
      "نەورۆز",
      "گوڵان",
      "جۆزەردان",
      "پووشپەڕ",
      "گەلاوێژ",
      "خەرمانان",
      "ڕەزبەر",
      "گەڵاڕێزان",
      "سەرماوەز",
      "بەفرانبار",
    ],
    longhand: [
      "ڕێبەندان",
      "ڕەشەمە",
      "نەورۆز",
      "گوڵان",
      "جۆزەردان",
      "پووشپەڕ",
      "گەلاوێژ",
      "خەرمانان",
      "ڕەزبەر",
      "گەڵاڕێزان",
      "سەرماوەز",
      "بەفرانبار",
    ],
  },
  firstDayOfWeek: 6,
  ordinal: () => {
    return "";
  },
};

fp.l10ns.ckb = Kurdish;

export default fp.l10ns;
