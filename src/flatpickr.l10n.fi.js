/* Finnish locals for flatpickr */
var Flatpickr = Flatpickr||{l10n: {}};

Flatpickr.l10n.firstDayOfWeek = 1;

Flatpickr.l10n.weekdays = {
	shorthand: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],
	longhand: ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai']
};

Flatpickr.l10n.months = {
	shorthand: ['Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu'],
	longhand: ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu']
};

Flatpickr.l10n.ordinal = () => {
	return ".";
};
if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10n;
}
