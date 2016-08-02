/* Hebrew locals for flatpickr */
var Flatpickr = Flatpickr||{l10n: {}};

Flatpickr.l10n.weekdays = {
	shorthand: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז'],
	longhand: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
};

Flatpickr.l10n.months = {
	shorthand: ['ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני', 'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳'],
	longhand: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
};
if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10n;
}
