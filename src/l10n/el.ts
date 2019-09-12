import { Locale } from "../types/locale";

export const greek: Locale = {
  weekdays: {
    shorthand: ["Κυρ","Δευ","Τρι","Τετ","Πεμ","Παρ","Σαβ"],
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
      "Μαρ",
      "Απρ",
      "Μαϊ",
      "Ιουν",
      "Ιουλ",
      "Αυγ",
      "Σεπ",
      "Οκτ",
      "Νοε",
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
      "Αύγουστος",
      "Σεπτέμβριος",
      "Οκτώβριος",
      "Νοέμβριος",
      "Δεκέμβριος",
    ],
      
  },
      
  daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  firstDayOfWeek: 0,
  ordinal: (nth: number) => {
    if (nth > 1) return "η";
  },

  rangeSeparator: " ως ",
  weekAbbreviation: "Εβ",
  scrollTitle: "Σύρατε για αύξηση",
  toggleTitle: "Κλικ για εναλλαγή",
  amPM: ["πμ", "μμ"],
  yearAriaLabel: "Έτος",
  hourAriaLabel: "Ώρα",
  minuteAriaLabel: "Λεπτό",
  time_24hr: true,
};


export default greek;
