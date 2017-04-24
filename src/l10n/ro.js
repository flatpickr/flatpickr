/* Romanian locals for flatpickr */
var Flatpickr = Flatpickr || {l10ns: {}};
Flatpickr.l10ns.ro = {};

Flatpickr.l10ns.ro.weekdays = {
	shorthand: ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sam"],
	longhand: ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"]
};

Flatpickr.l10ns.ro.months = {
	shorthand: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"],
	longhand: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"]
};

Flatpickr.l10ns.ro.firstDayOfWeek = 1;

Flatpickr.l10ns.ro.ordinal = () => {
	return "";
};

if (typeof module !== "undefined") 
	module.exports = Flatpickr.l10ns;

