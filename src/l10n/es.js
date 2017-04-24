/* Spanish locals for flatpickr */
var Flatpickr = Flatpickr || {l10ns: {}};
Flatpickr.l10ns.es = {};

Flatpickr.l10ns.es.weekdays = {
	shorthand: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
	longhand: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
};

Flatpickr.l10ns.es.months = {
	shorthand: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
	longhand: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
};

Flatpickr.l10ns.es.ordinal = () => {
	return "º";
};

Flatpickr.l10ns.es.firstDayOfWeek = 1;
if (typeof module !== "undefined") 
	module.exports = Flatpickr.l10ns;

