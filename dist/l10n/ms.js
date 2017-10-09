"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.Malaysian = {
    weekdays: {
        shorthand: ["Min", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],
        longhand: [
            "Minggu",
            "Isnin",
            "Selasa",
            "Rabu",
            "Khamis",
            "Jumaat",
            "Sabtu",
        ]
    },
    months: {
        shorthand: [
            "Jan",
            "Feb",
            "Mac",
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Ogo",
            "Sep",
            "Okt",
            "Nov",
            "Dis",
        ],
        longhand: [
            "Januari",
            "Februari",
            "Mac",
            "April",
            "Mei",
            "Jun",
            "Julai",
            "Ogos",
            "September",
            "Oktober",
            "November",
            "Disember",
        ]
    },
    firstDayOfWeek: 1,
    ordinal: function () {
        return "";
    }
};
exports["default"] = fp.l10ns;
