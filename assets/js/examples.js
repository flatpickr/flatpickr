var playgroundCalendar, playground_json, userConfig = {
	inline: true,
	enableTime: true
};

function toggleConfig(e) {
	e.preventDefault();
	var option = e.target.dataset.option,
		config = playgroundCalendar.config,
		element = playgroundCalendar.element,
		selectedDates;

	if (playgroundCalendar.selectedDates.length)
		selectedDates = playgroundCalendar.selectedDates;

	if (!Flatpickr.defaultConfig[option] && userConfig[option])
		delete userConfig[option];

	else
		userConfig[option] = typeof Flatpickr.defaultConfig[option] === "boolean"
			? !Flatpickr.defaultConfig[option]
			: e.target.value;


	config[option] = userConfig[option];

	if (config.enableTime) {
		config.dateFormat = config.noCalendar
			? "H:i" + (config.enableSeconds ? ":S" : "")
			: Flatpickr.defaultConfig.dateFormat + " H:i" + (config.enableSeconds ? ":S" : "");

		config.altFormat = config.noCalendar
			? "h:i" + (config.enableSeconds ? ":S K" : " K")
			: Flatpickr.defaultConfig.altFormat + " h:i" + (config.enableSeconds ? ":S" : "") + " K";
	}

	else {
		config.dateFormat = Flatpickr.defaultConfig.dateFormat;
		config.altFormat = Flatpickr.defaultConfig.altFormat;
	}


	if (selectedDates)
		config.defaultDate = selectedDates;

	playground_json.textContent = JSON.stringify(userConfig, null, 4);

	playgroundCalendar.destroy();
	playgroundCalendar = new Flatpickr(element, config);
}

function setupPlayground() {
	playgroundCalendar = flatpickr("#playground_calendar", userConfig);

	var fragment = document.createDocumentFragment(),
		keys = [
			"altInput", "allowInput", "enableTime", "enableSeconds",
			"inline", "noCalendar", "time_24hr", "utc"
		],
		li, label, checkbox, span;


	for (var i = 0; i < keys.length; i++) {
		li = document.createElement("li");
		label = document.createElement("label");
		span = document.createElement("span");

		checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.setAttribute("data-option", keys[i]);

		if (playgroundCalendar.config[keys[i]])
			checkbox.checked = "checked";

		checkbox.addEventListener("change", toggleConfig);

		span.innerHTML = keys[i];

		label.appendChild(checkbox);
		label.appendChild(span);
		li.appendChild(label);
		fragment.appendChild(li);
	}



	document.getElementById("playground").insertBefore(
		fragment,
		document.getElementById("playground").firstChild
	);

	document.getElementById("minDate").addEventListener("change", function(e){
		if (e.target.value)
			playgroundCalendar.set("minDate", e.target.value);

		else
			playgroundCalendar.set("minDate", null);
	});

	document.getElementById("minDateClear").addEventListener("click", function(){
		playgroundCalendar.set("minDate", null);
		document.getElementById("minDate").value = "";

		if (playgroundCalendar.selectedDates && playgroundCalendar.config.minDate
			&& playgroundCalendar.config.minDate.getTime() > playgroundCalendar.selectedDates[0].getTime()
		)
			playgroundCalendar.clear();
	});

	var modes = document.getElementsByClassName("mode");
	for (var i = 0; i < modes.length; i++) {
		modes[i].addEventListener("change", toggleConfig);
	}

	playground_json = document.getElementById("playground_json");
	playground_json.textContent= JSON.stringify(userConfig, null, 4);
	playground_json.style.display = "none";

	document.getElementById("show_json").addEventListener("click", function(){
		playground_json.style.display = playground_json.style.display === "block" ? "none" : "block";
	});
}

function fp_ready(){
	// setting custom defaults

	Flatpickr.l10n.firstDayOfWeek = 1;
	//Regular flatpickr

	var calendars = document.getElementsByClassName("flatpickr").flatpickr();

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

	// Event API
	var events = document.getElementById("events");
	document.getElementById("events-api-example").flatpickr({
		minDate: "today",
		enableTime: true,
		onChange: function(dateObj, dateStr, fp) {
			console.log(fp.selectedDateObj);
			events.innerHTML += "<b>onChange</b> (<code>" + dateObj + "</code>, <code>" + dateStr + "</code> )<br>";
			events.scrollTop = events.offsetTop;
		},
		onOpen: function(dateObj, dateStr, fp){
			events.innerHTML += "<b>onOpen</b> (<code>" + dateObj + "</code>, <code>" + dateStr + "</code> )<br>";
			events.scrollTop = events.offsetTop;
		},
		onClose: function(dateObj, dateStr, fp){
			events.innerHTML += "<b>onClose</b> (<code>" + dateObj + "</code>, <code>" + dateStr + "</code> )<br>";
			events.scrollTop = events.offsetTop;
		},
		onReady: function(dateObj, dateStr, fp){
			events.innerHTML += "<b>onReady</b> (<code>" + dateObj + "</code>, <code>" + dateStr + "</code> )<br>";
			events.scrollTop = events.offsetTop;
		}
	});

	flatpickr("#dayCreate", {
		onDayCreate: function(dObj, dStr, fp, dayElem){
			if (Math.random() < 0.15)
				dayElem.innerHTML += "<span class='event'></span>";
			else if (Math.random() > 0.85)
				dayElem.innerHTML += "<span class='event busy'></span>";
		}
	});


	var fiscal = document.getElementById("fiscal").flatpickr({
		weekNumbers: true
	});

	// Fiscal calendar
	fiscal.getWeek = function(givenDate){
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
	fiscal.redraw();
	// Date format
	var fpInstance = new Flatpickr(document.createElement("input")),
		formatOutput = document.getElementById("dateFormatOutput"),
		now = new Date();

	// document.getElementById("dateFormatComposer").addEventListener("keyup", function(e){
	// 	formatOutput.textContent = fpInstance.formatDate(e.target.value, now);
	// });

	setupPlayground();

}