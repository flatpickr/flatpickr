/* Indonesian locals for flatpickr */
var Flatpickr = Flatpickr || {l10ns: {}};
Flatpickr.l10ns.id = {};

Flatpickr.l10ns.id.weekdays = {
	shorthand: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
	longhand: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
};

Flatpickr.l10ns.id.months = {
	shorthand: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
	longhand: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
};

Flatpickr.l10ns.id.firstDayOfWeek = 1;

Flatpickr.l10ns.id.ordinal = () => {
	return "";
};
if (typeof module !== "undefined") 
	module.exports = Flatpickr.l10ns;

