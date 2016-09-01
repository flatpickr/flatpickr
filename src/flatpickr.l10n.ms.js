/* Malaysian locals for flatpickr */
var Flatpickr = Flatpickr||{l10n: {}};

Flatpickr.l10n.weekdays = {
	shorthand: ['Min', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'],
	longhand: ['Minggu', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu']
};

Flatpickr.l10n.months = {
	shorthand: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'],
	longhand: ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember']
};

Flatpickr.l10n.firstDayOfWeek = 1;

Flatpickr.l10n.ordinal = () => {
	return "";
};
if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10n;
}
