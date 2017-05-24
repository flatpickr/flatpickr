/* Macedonian locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.mk = {};

flatpickr.l10ns.mk.weekdays = {
	shorthand: ["Не", "По", "Вт", "Ср", "Че", "Пе", "Са", "Не"],
	longhand: ["Недела", "Понеделник", "Вторник", "Среда", "Четврток", "Петок", "Сабота", "Недела"]
};

flatpickr.l10ns.mk.months = {
	shorthand: ["Јан", "Фев", "Мар", "Апр", "Мај", "Јун", "Јул", "Авг", "Сеп", "Окт", "Ное", "Дек"],
	longhand: ["Јануари", "Февруари", "Март", "Април", "Мај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"]
};

flatpickr.l10ns.mk.firstDayOfWeek = 1;
flatpickr.l10ns.mk.weekAbbreviation = "Нед.";
flatpickr.l10ns.mk.rangeSeparator = " до ";

if (typeof module !== "undefined") module.exports = flatpickr.l10ns;