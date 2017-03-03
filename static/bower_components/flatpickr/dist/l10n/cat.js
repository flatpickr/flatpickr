/* Catalan locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.cat = {};

Flatpickr.l10ns.cat.weekdays = {
	shorthand: ['Dg', 'Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds'],
	longhand: ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte']
};

Flatpickr.l10ns.cat.months = {
	shorthand: ['Gen', 'Febr', 'Març', 'Abr', 'Maig', 'Juny', 'Jul', 'Ag', 'Set', 'Oct', 'Nov', 'Des'],
	longhand: ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre']
};

Flatpickr.l10ns.cat.ordinal = function (nth) {
	var s = nth % 100;
	if (s > 3 && s < 21) return "è";
	switch (s % 10) {
		case 1:
			return "r";
		case 2:
			return "n";
		case 3:
			return "r";
		case 4:
			return "t";
		default:
			return "è";
	}
};

Flatpickr.l10ns.cat.firstDayOfWeek = 1;

if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10ns;
}