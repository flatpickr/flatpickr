import { Locale } from "../types/locale";

export const english: Locale = {
  weekdays: {
    shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    longhand: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
  months: {
    shorthand: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    longhand: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  monthsHijri: {
    shorthand: [
      "Muh.",
      "Saf.",
      "Rab. 1",
      "Rab. 2",
      "Jum. 1",
      "Jum. 2",
      "Raj.",
      "Shab.",
      "Ramad.",
      "Shaw.",
      "Dhu. 1",
      "Dhu. 2",
    ],
    longhand: [
      "Muharram",
      "Safar",
      "Rabi al-Avval",
      "Rabi ath-thani",
      "Jumada al-thani",
      "Jumada al-thula",
      "Rajab",
      "Shaban",
      "Ramadan",
      "Shawwal",
      "Dhu al-Qadah",
      "Dhu al-Hijjan",
    ],
  },
  daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  firstDayOfWeek: 0,
  ordinal: (nth: number) => {
    const s = nth % 100;
    if (s > 3 && s < 21) return "th";
    switch (s % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  },
  rangeSeparator: " to ",
  weekAbbreviation: "Wk",
  scrollTitle: "Scroll to increment",
  toggleTitle: "Click to toggle",
  amPM: ["AM", "PM"],
  yearAriaLabel: "Year",
};

export default english;
