/* German locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Greek: CustomLocale = {
  weekdays: {
    shorthand: ["Κυρ", "Δευ", "Τρί", "Τετ", "Πέμ", "Παρ", "Σάβ"],
    longhand: [
      "Κυριακή",
      "Δευτέρα",
      "Τρίτη",
      "Τετάρτη",
      "Πέμπτη",
      "Παρασκευή",
      "Σάββατο",
    ],
  },

  months: {
    shorthand: [
      "Ιαν",
      "Φεβ",
      "Μάρ",
      "Απρ",
      "Μάιος",
      "Ιούν",
      "Ιούλ",
      "Αύγ",
      "Σεπ",
      "Οκτ",
      "Νοέ",
      "Δεκ",
    ],
    longhand: [
      "Ιανουάριος",
      "Φεβρουάριος",
      "Μάρτιος",
      "Απρίλιος",
      "Μάιος",
      "Ιούνιος",
      "Ιούλιος",
      "Σεπτέμβριος",
      "September",
      "Οκτώβριος",
      "Νοέμβριος",
      "Δεκέμβριος",
    ],
  },

  firstDayOfWeek: 0,
  weekAbbreviation: "ηε",
  rangeSeparator: " ος ",
  scrollTitle: "Κύλιση για αύξηση",
  toggleTitle: "Κλικ για εναλλαγή",
  amPM: ["π.μ.", "μ.μ"],
  yearAriaLabel: "χρόνος",
  monthAriaLabel: "μήνας",
  hourAriaLabel: "ώρα",
  minuteAriaLabel: "λεπτό",
  time_24hr: false,
};

fp.l10ns.el = Greek;

export default fp.l10ns;
