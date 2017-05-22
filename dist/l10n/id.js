/* Indonesian locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.id = {};

flatpickr.l10ns.id.weekdays = {
	shorthand: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
	longhand: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
};

flatpickr.l10ns.id.months = {
	shorthand: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
	longhand: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
};

flatpickr.l10ns.id.firstDayOfWeek = 1;

flatpickr.l10ns.id.ordinal = function () {
	return "";
};
if (typeof module !== "undefined") module.exports = flatpickr.l10ns;