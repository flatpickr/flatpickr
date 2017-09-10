"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fp = (typeof window !== "undefined" && window.flatpickr !== undefined) ? window.flatpickr : {
    l10ns: {},
};
exports.Danish = {
    weekdays: {
        shorthand: ["Søn", "Man", "Tir", "Ons", "Tors", "Fre", "Lør"],
        longhand: [
            "Søndag",
            "Mandag",
            "Tirsdag",
            "Onsdag",
            "Torsdag",
            "Fredag",
            "Lørdag",
        ],
    },
    months: {
        shorthand: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Maj",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Okt",
            "Nov",
            "Dec",
        ],
        longhand: [
            "Januar",
            "Februar",
            "Marts",
            "April",
            "Maj",
            "Juni",
            "Juli",
            "August",
            "September",
            "Oktober",
            "November",
            "December",
        ],
    },
    ordinal: function () {
        return ".";
    },
    firstDayOfWeek: 1,
    rangeSeparator: " til ",
};
fp.l10ns.da = exports.Danish;
exports.default = fp.l10ns;
