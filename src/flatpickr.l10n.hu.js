/* Hungarian locals for flatpickr */
var Flatpickr = Flatpickr||{l10n: {}};

Flatpickr.l10n.firstDayOfWeek = 1;

Flatpickr.l10n.weekdays = {
	shorthand: ['V', 'H', 'K', 'Sz', 'Cs', 'P', 'Szo'],
	longhand: ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat']
};

Flatpickr.l10n.months = {
	shorthand: ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec'],
	longhand: ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December']
};

Flatpickr.l10n.ordinal = function() {
	return ".";
};

Flatpickr.l10n.weekAbbreviation = "Hét";
Flatpickr.l10n.scrollTitle = "Görgessen";
Flatpickr.l10n.toggleTitle = "Kattintson a váltáshoz";

if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10n;
}
