"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.Ukrainian = {
    firstDayOfWeek: 1,
    weekdays: {
        shorthand: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        longhand: [
            "Неділя",
            "Понеділок",
            "Вівторок",
            "Середа",
            "Четвер",
            "П'ятниця",
            "Субота",
        ]
    },
    months: {
        shorthand: [
            "Січ",
            "Лют",
            "Бер",
            "Кві",
            "Тра",
            "Чер",
            "Лип",
            "Сер",
            "Вер",
            "Жов",
            "Лис",
            "Гру",
        ],
        longhand: [
            "Січень",
            "Лютий",
            "Березень",
            "Квітень",
            "Травень",
            "Червень",
            "Липень",
            "Серпень",
            "Вересень",
            "Жовтень",
            "Листопад",
            "Грудень",
        ]
    }
};
fp.l10ns.uk = exports.Ukrainian;
exports["default"] = fp.l10ns;
