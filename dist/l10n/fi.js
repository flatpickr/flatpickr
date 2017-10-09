"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.Finnish = {
    firstDayOfWeek: 1,
    weekdays: {
        shorthand: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
        longhand: [
            "Sunnuntai",
            "Maanantai",
            "Tiistai",
            "Keskiviikko",
            "Torstai",
            "Perjantai",
            "Lauantai",
        ]
    },
    months: {
        shorthand: [
            "Tammi",
            "Helmi",
            "Maalis",
            "Huhti",
            "Touko",
            "Kesä",
            "Heinä",
            "Elo",
            "Syys",
            "Loka",
            "Marras",
            "Joulu",
        ],
        longhand: [
            "Tammikuu",
            "Helmikuu",
            "Maaliskuu",
            "Huhtikuu",
            "Toukokuu",
            "Kesäkuu",
            "Heinäkuu",
            "Elokuu",
            "Syyskuu",
            "Lokakuu",
            "Marraskuu",
            "Joulukuu",
        ]
    },
    ordinal: function () {
        return ".";
    }
};
fp.l10ns.fi = exports.Finnish;
exports["default"] = fp.l10ns;
