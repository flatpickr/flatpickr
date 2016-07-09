const flatpickr = function (selector, config) {
	let elements;

	const createInstance = function (element) {
		if (element._flatpickr) {
			element._flatpickr.destroy();
		}

		element._flatpickr = new flatpickr.init(element, config);
		return element._flatpickr;
	};

	if (selector.nodeName) {
		return createInstance(selector);
	}
	/*
	Utilize the performance of native getters if applicable
	https://jsperf.com/getelementsbyclassname-vs-queryselectorall/18
	https://jsperf.com/jquery-vs-javascript-performance-comparison/22
	*/
	else if (/^#[a-zA-Z0-9\-_]*$/.test(selector)) {
		return createInstance(document.getElementById(selector.slice(1)));
	}

	else if (/^\.[a-zA-Z0-9\-_]*$/.test(selector)) {
		elements = document.getElementsByClassName(selector.slice(1));
	}

	else {
		elements = document.querySelectorAll(selector);
	}

	const instances = [].slice.call(elements).map(createInstance);

	return {
		calendars: instances,
		byID: id => {
			for (let i = 0; i < instances.length; i++) {
				if (instances[i].element.id === id) {
					return instances[i];
				}
			}

			return null;
		}

	};
};

/**
 * @constructor
 */
flatpickr.init = function (element, instanceConfig) {
	const createElement = (tag, className, content) => {
		const newElement = document.createElement(tag);

		if (content) {
			newElement.innerHTML = content;
		}

		if (className) {
			newElement.className = className;
		}

		return newElement;
	};

	// functions
	const self = this;
	let	parseConfig,
		init,
		wrap,
		uDate,
		equalDates,
		pad,
		formatDate,
		monthToStr,
		isEnabled,

		buildMonthNavigation,
		buildWeekdays,
		buildCalendar,
		buildDays,
		buildWeeks,
		buildTime,

		timeWrapper,
		yearScroll,
		updateValue,
		amPMToggle,

		onKeyDown,
		onManualInput,
		onResize,

		updateNavigationCurrentMonth,

		handleYearChange,
		changeMonth,
		getDaysinMonth,
		documentClick,
		calendarClick,

		getRandomCalendarIdStr,
		bind,

		triggerChange;

	// elements & variables
	let calendarContainer,
		timeContainer,
		navigationCurrentMonth,
		monthsNav,
		prevMonthNav,
		currentYearElement,
		currentMonthElement,
		nextMonthNav,
		calendar,
		weekNumbers,
		now = new Date(),
		wrapperElement,
		hourElement,
		minuteElement,
		secondElement,
		amPM,
		clickEvt;

	self.formats = {
		// weekday name, short, e.g. Thu
		D: () => self.l10n.weekdays.shorthand[self.formats.w()],

		// full month name e.g. January
		F: () => monthToStr(self.formats.n() - 1, false),

		// hours with leading zero e.g. 03
		H: () => pad(self.selectedDateObj.getHours()),

		// day (1-30) with ordinal suffix e.g. 1st, 2nd
		J: () => self.formats.j() + self.l10n.ordinal(self.formats.j()),

		// AM/PM
		K: () => self.selectedDateObj.getHours() > 11 ? "PM" : "AM",

		// shorthand month e.g. Jan, Sep, Oct, etc
		M: () => monthToStr(self.formats.n() - 1, true),

		// seconds 00-59
		S: () => pad(self.selectedDateObj.getSeconds()),

		// unix timestamp
		U: () => self.selectedDateObj.getTime() / 1000,

		// full year e.g. 2016
		Y: () => self.selectedDateObj.getFullYear(),

		// day in month, padded (01-30)
		d: () => pad(self.formats.j()),

		// hour from 1-12 (am/pm)
		h: () => self.selectedDateObj.getHours() % 12 ? self.selectedDateObj.getHours() % 12 : 12,

		// minutes, padded with leading zero e.g. 09
		i: () => pad(self.selectedDateObj.getMinutes()),

		// day in month (1-30)
		j: () => self.selectedDateObj.getDate(),

		// weekday name, full, e.g. Thursday
		l: () => self.l10n.weekdays.longhand[self.formats.w()],

		// padded month number (01-12)
		m: () => pad(self.formats.n()),

		// the month number (1-12)
		n: () => self.selectedDateObj.getMonth() + 1,

		// seconds 0-59
		s: () => self.selectedDateObj.getSeconds(),

		// number of the day of the week
		w: () => self.selectedDateObj.getDay(),

		// last two digits of year e.g. 16 for 2016
		y: () => String(self.formats.Y()).substring(2)
	};

	init = function () {
		// deep copy
		self.defaultConfig = Object.assign({}, flatpickr.init.prototype.defaultConfig);

		instanceConfig = instanceConfig || {};

		self.config = {};
		self.element = element;

		Object.keys(self.defaultConfig).forEach(config => {
			self.config[config] = parseConfig(config);
		});

		self.input = (self.config.wrap) ? element.querySelector("[data-input]") : element;
		self.input.classList.add("flatpickr-input");

		if (self.config.defaultDate) {
			self.config.defaultDate = uDate(self.config.defaultDate);
		}

		if (self.input.value || self.config.defaultDate) {
			self.selectedDateObj = uDate(self.config.defaultDate || self.input.value);
		}


		wrap();
		buildCalendar();
		bind();

		self.uDate = uDate;

		self.jumpToDate();
		updateValue();

		if (!self.config.static && !self.config.inline) {
			self.positionCalendar();
		}
	};

	parseConfig = option => {
		let configValue = self.defaultConfig[option];

		if (instanceConfig.hasOwnProperty(option)) {
			configValue = instanceConfig[option];
		}

		else if (self.element.dataset && self.element.dataset[option.toLowerCase()] !== undefined) {
			configValue = self.element.dataset[option.toLowerCase()];
		}

		else if (!self.element.dataset && self.element.getAttribute(`data-${option}`) !== undefined) {
			configValue = self.element.getAttribute(`data-${option}`);
		}

		if (typeof self.defaultConfig[option] === "boolean") {
			configValue = String(configValue) !== "false";
		}


		if (option === "enableTime" && configValue === true) {
			self.defaultConfig.dateFormat = (!self.config.time_24hr ? "Y-m-d h:i K" : "Y-m-d H:i");
			self.defaultConfig.altFormat = (!self.config.time_24hr ? "F j Y, h:i K" : "F j, Y H:i");
		}
		else if (option === "noCalendar" && configValue === true) {
			self.defaultConfig.dateFormat = "h:i K";
			self.defaultConfig.altFormat = "h:i K";
		}

		return configValue;
	};

	getRandomCalendarIdStr = function () {
		let randNum,
			idStr;
		do {
			randNum = Math.round(Math.random() * Math.pow(10, 10));
			idStr = `flatpickr-${randNum}`;
		} while (document.getElementById(idStr) !== null);

		return idStr;
	};

	uDate = function (date, timeless) {
		timeless = timeless || false;

		if (date === "today") {
			date = new Date();
			timeless = true;
		}

		else if (typeof date === "string") {
			date = date.trim();

			if (self.config.parseDate) {
				date = self.config.parseDate(date);
			}

			else if (/^\d\d\d\d\-\d{1,2}\-\d\d$/.test(date)) {
				// this utc datestring gets parsed, but incorrectly by Date.parse
				date = new Date(date.replace(/(\d)-(\d)/g, "$1/$2"));
			}

			else if (Date.parse(date)) {
				date = new Date(date);
			}

			else if (/^\d\d\d\d\-\d\d\-\d\d/.test(date)) { // disable special utc datestring
				date = new Date(date.replace(/(\d)-(\d)/g, "$1/$2"));
			}

			else if (/^(\d?\d):(\d\d)/.test(date)) { // time-only picker
				const matches = date.match(/^(\d?\d):(\d\d)(:(\d\d))?/),
					seconds = matches[4] !== undefined ? matches[4] : 0;

				date = new Date();
				date.setHours(matches[1], matches[2], seconds, 0);
			}

			else {
				console.error(`flatpickr: invalid date string ${date}`);
				console.info(self.element);
			}
		}

		if (!(date instanceof Date) || !date.getTime()) {
			return null;
		}

		if (timeless) {
			date.setHours(0, 0, 0, 0);
		}

		if (self.config.utc && !date.fp_isUTC) {
			date = date.fp_toUTC();
		}

		return date;
	};

	equalDates = (date1, date2) => (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);

	wrap = function () {
		wrapperElement = createElement("div", "flatpickr-wrapper");

		if (self.config.inline || self.config.static) {
			// Wrap input and place calendar underneath
			self.element.parentNode.insertBefore(wrapperElement, self.element);
			wrapperElement.appendChild(self.element);

			wrapperElement.classList.add(self.config.inline ? "inline" : "static");
		}

		else {
			// Insert at bottom of BODY tag to display outside
			// of relative positioned elements with css "overflow: hidden;"
			// property set.
			document.body.appendChild(wrapperElement);
		}

		if (self.config.altInput) {
			// replicate self.element
			self.altInput = createElement(
				self.input.nodeName,
				`${self.config.altInputClass} flatpickr-input`
			);
			self.altInput.placeholder = self.input.placeholder;
			self.altInput.type = "text";

			self.input.type = "hidden";
			self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
		}
	};

	getDaysinMonth = function (givenMonth) {
		const yr = self.currentYear,
			month = givenMonth || self.currentMonth;

		if (month === 1 && ((yr % 4 === 0) && (yr % 100 !== 0)) || (yr % 400 === 0)) {
			return 29;
		}

		return self.l10n.daysInMonth[month];
	};

	updateValue = function (e) {
		let timeHasChanged;

		if (self.selectedDateObj && self.config.enableTime) {
			const previousTimestamp = self.selectedDateObj.getTime();

			// update time
			let hours = (parseInt(hourElement.value, 10) || 0),
				seconds;

			const minutes = (60 + (parseInt(minuteElement.value, 10) || 0)) % 60;

			if (self.config.enableSeconds) {
				seconds = (60 + (parseInt(secondElement.value, 10)) || 0) % 60;
			}

			if (!self.config.time_24hr) {
				hours = hours % 12 + 12 * (amPM.innerHTML === "PM");
			}

			self.selectedDateObj.setHours(
				hours,
				minutes,
				seconds === undefined ? self.selectedDateObj.getSeconds() : seconds
			);

			hourElement.value = pad(
				!self.config.time_24hr ? (12 + hours) % 12 + 12 * (hours % 12 === 0) : hours
			);
			minuteElement.value = pad(minutes);

			if (seconds !== undefined) {
				secondElement.value = pad(seconds);
			}

			timeHasChanged = self.selectedDateObj.getTime() !== previousTimestamp;
		}

		if (self.selectedDateObj) {
			self.input.value = formatDate(self.config.dateFormat);

			if (self.altInput) {
				self.altInput.value = formatDate(self.config.altFormat);
			}
		}

		if (e && (timeHasChanged || e.target.classList.contains("flatpickr-day"))) {
			triggerChange();
		}
	};

	pad = num => `0${num}`.slice(-2);

	formatDate = function (dateFormat) {
		let formattedDate = "";
		const formatPieces = dateFormat.split("");

		for (let i = 0; i < formatPieces.length; i++) {
			const c = formatPieces[i];
			if (self.formats.hasOwnProperty(c) && formatPieces[i - 1] !== "\\") {
				formattedDate += self.formats[c]();
			}

			else if (c !== "\\") {
				formattedDate += c;
			}
		}

		return formattedDate;
	};

	monthToStr = function (date, shorthand) {
		if (shorthand || self.config.shorthandCurrentMonth) {
			return self.l10n.months.shorthand[date];
		}

		return self.l10n.months.longhand[date];
	};


	isEnabled = function (dateToCheck) {
		if (
			(self.config.minDate && dateToCheck < self.config.minDate) ||
			(self.config.maxDate && dateToCheck > self.config.maxDate)
		) {
			return false;
		}

		dateToCheck = uDate(dateToCheck, true); // timeless

		const bool = self.config.enable.length > 0,
			array = bool ? self.config.enable : self.config.disable;

		let d;

		for (let i = 0; i < array.length; i++) {
			d = array[i];

			if (d instanceof Function && d(dateToCheck)) { // disabled by function
				return bool;
			}

			else if ( // disabled weekday
				typeof d === "string" &&
				/^wkd/.test(d) &&
				dateToCheck.getDay() === (parseInt(d.slice(-1), 10) + self.l10n.firstDayOfWeek - 1) % 7
			) {
				return bool;
			}

			else if ((d instanceof Date || (typeof d === "string" && !/^wkd/.test(d))) &&
				uDate(d, true).getTime() === dateToCheck.getTime()
			) {
				// disabled by date string
				return bool;
			}

			else if ( // disabled by range
				typeof d === "object" &&
				d.hasOwnProperty("from") &&
				dateToCheck >= uDate(d.from) &&
				dateToCheck <= uDate(d.to)
			) {
				return bool;
			}
		}

		return !bool;
	};

	yearScroll = event => {
		event.preventDefault();

		let delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.deltaY)));
		self.currentYear = event.target.value = parseInt(event.target.value, 10) + delta;
		self.redraw();
	};

	timeWrapper = function (e) {
		e.preventDefault();
		e.target.blur();

		const min = parseInt(e.target.min, 10),
			max = parseInt(e.target.max, 10),
			step = parseInt(e.target.step, 10),
			value = parseInt(e.target.value, 10);

		let newValue = value;

		if (e.type === "wheel") {
			newValue = value + step * (Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY))));
		}

		if (newValue <= min) {
			newValue = max - step;
		}

		else if (newValue >= max) {
			newValue = min + step;
		}

		e.target.value = pad(newValue);
	};


	updateNavigationCurrentMonth = function () {
		currentMonthElement.innerHTML = `${monthToStr(self.currentMonth)} `;
		currentYearElement.value = self.currentYear;
	};

	handleYearChange = function () {
		if (self.currentMonth < 0 || self.currentMonth > 11) {
			self.currentYear += self.currentMonth % 11;
			self.currentMonth = (self.currentMonth + 12) % 12;
		}
	};

	documentClick = function (event) {
		if (self.isOpen && !wrapperElement.contains(event.target) &&
			!self.element.contains(event.target) && event.target !== (self.altInput || self.input)
		) {
			self.close();
		}
	};

	changeMonth = function (offset) {
		self.currentMonth += offset;

		handleYearChange();
		updateNavigationCurrentMonth();
		buildDays();
	};

	calendarClick = function (e) {
		e.preventDefault();

		if (e.target.classList.contains("slot")) {
			self.selectedDateObj = new Date(
				self.currentYear, self.currentMonth, e.target.innerHTML
			);

			updateValue(e);
			buildDays();

			if (!self.config.inline && !self.config.enableTime) {
				self.close();
			}
		}
	};

	buildCalendar = function () {
		calendarContainer = createElement("div", "flatpickr-calendar");
		calendarContainer.id = getRandomCalendarIdStr();

		calendar = createElement("div", "flatpickr-days");
		calendar.tabIndex = -1;

		if (!self.config.noCalendar) {
			buildMonthNavigation();
			buildWeekdays();

			if (self.config.weekNumbers) {
				buildWeeks();
			}

			buildDays();

			calendarContainer.appendChild(calendar);
		}

		wrapperElement.appendChild(calendarContainer);

		if (self.config.enableTime) {
			buildTime();
		}
	};

	buildMonthNavigation = function () {
		monthsNav = createElement("div", "flatpickr-month");

		prevMonthNav = createElement("span", "flatpickr-prev-month", self.config.prevArrow);

		currentMonthElement = createElement("span", "cur_month");

		currentYearElement = createElement("input", "cur_year");
		currentYearElement.type = "number";
		currentYearElement.title = self.l10n.scrollTitle;

		nextMonthNav = createElement("span", "flatpickr-next-month", self.config.nextArrow);

		navigationCurrentMonth = createElement("span", "flatpickr-current-month");
		navigationCurrentMonth.appendChild(currentMonthElement);
		navigationCurrentMonth.appendChild(currentYearElement);

		monthsNav.appendChild(prevMonthNav);
		monthsNav.appendChild(navigationCurrentMonth);
		monthsNav.appendChild(nextMonthNav);

		updateNavigationCurrentMonth();
		calendarContainer.appendChild(monthsNav);
	};

	buildWeekdays = function () {
		const weekdayContainer = createElement("div", "flatpickr-weekdays"),
			firstDayOfWeek = self.l10n.firstDayOfWeek;

		let	weekdays = self.l10n.weekdays.shorthand.slice();


		if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
			weekdays = [].concat(
				weekdays.splice(firstDayOfWeek, weekdays.length),
				weekdays.splice(0, firstDayOfWeek)
			);
		}

		if (self.config.weekNumbers) {
			weekdayContainer.innerHTML = `<span>${self.l10n.weekAbbreviation}</span>`;
		}

		weekdayContainer.innerHTML += `<span>${weekdays.join("</span><span>")}</span>`;

		calendarContainer.appendChild(weekdayContainer);
	};

	buildWeeks = function () {
		calendarContainer.classList.add("hasWeeks");

		weekNumbers = createElement("div", "flatpickr-weeks");
		calendarContainer.appendChild(weekNumbers);
	};

	buildDays = function () {
		const firstOfMonth = (
				new Date(self.currentYear, self.currentMonth, 1).getDay() -
				self.l10n.firstDayOfWeek + 7
			) % 7,
			numDays = getDaysinMonth(),
			prevMonthDays = getDaysinMonth((self.currentMonth - 1 + 12) % 12);

		let	dayNumber = prevMonthDays + 1 - firstOfMonth,
			currentDate,
			dateIsDisabled;

		if (self.config.weekNumbers && weekNumbers) {
			weekNumbers.innerHTML = "";
		}

		calendar.innerHTML = "";

		self.config.minDate = uDate(self.config.minDate, true);
		self.config.maxDate = uDate(self.config.maxDate, true);

		// prepend days from the ending of previous month
		for (; dayNumber <= prevMonthDays; dayNumber++) {
			calendar.appendChild(createElement("span", "disabled flatpickr-day", dayNumber));
		}

		let dayElement;

		// Start at 1 since there is no 0th day
		for (dayNumber = 1; dayNumber <= 42 - firstOfMonth; dayNumber++) {
			if (dayNumber <= numDays || dayNumber % 7 === 1) {
				// avoids new date objects for appended dates
				currentDate = new Date(self.currentYear, self.currentMonth, dayNumber, 0, 0, 0, 0, 0);
			}

			if (self.config.weekNumbers && weekNumbers && dayNumber % 7 === 1) {
				weekNumbers.appendChild(
					createElement("span", "disabled flatpickr-day", currentDate.fp_getWeek())
				);
			}

			dateIsDisabled = dayNumber > numDays || !isEnabled(currentDate);

			dayElement = createElement(
				"span",
				`${dateIsDisabled ? "disabled" : "slot"} flatpickr-day`,
				(dayNumber > numDays ? dayNumber % numDays : dayNumber)
			);

			if (!dateIsDisabled) {
				dayElement.tabIndex = 0;

				if (equalDates(currentDate, now)) {
					dayElement.classList.add("today");
				}

				if (self.selectedDateObj && equalDates(currentDate, self.selectedDateObj)) {
					dayElement.classList.add("selected");
				}
			}

			calendar.appendChild(dayElement);
		}
	};

	buildTime = function () {
		timeContainer = createElement("div", "flatpickr-time");
		timeContainer.tabIndex = -1;
		const separator = createElement("span", "flatpickr-time-separator", ":");

		hourElement = createElement("input", "flatpickr-hour");
		minuteElement = createElement("input", "flatpickr-minute");

		hourElement.tabIndex = minuteElement.tabIndex = 0;
		hourElement.type = minuteElement.type = "number";

		hourElement.value =
			self.selectedDateObj ? pad(self.selectedDateObj.getHours()) : 12;

		minuteElement.value =
			self.selectedDateObj ? pad(self.selectedDateObj.getMinutes()) : "00";


		hourElement.step = self.config.hourIncrement;
		minuteElement.step = self.config.minuteIncrement;

		hourElement.min = -self.config.time_24hr;
		hourElement.max = self.config.time_24hr ? 24 : 13;

		minuteElement.min = -minuteElement.step;
		minuteElement.max = 60;

		hourElement.title = minuteElement.title = self.l10n.scrollTitle;

		timeContainer.appendChild(hourElement);
		timeContainer.appendChild(separator);
		timeContainer.appendChild(minuteElement);

		if (self.config.enableSeconds) {
			timeContainer.classList.add("has-seconds");

			secondElement = createElement("input", "flatpickr-second");
			secondElement.type = "number";
			secondElement.value = self.selectedDateObj ? pad(self.selectedDateObj.getSeconds()) : "00";

			secondElement.step = minuteElement.step;
			secondElement.min = minuteElement.min;
			secondElement.max = minuteElement.max;

			timeContainer.appendChild(createElement("span", "flatpickr-time-separator", ":"));
			timeContainer.appendChild(secondElement);
		}

		if (!self.config.time_24hr) { // add amPM if appropriate
			amPM = createElement("span", "flatpickr-am-pm", ["AM", "PM"][(hourElement.value > 11) | 0]);
			amPM.title = self.l10n.toggleTitle;
			amPM.tabIndex = 0;
			timeContainer.appendChild(amPM);
		}

		// picking time only
		if (self.config.noCalendar && !self.selectedDateObj) {
			self.selectedDateObj = new Date();
		}

		calendarContainer.appendChild(timeContainer);
	};

	bind = function () {
		document.addEventListener("keydown", onKeyDown);

		if (self.config.clickOpens) {
			(self.altInput || self.input).addEventListener("focus", self.open, false);
		}

		if (self.config.allowInput) {
			(self.altInput ? self.altInput : self.input).addEventListener("change", onManualInput);
		}


		if (self.config.wrap && self.element.querySelector("[data-open]")) {
			self.element.querySelector("[data-open]").addEventListener("click", self.open);
		}

		if (self.config.wrap && self.element.querySelector("[data-close]")) {
			self.element.querySelector("[data-close]").addEventListener("click", self.close);
		}

		if (self.config.wrap && self.element.querySelector("[data-toggle]")) {
			self.element.querySelector("[data-toggle]").addEventListener("click", self.toggle);
		}

		if (self.config.wrap && self.element.querySelector("[data-clear]")) {
			self.element.querySelector("[data-clear]").addEventListener("click", self.clear);
		}

		if (!self.config.noCalendar) {
			prevMonthNav.addEventListener("click", () => {
				changeMonth(-1);
			});

			nextMonthNav.addEventListener("click", () => {
				changeMonth(1);
			});

			currentYearElement.addEventListener("wheel", yearScroll);
			currentYearElement.addEventListener("focus", currentYearElement.select);

			currentYearElement.addEventListener("input", event => {
				self.currentYear = parseInt(event.target.value, 10);
				self.redraw();
			});

			calendar.addEventListener("click", calendarClick);

			calendar.addEventListener("keydown", e => {
				if (e.which === 13) {
					calendarClick(e);
				}
			});
		}

		document.body.addEventListener("click", documentClick, true);
		document.addEventListener("focus", documentClick);

		if (self.config.enableTime) {
			hourElement.addEventListener("wheel", timeWrapper);
			minuteElement.addEventListener("wheel", timeWrapper);

			hourElement.addEventListener("input", timeWrapper);
			minuteElement.addEventListener("input", timeWrapper);

			hourElement.addEventListener("mouseout", updateValue);
			minuteElement.addEventListener("mouseout", updateValue);

			hourElement.addEventListener("change", updateValue);
			minuteElement.addEventListener("change", updateValue);

			hourElement.addEventListener("focus", hourElement.select);
			minuteElement.addEventListener("focus", minuteElement.select);

			if (self.config.enableSeconds) {
				secondElement.addEventListener("wheel", timeWrapper);
				secondElement.addEventListener("input", timeWrapper);
				secondElement.addEventListener("mouseout", updateValue);
				secondElement.addEventListener("change", updateValue);
				secondElement.addEventListener("focus", secondElement.select);
			}

			if (!self.config.time_24hr) {
				amPM.addEventListener("click", amPMToggle);

				amPM.addEventListener("wheel", amPMToggle);
				amPM.addEventListener("mouseout", updateValue);

				amPM.addEventListener("keydown", e => {
					if (e.which === 38 || e.which === 40) {
						amPMToggle(e);
					}
				});
			}
		}

		if (document.createEvent) {
			clickEvt = document.createEvent("MouseEvent");
			// without all these args ms edge spergs out
			clickEvt.initMouseEvent(
				"click", true, true, window,
				0, 0, 0, 0, 0, false, false,
				false, false, 0, null
			);
		}

		else {
			clickEvt = new MouseEvent("click", {
				view: window,
				bubbles: true,
				cancelable: true
			});
		}

		window.addEventListener("resize", onResize);
	};

	self.open = function () {
		if ((self.altInput || self.input).disabled || self.config.inline) {
			return;
		}

		self.isOpen = true;

		wrapperElement.classList.add("open");
		(self.config.noCalendar ? timeContainer : calendar).focus();

		if (!self.config.allowInput) {
			(self.altInput || self.input).blur();
		}

		(self.altInput || self.input).classList.add("active");

		if (self.config.onOpen) {
			self.config.onOpen(self.selectedDateObj, self.input.value);
		}
	};

	// For calendars inserted in BODY (as opposed to inline wrapper)
	// it"s necessary to properly calculate top/left position.
	self.positionCalendar = function () {
		const bounds = (self.altInput || self.input).getBoundingClientRect(),
			// account for scroll & input height
			top = (window.pageYOffset + (self.altInput || self.input).offsetHeight + bounds.top),
			left = (window.pageXOffset + bounds.left);

		wrapperElement.style.top = `${top}px`;
		wrapperElement.style.left = `${left}px`;
	};

	self.toggle = function () {
		if (self.isOpen) {
			self.close();
		}
		else {
			self.open();
		}
	};

	self.close = function () {
		self.isOpen = false;
		wrapperElement.classList.remove("open");
		(self.altInput || self.input).classList.remove("active");

		if (self.config.onClose) {
			self.config.onClose(self.selectedDateObj, self.input.value);
		}
	};

	self.clear = function () {
		self.input.value = "";

		if (self.altInput) {
			self.altInput.value = "";
		}

		self.selectedDateObj = null;

		triggerChange();
		self.jumpToDate();
	};

	triggerChange = function () {
		self.input.dispatchEvent(clickEvt);

		if (self.config.onChange) {
			self.config.onChange(self.selectedDateObj, self.input.value);
		}
	};

	self.destroy = function () {
		document.removeEventListener("click", documentClick, false);

		if (self.altInput) {
			self.altInput.parentNode.removeChild(self.altInput);
		}

		if (self.config.inline) {
			const parent = self.element.parentNode,
				removedElement = parent.removeChild(self.element);

			parent.removeChild(calendarContainer);
			parent.parentNode.replaceChild(removedElement, parent);
		}

		else {
			document.getElementsByTagName("body")[0].removeChild(wrapperElement);
		}
	};

	self.redraw = function () {
		if (self.config.noCalendar) {
			return;
		}

		updateNavigationCurrentMonth();
		buildDays();
	};

	self.jumpToDate = function (jumpDate) {
		jumpDate = uDate(
			jumpDate || self.selectedDateObj || self.config.defaultDate ||
			self.config.minDate || now
		);

		self.currentYear = jumpDate.getFullYear();
		self.currentMonth = jumpDate.getMonth();
		self.redraw();
	};

	self.setDate = function (date, triggerChangeEvent) {
		date = uDate(date);

		if (date instanceof Date && date.getTime()) {
			self.selectedDateObj = uDate(date);
			self.jumpToDate(self.selectedDateObj);
			updateValue();

			if (triggerChangeEvent) {
				triggerChange();
			}
		}
	};

	self.setTime = function (hour, minute, triggerChangeEvent) {
		if (!self.selectedDateObj) {
			return;
		}

		hourElement.value = parseInt(hour, 10) % 24;
		minuteElement.value = parseInt(minute || 0, 10) % 60;

		if (!self.config.time_24hr) {
			amPM.innerHTML = hour > 11 ? "PM" : "AM";
		}

		updateValue();

		if (triggerChangeEvent) {
			triggerChange();
		}
	};

	self.set = function (key, value) {
		if (key in self.config) {
			self.config[key] = value;
			self.jumpToDate();
		}
	};

	amPMToggle = e => {
		e.preventDefault();
		amPM.innerHTML = ["AM", "PM"][(amPM.innerHTML === "AM") | 0];
	};

	function debounce(func, wait, immediate) {
		let timeout;
		return function (...args) {
			const context = this;

			const later = function () {
				timeout = null;
				if (!immediate) {
					func.apply(context, args);
				}
			};

			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (immediate && !timeout) {
				func.apply(context, args);
			}
		};
	}

	onKeyDown = function (e) {
		if (!self.isOpen || self.config.enableTime && timeContainer.contains(e.target)) {
			return;
		}

		if (e.which === 27) {
			self.close();
		}

		if (e.which === 37) {
			changeMonth(-1);
		}

		else if (e.which === 38) {
			e.preventDefault();
			self.currentYear++;
			self.redraw();
		}

		else if (e.which === 39) {
			changeMonth(1);
		}

		else if (e.which === 40) {
			e.preventDefault();
			self.currentYear--;
			self.redraw();
		}
	};

	onManualInput = () => self.setDate((self.altInput || self.input).value);

	onResize = debounce(() => {
		if (!self.input.disabled && !self.config.inline && !self.config.static) {
			self.positionCalendar();
		}
	}, 300);

	try {
		init();
	}

	catch (error) {
		// skip and carry on
		console.error(error);
		console.info(self.element);
	}

	return self;
};

flatpickr.init.prototype = {

	l10n: {
		weekdays: {
			shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			longhand: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		},
		months: {
			shorthand: [
				"Jan", "Feb", "Mar",
				"Apr", "May", "Jun",
				"Jul", "Aug", "Sep",
				"Oct", "Nov", "Dec"
			],
			longhand: [
				"January", "February", "March",
				"April", "May", "June",
				"July", "August", "September",
				"October", "November", "December"
			]
		},
		daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		firstDayOfWeek: 0,
		ordinal: (nth) => {
			const s = nth % 100;
			if (s > 3 && s < 21) return "th";
			switch (s % 10) {
				case 1: return "st";
				case 2: return "nd";
				case 3: return "rd";
				default: return "th";
			}
		},
		weekAbbreviation: "Wk",
		scrollTitle: "Scroll to increment",
		toggleTitle: "Click to toggle"
	},

	defaultConfig: {
		/* if true, dates will be parsed, formatted, and displayed in UTC.
		preloading date strings w/ timezones is recommended but not necessary */
		utc: false,

		// wrap: see https://chmln.github.io/flatpickr/#strap
		wrap: false,

		// enables week numbers
		weekNumbers: false,

		allowInput: false,

		/*
			clicking on input opens the date(time)picker.
			disable if you wish to open the calendar manually with .open()
		*/
		clickOpens: true,

		// display time picker in 24 hour mode
		time_24hr: false,

		// enables the time picker functionality
		enableTime: false,

		// noCalendar: true will hide the calendar. use for a time picker along w/ enableTime
		noCalendar: false,

		// more date format chars at https://chmln.github.io/flatpickr/#dateformat
		dateFormat: "Y-m-d",

		// altInput - see https://chmln.github.io/flatpickr/#altinput
		altInput: false,

		// the created altInput element will have this class.
		altInputClass: "",

		// same as dateFormat, but for altInput
		altFormat: "F j, Y", // defaults to e.g. June 10, 2016

		// defaultDate - either a datestring or a date object. used for datetimepicker"s initial value
		defaultDate: null,

		// the minimum date that user can pick (inclusive)
		minDate: null,

		// the maximum date that user can pick (inclusive)
		maxDate: null,

		// dateparser that transforms a given string to a date object
		parseDate: false,

		// see https://chmln.github.io/flatpickr/#disable
		enable: [],

		// see https://chmln.github.io/flatpickr/#disable
		disable: [],

		// display the short version of month names - e.g. Sep instead of September
		shorthandCurrentMonth: false,

		// displays calendar inline. see https://chmln.github.io/flatpickr/#inline-calendar
		inline: false,

		// position calendar inside wrapper and next to the input element
		// leave at false unless you know what you"re doing
		static: false,

		// code for previous/next icons. this is where you put your custom icon code e.g. fontawesome
		prevArrow: "&lt;",
		nextArrow: "&gt;",


		// enables seconds in the time picker
		enableSeconds: false,

		// step size used when scrolling/incrementing the hour element
		hourIncrement: 1,

		// step size used when scrolling/incrementing the minute element
		minuteIncrement: 5,

		// onChange callback when user selects a date or time
		onChange: null, // function (dateObj, dateStr) {}

		// called every time calendar is opened
		onOpen: null, // function (dateObj, dateStr) {}

		// called every time calendar is closed
		onClose: null // function (dateObj, dateStr) {}
	}
};

Date.prototype.fp_incr = function (days) {
	return new Date(
		this.getFullYear(),
		this.getMonth(),
		this.getDate() + parseInt(days, 10)
	);
};

Date.prototype.fp_isUTC = false;
Date.prototype.fp_toUTC = function () {
	const newDate = new Date(this.getTime() + this.getTimezoneOffset() * 60000);
	newDate.fp_isUTC = true;

	return newDate;
};

Date.prototype.fp_getWeek = function () {
	const date = new Date(this.getTime());
	date.setHours(0, 0, 0, 0);

	// Thursday in current week decides the year.
	date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
	// January 4 is always in week 1.
	const week1 = new Date(date.getFullYear(), 0, 4);
	// Adjust to Thursday in week 1 and count number of weeks from date to week1.
	return 1 +
		Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 +
		(week1.getDay() + 6) % 7) / 7);
};

// classList polyfill
if (!("classList" in document.documentElement) && Object.defineProperty &&
	typeof HTMLElement !== "undefined") {
	Object.defineProperty(HTMLElement.prototype, "classList", {
		get: () => {
			const self = this;
			function update(fn) {
				return function (value) {
					const classes = self.className.split(/\s+/);
					const index = classes.indexOf(value);

					fn(classes, index, value);
					self.className = classes.join(" ");
				};
			}

			const ret = {
				add: update((classes, index, value) => ~index || classes.push(value)),
				remove: update((classes, index) => ~index && classes.splice(index, 1)),
				toggle: update((classes, index, value) => {
					if (~index) {
						classes.splice(index, 1);
					}
					else {
						classes.push(value);
					}
				}),
				contains: value => !!~self.className.split(/\s+/).indexOf(value)
			};

			return ret;
		}
	});
}

if (typeof module !== "undefined") {
	module.exports = flatpickr;
}
