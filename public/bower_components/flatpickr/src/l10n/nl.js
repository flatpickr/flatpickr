/* Dutch locals for flatpickr */
var Flatpickr = Flatpickr||{l10ns: {}};
Flatpickr.l10ns.nl = {};

Flatpickr.l10ns.nl.weekdays = {
	shorthand: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
	longhand: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag']
};

Flatpickr.l10ns.nl.months = {
	shorthand: ['Jan', 'Feb', 'Maa', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sept', 'Okt', 'Nov', 'Dec'],
	longhand: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
};

Flatpickr.l10ns.nl.firstDayOfWeek = 1;

Flatpickr.l10ns.nl.ordinal = nth => {
	if (nth === 1 || nth === 8 || nth >= 20) {
		return "ste";
	}

	return "de";
};
if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10ns;
}
