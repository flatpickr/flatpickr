/* Greek locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.gr = {};

flatpickr.l10ns.gr.weekdays = {
	shorthand: ["Κυ", "Δε", "Τρ", "Τε", "Πέ", "Πα", "Σά"],
	longhand: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"]
};

flatpickr.l10ns.gr.months = {
	shorthand: ["Ιαν", "Φεβ", "Μάρ", "Απρ", "Μάι", "Ιού", "Ιού", "Αύγ", "Σεπ", "Οκτ", "Νοέ", "Δεκ"],
	longhand: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"]
};

flatpickr.l10ns.gr.firstDayOfWeek = 1;

flatpickr.l10ns.gr.ordinal = function () {
	return "";
};

flatpickr.l10ns.gr.weekAbbreviation = "Εβδ";
flatpickr.l10ns.gr.rangeSeparator = " έως ";
flatpickr.l10ns.gr.scrollTitle = "Μετακυλήστε για προσαύξηση";
flatpickr.l10ns.gr.toggleTitle = "Κάντε κλικ για αλλαγή";

flatpickr.l10ns.gr.am = "ΠΜ";
flatpickr.l10ns.gr.pm = "ΜΜ";

if (typeof module !== "undefined") module.exports = flatpickr.l10ns;