/* Malaysian locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.ms = {};

Flatpickr.l10ns.ms.weekdays = {
	shorthand: ["Min", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],
	longhand: ["Minggu", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"]
};

Flatpickr.l10ns.ms.months = {
	shorthand: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"],
	longhand: ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"]
};

Flatpickr.l10ns.ms.firstDayOfWeek = 1;

Flatpickr.l10ns.ms.ordinal = function () {
	return "";
};
if (typeof module !== "undefined") module.exports = Flatpickr.l10ns;