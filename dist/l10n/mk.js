/* flatpickr v4.2.3, @license MIT */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.mk = {})));
}(this, (function (exports) { 'use strict';

var fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
var Macedonian = {
    weekdays: {
        shorthand: ["Не", "По", "Вт", "Ср", "Че", "Пе", "Са"],
        longhand: [
            "Недела",
            "Понеделник",
            "Вторник",
            "Среда",
            "Четврток",
            "Петок",
            "Сабота",
        ],
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
        ],
    },
    firstDayOfWeek: 1,
    weekAbbreviation: "Нед.",
    rangeSeparator: " до ",
};
fp.l10ns.mk = Macedonian;
var mk = fp.l10ns;

exports.Macedonian = Macedonian;
exports['default'] = mk;

Object.defineProperty(exports, '__esModule', { value: true });

})));
