/* Macedonian locals for flatpickr */
var Flatpickr = Flatpickr || {l10ns: {}};
Flatpickr.l10ns.mk = {};

Flatpickr.l10ns.mk.weekdays = {
	shorthand: ["Не", "По", "Вт", "Ср", "Че", "Пе", "Са", "Не"],
	longhand: ["Недела", "Понеделник", "Вторник", "Среда", "Четврток", "Петок", "Сабота", "Недела"]
};

Flatpickr.l10ns.mk.months = {
	shorthand: ["Јан", "Фев", "Мар", "Апр", "Мај", "Јун", "Јул", "Авг", "Сеп", "Окт", "Ное", "Дек"],
	longhand: ["Јануари", "Февруари", "Март", "Април", "Мај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"]
};

Flatpickr.l10ns.mk.firstDayOfWeek = 1;
Flatpickr.l10ns.mk.weekAbbreviation = "Нед.";
Flatpickr.l10ns.mk.rangeSeparator = " до ";

if (typeof module !== "undefined") 
	module.exports = Flatpickr.l10ns;
