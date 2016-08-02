/* Norwegian locals for flatpickr */
var Flatpickr = Flatpickr||{l10n: {}};

Flatpickr.l10n.weekdays = {
	shorthand: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
	longhand: ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
};

Flatpickr.l10n.months = {
	shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
	longhand: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember']
};

Flatpickr.l10n.ordinal = () => {
	return ".";
};
if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10n;
}
