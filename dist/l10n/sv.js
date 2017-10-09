"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.Swedish = {
    firstDayOfWeek: 1,
    weekAbbreviation: "v",
    weekdays: {
        shorthand: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
        longhand: [
            "Söndag",
            "Måndag",
            "Tisdag",
            "Onsdag",
            "Torsdag",
            "Fredag",
            "Lördag",
        ]
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
            "Januari",
            "Februari",
            "Mars",
            "April",
            "Maj",
            "Juni",
            "Juli",
            "Augusti",
            "September",
            "Oktober",
            "November",
            "December",
        ]
    },
    ordinal: function () {
        return ".";
    }
};
fp.l10ns.sv = exports.Swedish;
exports["default"] = fp.l10ns;
