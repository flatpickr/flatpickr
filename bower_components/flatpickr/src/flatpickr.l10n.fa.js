/* Farsi (Persian) locals for flatpickr */
var Flatpickr = Flatpickr||{l10n: {}};

Flatpickr.l10n.weekdays = {
	shorthand: ['یک', 'دو', 'سه', 'چهار', 'پنج', 'آدینه', 'شنبه'],
	longhand: ['یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنچ‌شنبه', 'آدینه', 'شنبه']
};

Flatpickr.l10n.months = {
	shorthand: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'],
	longhand: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر']
};

Flatpickr.l10n.ordinal = () => {
	return "";
};
if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10n;
}
