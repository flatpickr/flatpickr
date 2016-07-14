/* Dutch locals for flatpickr */

flatpickr.init.prototype.l10n.weekdays = {
	shorthand: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
	longhand: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag']
};

flatpickr.init.prototype.l10n.months = {
	shorthand: ['Jan', 'Feb', 'Maa', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sept', 'Okt', 'Nov', 'Dec'],
	longhand: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']
};

flatpickr.init.prototype.l10n.firstDayOfWeek = 1;

flatpickr.init.prototype.l10n.ordinal = nth => {
	if (nth === 1 || nth === 8 || nth >= 20) {
		return "ste";
	}

	return "de";
};
