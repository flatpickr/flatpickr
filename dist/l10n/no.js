"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.Norwegian = {
    weekdays: {
        shorthand: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
        longhand: [
            "Søndag",
            "Mandag",
            "Tirsdag",
            "Onsdag",
            "Torsdag",
            "Fredag",
            "Lørdag",
        ]
    },
    months: {
        shorthand: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mai",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Okt",
            "Nov",
            "Des",
        ],
        longhand: [
            "Januar",
            "Februar",
            "Mars",
            "April",
            "Mai",
            "Juni",
            "Juli",
            "August",
            "September",
            "Oktober",
            "November",
            "Desember",
        ]
    },
    firstDayOfWeek: 1,
    rangeSeparator: " til ",
    weekAbbreviation: "Uke",
    scrollTitle: "Scroll for å endre",
    toggleTitle: "Klikk for å veksle",
    ordinal: function () {
        return ".";
    }
};
fp.l10ns.no = exports.Norwegian;
exports["default"] = fp.l10ns;
