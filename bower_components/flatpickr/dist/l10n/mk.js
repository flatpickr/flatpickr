"use strict";
exports.__esModule = true;
var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {}
    };
exports.Macedonian = {
    weekdays: {
        shorthand: ["Не", "По", "Вт", "Ср", "Че", "Пе", "Са", "Не"],
        longhand: [
            "Недела",
            "Понеделник",
            "Вторник",
            "Среда",
            "Четврток",
            "Петок",
            "Сабота",
            "Недела",
        ]
    },
    months: {
        shorthand: [
            "Јан",
            "Фев",
            "Мар",
            "Апр",
            "Мај",
            "Јун",
            "Јул",
            "Авг",
            "Сеп",
            "Окт",
            "Ное",
            "Дек",
        ],
        longhand: [
            "Јануари",
            "Февруари",
            "Март",
            "Април",
            "Мај",
            "Јуни",
            "Јули",
            "Август",
            "Септември",
            "Октомври",
            "Ноември",
            "Декември",
        ]
    },
    firstDayOfWeek: 1,
    weekAbbreviation: "Нед.",
    rangeSeparator: " до "
};
fp.l10ns.mk = exports.Macedonian;
exports["default"] = fp.l10ns;
