/* Republic of Korea locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.ko = {};

Flatpickr.l10ns.ko.weekdays = {
	shorthand: ['일', '월', '화', '수', '목', '금', '토'],
	longhand: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
};

Flatpickr.l10ns.ko.months = {
	shorthand: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
	longhand: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
};

Flatpickr.l10ns.ko.ordinal = function () {
	return "일";
};
if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10ns;
}