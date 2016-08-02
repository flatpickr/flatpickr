/* Arabic locals for flatpickr */
var Flatpickr = Flatpickr||{l10n: {}};

Flatpickr.l10n.weekdays = {
	shorthand: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
	longhand: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
};

Flatpickr.l10n.months = {
	shorthand: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
	longhand: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
};
if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10n;
}
