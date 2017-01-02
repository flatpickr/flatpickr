/* Thai locals for flatpickr */
var Flatpickr = Flatpickr || { l10ns: {} };
Flatpickr.l10ns.th = {};

Flatpickr.l10ns.th.weekdays = {
	shorthand: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
	longhand: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
};

Flatpickr.l10ns.th.months = {
	shorthand: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
	longhand: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
};

Flatpickr.l10ns.th.firstDayOfWeek = 1;
Flatpickr.l10ns.th.rangeSeparator = " ถึง ", Flatpickr.l10ns.th.scrollTitle = "เลื่อนเพื่อเพิ่มหรือลด", Flatpickr.l10ns.th.toggleTitle = "คลิกเพื่อเปลี่ยน";

Flatpickr.l10ns.th.ordinal = function () {
	return "";
};

if (typeof module !== "undefined") {
	module.exports = Flatpickr.l10ns;
}