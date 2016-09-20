/* Catalan locals for flatpickr */
var Flatpickr = Flatpickr||{l10n: {}};

Flatpickr.l10n.weekdays = {
	shorthand: ['Dg', 'Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds'],
	longhand: ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte']
};

Flatpickr.l10n.months = {
	shorthand: ['Gen', 'Febr', 'Març', 'Abr', 'Maig', 'Juny', 'Jul', 'Ag', 'Set', 'Oct', 'Nov', 'Des'],
	longhand: ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre']
};

Flatpickr.l10n.ordinal = (nth) => {
	const s = nth % 100;
	if (s > 3 && s < 21) return "è";
	switch (s % 10) {
		case 1: return "r";
		case 2: return "n";
		case 3: return "r";
		case 4: return "t";
		default: return "è";
	}
};

Flatpickr.l10n.firstDayOfWeek = 1;

if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10n;
}
