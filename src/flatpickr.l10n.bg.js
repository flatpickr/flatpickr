/* Bulgarian locals for flatpickr */
var Flatpickr = Flatpickr||{l10n: {}};

Flatpickr.l10n.weekdays = {
	shorthand: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
	longhand: ['Неделя', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота']
};

Flatpickr.l10n.months = {
	shorthand: ['Яну', 'Фев', 'Март', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'],
	longhand: ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември']
};
if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10n;
}
