class Flatpickr {
	constructor(element, config) {
		this.element = element;
		this.instanceConfig = config || {};

		this.setupFormats();
		this.setupLocale();

		this.parseConfig();
		this.setupInputs();
		this.setupDates();

		this.setupHelperFunctions();

		this.build();
		this.bind();
	}

	bind() {
		document.addEventListener("keydown", e => this.onKeyDown(e));
		window.addEventListener("resize", e => this.onResize(e));

		if (this.config.clickOpens) {
			(this.altInput || this.input).addEventListener("click", e => this.open(e));
			(this.altInput || this.input).addEventListener("focus", e => this.open(e));
		}

		if (this.config.wrap) {
			if (this.element.querySelector("[data-open]")) {
				this.element.querySelector("[data-open]").addEventListener("click", e => this.open(e));
			}

			if (this.element.querySelector("[data-close]")) {
				this.element.querySelector("[data-close]").addEventListener("click", e => this.close(e));
			}

			if (this.element.querySelector("[data-toggle]")) {
				this.element.querySelector("[data-toggle]").addEventListener("click", e => this.toggle(e));
			}

			if (this.element.querySelector("[data-clear]")) {
				this.element.querySelector("[data-clear]").addEventListener("click", e => this.clear(e));
			}
		}

		if (!this.config.noCalendar) {
			this.prevMonthNav.addEventListener("click", () => this.changeMonth(-1));
			this.nextMonthNav.addEventListener("click", () => this.changeMonth(1));

			this.currentYearElement.addEventListener("wheel", () => this.yearScroll);
			this.currentYearElement.addEventListener("focus", () => this.currentYearElement.select);

			this.currentYearElement.addEventListener("input", event => {
				this.currentYear = parseInt(event.target.value, 10);
				this.redraw();
			});

			this.days.addEventListener("click", e => this.selectDate(e));
		}

		document.addEventListener("click", e => this.documentClick(e));
		document.addEventListener("blur", e => this.documentClick(e), true);

		if (this.config.enableTime) {
			this.hourElement.addEventListener("wheel", this.timeWrapper);
			this.minuteElement.addEventListener("wheel", this.timeWrapper);

			this.hourElement.addEventListener("input", this.timeWrapper);
			this.minuteElement.addEventListener("input", this.timeWrapper);

			this.hourElement.addEventListener("mouseout", this.updateValue);
			this.minuteElement.addEventListener("mouseout", this.updateValue);

			this.hourElement.addEventListener("change", this.updateValue);
			this.minuteElement.addEventListener("change", this.updateValue);

			this.hourElement.addEventListener("focus", this.hourElement.select);
			this.minuteElement.addEventListener("focus", this.minuteElement.select);

			if (this.config.enableSeconds) {
				this.secondElement.addEventListener("wheel", this.timeWrapper);
				this.secondElement.addEventListener("input", this.timeWrapper);
				this.secondElement.addEventListener("mouseout", this.updateValue);
				this.secondElement.addEventListener("change", this.updateValue);
				this.secondElement.addEventListener("focus", this.secondElement.select);
			}

			if (!this.config.time_24hr) {
				this.amPM.addEventListener("click", this.amPMToggle);

				this.amPM.addEventListener("wheel", this.amPMToggle);
				this.amPM.addEventListener("mouseout", this.updateValue);

				this.amPM.addEventListener("keydown", e => {
					if (e.which === 38 || e.which === 40) {
						this.amPMToggle(e);
					}
				});
			}
		}
	}

	bringIntoView(jumpDate) {
		jumpDate = this.parseDate(
			jumpDate || this.selectedDateObj || this.config.defaultDate ||
			this.config.minDate || new Date()
		);

		this.currentYear = jumpDate.getFullYear();
		this.currentMonth = jumpDate.getMonth();
		this.redraw();
	}

	build() {
		const fragment = document.createDocumentFragment();
		this.calendarContainer = Flatpickr.createElement("div", "flatpickr-calendar");

		fragment.appendChild(this.buildMonthNav());
		fragment.appendChild(this.buildWeekdays());
		fragment.appendChild(this.buildDays());

		if (this.config.enableTime) {
			fragment.appendChild(this.buildTime());
		}

		if (this.config.weekNumbers) {
			fragment.appendChild(this.buildWeeks());
		}

		this.calendarContainer.appendChild(fragment);
		document.body.appendChild(this.calendarContainer);
	}

	buildDays() {
		if (!this.days) {
			this.days = Flatpickr.createElement("div", "flatpickr-days");
			this.days.tabIndex = -1;
		}

		const firstOfMonth = (
				new Date(this.currentYear, this.currentMonth, 1).getDay() -
				this.l10n.firstDayOfWeek + 7
			) % 7,
			daysInMonth = this.utils.getDaysinMonth(),
			prevMonthDays = this.utils.getDaysinMonth((this.currentMonth - 1 + 12) % 12),
			days = document.createDocumentFragment();

		let	dayNumber = prevMonthDays + 1 - firstOfMonth,
			currentDate,
			dateIsDisabled;

		if (this.config.weekNumbers) {
			this.weekNumbers.innerHTML = "";
		}

		this.days.innerHTML = "";

		// prepend days from the ending of previous month
		for (; dayNumber <= prevMonthDays; dayNumber++) {
			const curDate = new Date(this.currentYear, this.currentMonth - 1, dayNumber, 0, 0, 0, 0, 0),
				dateIsEnabled = this.isEnabled(curDate),
				dayElem = Flatpickr.createElement(
					"span",
					dateIsEnabled ? "flatpickr-day prevMonthDay" : "disabled",
					dayNumber
				);

			if (dateIsEnabled) {
				dayElem.tabIndex = 0;
			}

			days.appendChild(dayElem);
		}

		// Start at 1 since there is no 0th day
		for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
			currentDate = new Date(this.currentYear, this.currentMonth, dayNumber, 0, 0, 0, 0, 0);

			if (this.config.weekNumbers && dayNumber % 7 === 1) {
				this.weekNumbers.appendChild(
					Flatpickr.createElement("span", "disabled flatpickr-day", currentDate.fp_getWeek())
				);
			}

			dateIsDisabled = !this.isEnabled(currentDate);

			const dayElement = Flatpickr.createElement(
				"span",
				dateIsDisabled ? "disabled" : "flatpickr-day",
				dayNumber
			);

			if (!dateIsDisabled) {
				dayElement.tabIndex = 0;

				if (Flatpickr.equalDates(currentDate, new Date())) {
					dayElement.classList.add("today");
				}

				if (this.selectedDateObj && Flatpickr.equalDates(currentDate, this.selectedDateObj)) {
					dayElement.classList.add("selected");
				}
			}

			days.appendChild(dayElement);
		}

		// append days from the next month
		for (let dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth; dayNum++) {
			const curDate = new Date(
				this.currentYear,
				this.currentMonth + 1,
				dayNum % daysInMonth,
				0, 0, 0, 0, 0
			),
				dateIsEnabled = !this.isEnabled(curDate),
				dayElement = Flatpickr.createElement(
					"span",
					dateIsEnabled ? "nextMonthDay flatpickr-day" : "disabled",
					dayNum % daysInMonth
				);

			if (this.config.weekNumbers && dayNum % 7 === 1) {
				this.weekNumbers.appendChild(
					Flatpickr.createElement("span", "disabled", curDate.fp_getWeek())
				);
			}

			if (dateIsEnabled) {
				dayElement.tabIndex = 0;
			}

			days.appendChild(dayElement);
		}
		this.days.appendChild(days);

		return this.days;
	}

	buildMonthNav() {
		const monthNavFragment = document.createDocumentFragment();
		this.monthNav = Flatpickr.createElement("div", "flatpickr-month");

		this.prevMonthNav = Flatpickr.createElement("span", "flatpickr-prev-month");
		this.prevMonthNav.innerHTML = this.config.prevArrow;

		this.currentMonthElement = Flatpickr.createElement("span", "cur_month");

		this.currentYearElement = Flatpickr.createElement("input", "cur_year");
		this.currentYearElement.type = "number";
		this.currentYearElement.title = this.l10n.scrollTitle;

		this.nextMonthNav = Flatpickr.createElement("span", "flatpickr-next-month");
		this.nextMonthNav.innerHTML = this.config.nextArrow;

		this.navigationCurrentMonth = Flatpickr.createElement("span", "flatpickr-current-month");
		this.navigationCurrentMonth.appendChild(this.currentMonthElement);
		this.navigationCurrentMonth.appendChild(this.currentYearElement);

		monthNavFragment.appendChild(this.prevMonthNav);
		monthNavFragment.appendChild(this.navigationCurrentMonth);
		monthNavFragment.appendChild(this.nextMonthNav);
		this.monthNav.appendChild(monthNavFragment);

		this.updateNavigationCurrentMonth();

		return this.monthNav;
	}

	buildTime() {
		this.timeContainer = Flatpickr.createElement("div", "flatpickr-time");
		this.timeContainer.tabIndex = -1;
		const separator = Flatpickr.createElement("span", "flatpickr-time-separator", ":");

		this.hourElement = Flatpickr.createElement("input", "flatpickr-hour");
		this.minuteElement = Flatpickr.createElement("input", "flatpickr-minute");

		this.hourElement.tabIndex = this.minuteElement.tabIndex = 0;
		this.hourElement.type = this.minuteElement.type = "number";

		this.hourElement.value =
			this.selectedDateObj ? Flatpickr.pad(this.selectedDateObj.getHours()) : 12;

		this.minuteElement.value =
			this.selectedDateObj ? Flatpickr.pad(this.selectedDateObj.getMinutes()) : "00";

		this.hourElement.step = this.config.hourIncrement;
		this.minuteElement.step = this.config.minuteIncrement;

		this.hourElement.min = -this.config.time_24hr;
		this.hourElement.max = this.config.time_24hr ? 24 : 13;

		this.minuteElement.min = -this.minuteElement.step;
		this.minuteElement.max = 60;

		this.hourElement.title = this.minuteElement.title = this.l10n.scrollTitle;

		this.timeContainer.appendChild(this.hourElement);
		this.timeContainer.appendChild(separator);
		this.timeContainer.appendChild(this.minuteElement);

		if (this.config.enableSeconds) {
			this.timeContainer.classList.add("has-seconds");

			this.secondElement = Flatpickr.createElement("input", "flatpickr-second");
			this.secondElement.type = "number";
			this.secondElement.value =
				this.selectedDateObj ? Flatpickr.pad(this.selectedDateObj.getSeconds()) : "00";

			this.secondElement.step = this.minuteElement.step;
			this.secondElement.min = this.minuteElement.min;
			this.secondElement.max = this.minuteElement.max;

			this.timeContainer.appendChild(
				Flatpickr.createElement("span", "flatpickr-time-separator", ":")
			);
			this.timeContainer.appendChild(this.secondElement);
		}

		if (!this.config.time_24hr) { // add this.amPM if appropriate
			this.amPM = Flatpickr.createElement(
				"span",
				"flatpickr-am-pm",
				["AM", "PM"][(this.hourElement.value > 11) | 0]
			);
			this.amPM.title = this.l10n.toggleTitle;
			this.amPM.tabIndex = 0;
			this.timeContainer.appendChild(this.amPM);
		}

		return this.timeContainer;
	}

	buildWeekdays() {
		this.weekdayContainer = Flatpickr.createElement("div", "flatpickr-weekdays");
		const firstDayOfWeek = this.l10n.firstDayOfWeek;
		let	weekdays;

		if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
			weekdays = [].concat(
				weekdays.splice(firstDayOfWeek, weekdays.length),
				weekdays.splice(0, firstDayOfWeek)
			);
		}

		else {
			weekdays = this.l10n.weekdays.shorthand.slice();
		}

		if (this.config.weekNumbers) {
			this.weekdayContainer.innerHTML = `<span>${this.l10n.weekAbbreviation}</span>`;
		}

		this.weekdayContainer.innerHTML += `<span>${weekdays.join("</span><span>")}</span>`;

		return this.weekdayContainer;
	}

	buildWeeks() {
		this.calendarContainer.classList.add("hasWeeks");
		this.weekNumbers = Flatpickr.createElement("div", "flatpickr-weeks");
		return this.weekNumbers;
	}

	changeMonth(offset) {
		this.currentMonth += offset;

		this.handleYearChange();
		this.updateNavigationCurrentMonth();
		this.buildDays();
		(this.config.noCalendar ? this.timeContainer : this.days).focus();
	}

	close() {
		this.isOpen = false;
		this.calendarContainer.classList.remove("open");
		(this.altInput || this.input).classList.remove("active");

		if (this.config.onClose) {
			this.config.onClose(this.selectedDateObj, this.input.value);
		}
	}

	documentClick(e) {
		const isCalendarElement = this.calendarContainer.contains(e.target),
			isInput = this.element.contains(e.target) || e.target === this.altInput;

		if (this.isOpen && !isCalendarElement && !isInput) {
			this.close();
		}
	}

	formatDate(frmt) {
		return frmt.split("")
			.map(c => this.formats[c] ? this.formats[c]() : c !== "\\" ? c : "")
			.join("");
	}

	handleYearChange() {
		if (this.currentMonth < 0 || this.currentMonth > 11) {
			this.currentYear += this.currentMonth % 11;
			this.currentMonth = (this.currentMonth + 12) % 12;
		}
	}

	isEnabled(dateToCheck) {
		if (
			(this.config.minDate && dateToCheck < this.config.minDate) ||
			(this.config.maxDate && dateToCheck > this.config.maxDate)
		) {
			return false;
		}

		dateToCheck = this.parseDate(dateToCheck, true); // timeless

		const bool = this.config.enable.length > 0,
			array = bool ? this.config.enable : this.config.disable;

		let d;

		for (let i = 0; i < array.length; i++) {
			d = array[i];

			if (d instanceof Function && d(dateToCheck)) { // disabled by function
				return bool;
			}

			else if ( // disabled weekday
				typeof d === "string" &&
				/^wkd/.test(d) &&
				dateToCheck.getDay() === (parseInt(d.slice(-1), 10) + this.l10n.firstDayOfWeek - 1) % 7
			) {
				return bool;
			}

			else if ((d instanceof Date || (typeof d === "string" && !/^wkd/.test(d))) &&
				this.parseDate(d, true).getTime() === dateToCheck.getTime()
			) {
				// disabled by date string
				return bool;
			}

			else if ( // disabled by range
				typeof d === "object" &&
				d.hasOwnProperty("from") &&
				dateToCheck >= this.parseDate(d.from) &&
				dateToCheck <= this.parseDate(d.to)
			) {
				return bool;
			}
		}

		return !bool;
	}

	open() {
		if (this.isOpen || (this.altInput || this.input).disabled || this.config.inline) {
			return;
		}

		else if (!this.config.static) {
			this.positionCalendar();
		}

		this.isOpen = true;

		this.calendarContainer.classList.add("open");

		if (!this.config.allowInput) {
			(this.altInput || this.input).blur();
			(this.config.noCalendar ? this.timeContainer : this.days).focus();
		}

		(this.altInput || this.input).classList.add("active");

		if (this.config.onOpen) {
			this.config.onOpen(this.selectedDateObj, this.input.value);
		}
	}

	pad(number) {
		return `0${number}`.slice(-2);
	}

	parseConfig() {
		this.config = Object.assign(
			{},
			Flatpickr.defaultConfig,
			this.element.dataset,
			this.instanceConfig
		);
	}

	parseDate(date, timeless = false) {
		if (date === "today") {
			date = new Date();
			timeless = true;
		}

		else if (typeof date === "string") {
			date = date.trim();

			if (this.config.parseDate) {
				date = this.config.parseDate(date);
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
				console.info(this.element);
			}
		}

		if (!(date instanceof Date) || !date.getTime()) {
			return null;
		}

		if (this.config.utc && !date.fp_isUTC) {
			date = date.fp_toUTC();
		}

		if (timeless) {
			date.setHours(0, 0, 0, 0);
		}

		return date;
	}

	setupDates() {
		if (this.config.defaultDate || this.input.value) {
			this.selectedDateObj = this.parseDate(this.config.defaultDate || this.input.value);
		}

		if (this.config.minDate) {
			this.config.minDate = this.parseDate(this.config.minDate, true);
		}
		if (this.config.maxDate) {
			this.config.maxDate = this.parseDate(this.config.maxDate, true);
		}

		const initialDate = (this.selectedDateObj || this.config.defaultDate ||
			this.config.minDate || new Date()
		);

		this.currentYear = initialDate.getFullYear();
		this.currentMonth = initialDate.getMonth();
	}

	positionCalendar() {
		const calendarHeight = this.calendarContainer.offsetHeight,
			input = (this.altInput || this.input),
			inputBounds = input.getBoundingClientRect(),
			distanceFromBottom = window.innerHeight - inputBounds.bottom + input.offsetHeight;

		let top,
			left = (window.pageXOffset + inputBounds.left);

		if (distanceFromBottom < calendarHeight) {
			top = (window.pageYOffset - calendarHeight + inputBounds.top) - 2;
			this.calendarContainer.classList.remove("arrowTop");
			this.calendarContainer.classList.add("arrowBottom");
		}

		else {
			top = (window.pageYOffset + input.offsetHeight + inputBounds.top) + 2;
			this.calendarContainer.classList.remove("arrowBottom");
			this.calendarContainer.classList.add("arrowTop");
		}

		this.calendarContainer.style.top = `${top}px`;
		this.calendarContainer.style.left = `${left}px`;
	}

	redraw() {
		if (this.config.noCalendar) {
			return;
		}

		this.updateNavigationCurrentMonth();
		this.buildDays();
	}

	selectDate(e) {
		e.preventDefault();
		e.stopPropagation();

		if (this.config.allowInput && e.target === (this.altInput || this.input) && e.which === 13) {
			this.setDate((this.altInput || this.input).value);
			this.redraw();
		}

		else if (e.target.classList.contains("flatpickr-day")) {
			const isPrevMonthDay = e.target.classList.contains("prevMonthDay"),
				isNextMonthDay = e.target.classList.contains("nextMonthDay"),
				monthNum = this.currentMonth - isPrevMonthDay + isNextMonthDay;

			if (isPrevMonthDay || isNextMonthDay) {
				this.changeMonth(+isNextMonthDay - isPrevMonthDay);
			}

			this.selectedDateObj = new Date(this.currentYear, monthNum, e.target.innerHTML);

			this.updateValue(e);
			this.buildDays();
		}
	}

	setupLocale() {
		this.l10n = Object.assign({}, Flatpickr.l10n);
	}

	setupFormats() {
		this.formats = {
			// weekday name, short, e.g. Thu
			D: () => this.l10n.weekdays.shorthand[this.formats.w()],

			// full month name e.g. January
			F: () => this.utils.monthToStr(this.formats.n() - 1, false),

			// hours with leading zero e.g. 03
			H: () => Flatpickr.pad(this.selectedDateObj.getHours()),

			// day (1-30) with ordinal suffix e.g. 1st, 2nd
			J: () => this.formats.j() + this.l10n.ordinal(this.formats.j()),

			// AM/PM
			K: () => this.selectedDateObj.getHours() > 11 ? "PM" : "AM",

			// shorthand month e.g. Jan, Sep, Oct, etc
			M: () => this.utils.monthToStr(this.formats.n() - 1, true),

			// seconds 00-59
			S: () => Flatpickr.pad(this.selectedDateObj.getSeconds()),

			// unix timestamp
			U: () => this.selectedDateObj.getTime() / 1000,

			// full year e.g. 2016
			Y: () => this.selectedDateObj.getFullYear(),

			// day in month, padded (01-30)
			d: () => Flatpickr.pad(this.formats.j()),

			// hour from 1-12 (am/pm)
			h: () => this.selectedDateObj.getHours() % 12 ? this.selectedDateObj.getHours() % 12 : 12,

			// minutes, padded with leading zero e.g. 09
			i: () => Flatpickr.pad(this.selectedDateObj.getMinutes()),

			// day in month (1-30)
			j: () => this.selectedDateObj.getDate(),

			// weekday name, full, e.g. Thursday
			l: () => this.l10n.weekdays.longhand[this.formats.w()],

			// padded month number (01-12)
			m: () => Flatpickr.pad(this.formats.n()),

			// the month number (1-12)
			n: () => this.selectedDateObj.getMonth() + 1,

			// seconds 0-59
			s: () => this.selectedDateObj.getSeconds(),

			// number of the day of the week
			w: () => this.selectedDateObj.getDay(),

			// last two digits of year e.g. 16 for 2016
			y: () => String(this.formats.Y()).substring(2)
		};
	}

	setupHelperFunctions() {
		this.utils = {
			getDaysinMonth: (month = this.currentMonth, yr = this.currentYear) => {
				if (month === 1 && ((yr % 4 === 0) && (yr % 100 !== 0)) || (yr % 400 === 0)) {
					return 29;
				}
				return this.l10n.daysInMonth[month];
			},

			monthToStr: (monthNumber, short = this.config.shorthandCurrentMonth) =>
				this.l10n.months[(`${short ? "short" : "long"}hand`)][monthNumber],
		};
	}

	setupInputs() {
		this.input = this.config.wrap ? this.element.querySelector("[data-input]") : this.element;
		if (this.config.altInput) {
			// replicate this.element
			this.altInput = this.input.cloneNode(false);
			this.input.type = "hidden";
			this.input.parentNode.insertBefore(this.altInput, this.input.nextSibling);
		}
	}

	toggle() {
		this.isOpen ? this.close() : this.open();
	}

	triggerChange() {
		if (this.config.onChange) {
			this.config.onChange(this.selectedDateObj, this.input.value);
		}
	}

	updateNavigationCurrentMonth() {
		this.currentMonthElement.textContent = this.utils.monthToStr(this.currentMonth) + " ";
		this.currentYearElement.value = this.currentYear;
	}

	updateValue(e) {
		if (this.config.noCalendar && !this.selectedDateObj) {
			// picking time only and method triggered from picker
			this.selectedDateObj = new Date();
		}

		else if (!this.selectedDateObj) {
			return;
		}

		if (e) {
			e.target.blur();
		}

		let timeHasChanged;

		if (this.config.enableTime) {
			const previousTimestamp = this.selectedDateObj.getTime();

			// update time
			let hours = (parseInt(this.hourElement.value, 10) || 0),
				seconds;

			const minutes = (60 + (parseInt(this.minuteElement.value, 10) || 0)) % 60;

			if (this.config.enableSeconds) {
				seconds = (60 + (parseInt(this.secondElement.value, 10)) || 0) % 60;
			}

			if (!this.config.time_24hr) {
				// the real number of hours for the date object
				hours = hours % 12 + 12 * (this.amPM.innerHTML === "PM");
			}

			this.selectedDateObj.setHours(
				hours,
				minutes,
				seconds === undefined ? this.selectedDateObj.getSeconds() : seconds
			);

			this.hourElement.value = Flatpickr.pad(
				!this.config.time_24hr ? (12 + hours) % 12 + 12 * (hours % 12 === 0) : hours
			);
			this.minuteElement.value = Flatpickr.pad(minutes);

			if (seconds !== undefined) {
				this.secondElement.value = Flatpickr.pad(seconds);
			}

			timeHasChanged = this.selectedDateObj.getTime() !== previousTimestamp;
		}

		this.input.value = this.formatDate(this.config.dateFormat);

		if (this.altInput) {
			this.altInput.value = this.formatDate(this.config.altFormat);
		}

		if (e && (timeHasChanged || e.target.classList.contains("flatpickr-day"))) {
			this.triggerChange();
		}

		if (this.config.onValueUpdate) {
			this.config.onValueUpdate(this.selectedDateObj, this.input.value);
		}
	}

	static createElement(tag, className = "", content = "") {
		const e = document.createElement(tag);
		e.className = className;
		e.textContent = content;
		return e;
	}

	static equalDates(date1, date2) {
		return date1.getDate() === date2.getDate() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getFullYear() === date2.getFullYear();
	}

	static pad(number) {
		return `0${number}`.slice(-2);
	}
}

Flatpickr.defaultConfig = {
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
	parseDate: null,

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
	onClose: null, // function (dateObj, dateStr) {}

	onValueUpdate: null
};

Flatpickr.l10n = {
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
};

HTMLCollection.prototype.map = Array.prototype.map;
HTMLCollection.prototype.flatpickr = function (config) {
	return this.map(element => new Flatpickr(element, config));
};

HTMLElement.prototype.flatpickr = function (config) {
	return new Flatpickr(this, config);
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
