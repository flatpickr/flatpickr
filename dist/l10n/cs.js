/* Czech locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.cs = {};

Flatpickr.l10ns.cs.weekdays = {
	shorthand: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
	longhand: ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota']
};

Flatpickr.l10ns.cs.months = {
	shorthand: ['Led', 'Ún', 'Bře', 'Dub', 'Kvě', 'Čer', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'],
	longhand: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec']
};

Flatpickr.l10ns.cs.firstDayOfWeek = 1;

Flatpickr.l10ns.cs.ordinal = function () {
	return ".";
};
if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10ns;
}