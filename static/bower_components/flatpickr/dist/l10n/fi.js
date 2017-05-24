/* Finnish locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.fi = {};

flatpickr.l10ns.fi.firstDayOfWeek = 1;

flatpickr.l10ns.fi.weekdays = {
	shorthand: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
	longhand: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"]
};

flatpickr.l10ns.fi.months = {
	shorthand: ["Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä", "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"],
	longhand: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"]
};

flatpickr.l10ns.fi.ordinal = function () {
	return ".";
};
if (typeof module !== "undefined") module.exports = flatpickr.l10ns;