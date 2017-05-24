/* Romanian locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.ro = {};

flatpickr.l10ns.ro.weekdays = {
	shorthand: ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sam"],
	longhand: ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"]
};

flatpickr.l10ns.ro.months = {
	shorthand: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"],
	longhand: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"]
};

flatpickr.l10ns.ro.firstDayOfWeek = 1;

flatpickr.l10ns.ro.ordinal = function () {
	return "";
};

if (typeof module !== "undefined") module.exports = flatpickr.l10ns;