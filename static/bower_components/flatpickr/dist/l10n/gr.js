/* Greek locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.gr = {};

Flatpickr.l10ns.gr.weekdays = {
	shorthand: ["Κυ", "Δε", "Τρ", "Τε", "Πέ", "Πα", "Σά"],
	longhand: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"]
};

Flatpickr.l10ns.gr.months = {
	shorthand: ["Ιαν", "Φεβ", "Μάρ", "Απρ", "Μάι", "Ιού", "Ιού", "Αύγ", "Σεπ", "Οκτ", "Νοέ", "Δεκ"],
	longhand: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"]
};

Flatpickr.l10ns.gr.firstDayOfWeek = 1;

Flatpickr.l10ns.gr.ordinal = function () {
	return "";
};

Flatpickr.l10ns.gr.weekAbbreviation = "Εβδ";
Flatpickr.l10ns.gr.rangeSeparator = " έως ";
Flatpickr.l10ns.gr.scrollTitle = "Μετακυλήστε για προσαύξηση";
Flatpickr.l10ns.gr.toggleTitle = "Κάντε κλικ για αλλαγή";

Flatpickr.l10ns.gr.am = "ΠΜ";
Flatpickr.l10ns.gr.pm = "ΜΜ";

if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10ns;
}