/* Thai locals for flatpickr */
var flatpickr = flatpickr || { l10ns: {} };
flatpickr.l10ns.th = {};

flatpickr.l10ns.th.weekdays = {
	shorthand: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
	longhand: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"]
};

flatpickr.l10ns.th.months = {
	shorthand: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
	longhand: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
};

flatpickr.l10ns.th.firstDayOfWeek = 1;
flatpickr.l10ns.th.rangeSeparator = " ถึง ";
flatpickr.l10ns.th.scrollTitle = "เลื่อนเพื่อเพิ่มหรือลด";
flatpickr.l10ns.th.toggleTitle = "คลิกเพื่อเปลี่ยน";

flatpickr.l10ns.th.ordinal = function () {
	return "";
};

if (typeof module !== "undefined") module.exports = flatpickr.l10ns;