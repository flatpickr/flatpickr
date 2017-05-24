/* Malaysian locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.ms = {};

flatpickr.l10ns.ms.weekdays = {
	shorthand: ["Min", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],
	longhand: ["Minggu", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"]
};

flatpickr.l10ns.ms.months = {
	shorthand: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"],
	longhand: ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"]
};

flatpickr.l10ns.ms.firstDayOfWeek = 1;

flatpickr.l10ns.ms.ordinal = function () {
	return "";
};
if (typeof module !== "undefined") module.exports = flatpickr.l10ns;