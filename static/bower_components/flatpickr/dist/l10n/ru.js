/* Russian locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.ru = {};

flatpickr.l10ns.ru.firstDayOfWeek = 1; // Monday

flatpickr.l10ns.ru.weekdays = {
	shorthand: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
	longhand: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
};

flatpickr.l10ns.ru.months = {
	shorthand: ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"],
	longhand: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
};
if (typeof module !== "undefined") module.exports = flatpickr.l10ns;