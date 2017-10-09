"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.Romanian = {
    weekdays: {
        shorthand: ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sam"],
        longhand: [
            "Duminică",
            "Luni",
            "Marți",
            "Miercuri",
            "Joi",
            "Vineri",
            "Sâmbătă",
        ]
    },
    months: {
        shorthand: [
            "Ian",
            "Feb",
            "Mar",
            "Apr",
            "Mai",
            "Iun",
            "Iul",
            "Aug",
            "Sep",
            "Oct",
            "Noi",
            "Dec",
        ],
        longhand: [
            "Ianuarie",
            "Februarie",
            "Martie",
            "Aprilie",
            "Mai",
            "Iunie",
            "Iulie",
            "August",
            "Septembrie",
            "Octombrie",
            "Noiembrie",
            "Decembrie",
        ]
    },
    firstDayOfWeek: 1,
    ordinal: function () {
        return "";
    }
};
fp.l10ns.ro = exports.Romanian;
exports["default"] = fp.l10ns;
