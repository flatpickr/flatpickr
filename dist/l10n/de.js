"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.German = {
    weekdays: {
        shorthand: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        longhand: [
            "Sonntag",
            "Montag",
            "Dienstag",
            "Mittwoch",
            "Donnerstag",
            "Freitag",
            "Samstag",
        ]
    },
    months: {
        shorthand: [
            "Jan",
            "Feb",
            "Mär",
            "Apr",
            "Mai",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Okt",
            "Nov",
            "Dez",
        ],
        longhand: [
            "Januar",
            "Februar",
            "März",
            "April",
            "Mai",
            "Juni",
            "Juli",
            "August",
            "September",
            "Oktober",
            "November",
            "Dezember",
        ]
    },
    firstDayOfWeek: 1,
    weekAbbreviation: "KW",
    rangeSeparator: " bis ",
    scrollTitle: "Zum Ändern scrollen",
    toggleTitle: "Zum Umschalten klicken"
};
fp.l10ns.de = exports.German;
exports["default"] = fp.l10ns;
