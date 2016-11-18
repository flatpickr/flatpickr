Flatpickr.l10ns.default.firstDayOfWeek = 1;
//Regular flatpickr

var calendars = document.getElementsByClassName("flatpickr").flatpickr();

flatpickr("#example-defaultDate", {
	enableTime: true,
	defaultDate: 1477697199863
});

document.getElementById("disableRange").flatpickr({
	disable: [
		{
			from: "2016-08-16",
			to: "2016-08-19"
		},
		"2016-08-24",
		new Date().fp_incr(30) // 30 days from now
	]
});

document.getElementById("disableOddDays").flatpickr({
	disable: [
		function(date) { return date.getDate()%2; } // disable odd days
	]
});

document.getElementById("enableNextSeven").flatpickr({
	enable: [
		{
			from: "today",
			to: new Date().fp_incr(7)
		}
	]
});

document.getElementById("enableCustom").flatpickr({
	enable: [
		function(dateObj){
			return dateObj.getDay() %6 !== 0 && dateObj.getFullYear() === 2016;
		}
	]
});

flatpickr("#range-disabled", {
    "mode": "range",
    disable: [date => date.getDate() %6 === 0]
});


// Event API
var events = document.getElementById("events");
function showHook(name) {
	return function(dateObj, dateStr, fp) {
		events.innerHTML += "<b>" + name + "</b> (<code>" + dateObj + "</code>, <code>" + dateStr + "</code> )<br>";
		events.scrollTop = events.offsetTop;
	}
}
document.getElementById("events-api-example").flatpickr({
	minDate: "today",
	enableTime: true,
	onChange: showHook("onChange"),
	onOpen: showHook("onOpen"),
	onClose: showHook("onClose"),
	onMonthChange: showHook("onMonthChange"),
	onYearChange: showHook("onYearChange"),
	onReady: showHook("onReady"),
});

flatpickr("#dayCreate", {
	onDayCreate: function(dObj, dStr, fp, dayElem){
		if (Math.random() < 0.15)
			dayElem.innerHTML += "<span class='event'></span>";
		else if (Math.random() > 0.85)
			dayElem.innerHTML += "<span class='event busy'></span>";
	}
});

// Fiscal calendar
document.getElementById("fiscal").flatpickr({
	weekNumbers: true,
	getWeek: function(givenDate){
		var checkDate = new Date(givenDate.getTime());
		checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
		var time = checkDate.getTime();
		checkDate.setMonth(7);
		checkDate.setDate(28);

		var week = (Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 2);
		if (week < 1) {
			week = 52 + week;
		}

		return 'FW' + ("0" + week).slice(-2);
	}
});



// Date format
var formatOutput = document.getElementById("dateFormatOutput"),
	fp = new Flatpickr(document.createElement("input")),
	now = new Date();

document.getElementById("dateFormatComposer").addEventListener("keyup", function(e){
	formatOutput.textContent = fp.formatDate(e.target.value, now);
});




function initCode() {
	hljs.initHighlighting();
}