/* Czech locals for flatpickr */
var Flatpickr = Flatpickr||{l10n: {}};

Flatpickr.l10n.weekdays = {
	shorthand: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
	longhand: ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota']
};

Flatpickr.l10n.months = {
	shorthand: ['Led', 'Ún', 'Bře', 'Dub', 'Kvě', 'Čer', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'],
	longhand: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec']
};

Flatpickr.l10n.firstDayOfWeek = 1;

Flatpickr.l10n.ordinal = function() {
	return ".";
};
if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10n;
}
