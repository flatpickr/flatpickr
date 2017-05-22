/* Spanish locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.es = {};

flatpickr.l10ns.es.weekdays = {
	shorthand: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
	longhand: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
};

flatpickr.l10ns.es.months = {
	shorthand: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
	longhand: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
};

flatpickr.l10ns.es.ordinal = function () {
	return "º";
};

flatpickr.l10ns.es.firstDayOfWeek = 1;
if (typeof module !== "undefined") module.exports = flatpickr.l10ns;