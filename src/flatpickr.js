class Flatpickr {
	constructor(element, config) {
		this.element = element;
		this.instanceConfig = config || {};

		this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
			.test(navigator.userAgent);

		this.setupFormats();
		this.setupLocale();

		this.parseConfig();
		this.setupInputs();
		this.setupDates();

		this.setupHelperFunctions();

		if (!this.isMobile) {
			this.build();
			this.bind();
		}

		else {
			this.bind();
			this.setupMobile();
		}

		if (this.selectedDateObj) {
			this.updateValue();
		}
		this.triggerEvent("Ready");
	}

	bind() {
		document.addEventListener("keydown", e => this.onKeyDown(e));
		window.addEventListener("resize", Flatpickr.debounce(() => this.onResize(), 300));

		document.addEventListener("click", e => this.documentClick(e));
		document.addEventListener("blur", e => this.documentClick(e), true);

		if (this.config.clickOpens) {
			(this.altInput || this.input).addEventListener("focus", e => this.open(e));
		}

		if (this.config.wrap) {
			["open", "close", "toggle", "clear"].forEach(el => {
				try {
					this.element.querySelector(`[data-${el}]`)
						.addEventListener("click", evt => this[el](evt));
				}
				catch (e) {
					//
				}
			});
		}

		if (this.isMobile) {
			return;
		}

		if (!this.config.noCalendar) {
			this.prevMonthNav.addEventListener("click", () => this.changeMonth(-1));
			this.nextMonthNav.addEventListener("click", () => this.changeMonth(1));

			this.currentYearElement.addEventListener("wheel", e => this.yearScroll(e));
			this.currentYearElement.addEventListener("click", () => this.currentYearElement.select());

			this.currentYearElement.addEventListener("input", event => {
				this.currentYear = parseInt(event.target.value, 10) || this.currentYear;
				this.redraw();
			});

			this.days.addEventListener("click", e => this.selectDate(e));
		}

		if (this.config.enableTime) {
			let updateTime = e => {
				Flatpickr.timeWrapper(e);
				this.updateValue(e);
			};
			this.timeContainer.addEventListener("wheel", updateTime);
			this.timeContainer.addEventListener("wheel", Flatpickr.debounce(e => this.triggerEvent("Change"), 1000));
			this.timeContainer.addEventListener("input", updateTime);
			this.timeContainer.addEventListener("click", e =>
				e.target === this.amPM ? updateTime(e) : e.target.select()
			);
		}
	}

	bringIntoView(jumpDate) {
		if (jumpDate) {
			jumpDate = this.parseDate(jumpDate);
		}
		else {
			jumpDate = this.selectedDateObj || this.config.defaultDate ||
			this.config.minDate || this.now;
		}

		this.currentYear = jumpDate.getFullYear();
		this.currentMonth = jumpDate.getMonth();
		this.redraw();
	}

	build() {
		const fragment = document.createDocumentFragment();
		this.calendarContainer = Flatpickr.createElement("div", "flatpickr-calendar");

		if (!this.config.noCalendar) {
			fragment.appendChild(this.buildMonthNav());
			fragment.appendChild(this.buildWeekdays());

			if (this.config.weekNumbers) {
				fragment.appendChild(this.buildWeeks());
			}

			fragment.appendChild(this.buildDays());
		}

		if (this.config.enableTime) {
			fragment.appendChild(this.buildTime());
		}


		this.calendarContainer.appendChild(fragment);

		if (this.config.inline) {
			this.calendarContainer.classList.add("inline");
			this.positionCalendar();
			this.element.parentNode.appendChild(this.calendarContainer);
		}
		else {
			document.body.appendChild(this.calendarContainer);
		}
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
				this.weekNumbers.insertAdjacentHTML(
					"beforeend",
					"<span class='disabled flatpickr-day'>" + currentDate.fp_getWeek() + "</span>"
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
				dateIsEnabled = this.isEnabled(curDate),
				dayElement = Flatpickr.createElement(
					"span",
					dateIsEnabled ? "nextMonthDay flatpickr-day" : "disabled",
					dayNum % daysInMonth
				);

			if (this.config.weekNumbers && dayNum % 7 === 1) {
				this.weekNumbers.insertAdjacentHTML(
					"beforeend",
					"<span class='disabled flatpickr-day'>" + curDate.fp_getWeek() + "</span>"
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

		this.hourElement.min = -(this.config.time_24hr ? 1 : 0);
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
		let	weekdays = this.l10n.weekdays.shorthand.slice();

		if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
			weekdays = [].concat(
				weekdays.splice(firstDayOfWeek, weekdays.length),
				weekdays.splice(0, firstDayOfWeek)
			);
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

	clear() {
		this.input.value = "";

		if (this.altInput) {
			this.altInput.value = "";
		}

		this.selectedDateObj = null;

		this.triggerEvent("Change");
		this.bringIntoView(this.now);
	}

	close() {
		this.isOpen = false;
		this.calendarContainer.classList.remove("open");
		(this.altInput || this.input).classList.remove("active");

		this.triggerEvent("Close");
	}

	documentClick(e) {
		const isCalendarElement = this.calendarContainer.contains(e.target),
			isInput = this.element.contains(e.target) || e.target === this.altInput;

		if (this.isOpen && !isCalendarElement && !isInput) {
			this.close();
		}
	}

	formatDate(frmt, dateObj) {
		let formattedDate = "";
		const formatPieces = frmt.split("");

		for (let i = 0; i < formatPieces.length; i++) {
			const c = formatPieces[i];
			if (this.formats[c] && formatPieces[i - 1] !== "\\") {
				formattedDate += this.formats[c](dateObj);
			}

			else if (c !== "\\") {
				formattedDate += c;
			}
		}

		return formattedDate;
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

		if (!this.config.enable.length && !this.config.disable.length) {
			return true;
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

			else if ((d instanceof Date || (typeof d === "string")) &&
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

	onKeyDown(e) {
		if (!this.isOpen) {
			return;
		}

		switch (e.which) {
			case 13:
				if (this.timeContainer && this.timeContainer.contains(e.target)) {
					this.updateValue(e);
				}
				else {
					this.selectDate(e);
				}
				break;

			case 27:
				this.close();
				break;

			case 37:
				this.changeMonth(-1);
				break;

			case 38:
				e.preventDefault();
				this.currentYear++;
				this.redraw();
				break;

			case 39:
				this.changeMonth(1);
				break;

			case 40:
				e.preventDefault();
				this.currentYear--;
				this.redraw();
				break;

			default: break;
		}
	}

	onResize() {
		if (this.isOpen && !this.config.inline && !this.config.static) {
			this.positionCalendar();
		}
	}

	open(e) {
		if (this.isMobile) {
			e.preventDefault();
			e.target.blur();

			setTimeout(() => {
				this.mobileInput.click();
			}, 0);

			this.triggerEvent("Open");
			return;
		}

		else if (this.isOpen || (this.altInput || this.input).disabled || this.config.inline) {
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

		this.triggerEvent("Open");
	}

	pad(number) {
		return `0${number}`.slice(-2);
	}

	parseConfig() {
		const userConfig = Object.assign({}, this.element.dataset,	this.instanceConfig);
		this.config = Object.assign({},	Flatpickr.defaultConfig, userConfig);
		if (!userConfig.dateFormat && this.config.enableTime) {
			if (this.config.noCalendar) { // time picker
				this.config.dateFormat = "H:i";
				this.config.altFormat = "h:i K";
			}
			else {
				this.config.dateFormat += " H:i" + (this.config.enableSeconds ? ":S" : "");
				this.config.altFormat = `h:i${this.config.enableSeconds ? ":S" : ""} K`;
			}
		}
	}

	parseDate(date, timeless = false) {
		if (typeof date === "string") {
			date = date.trim();

			if (date === "today") {
				date = new Date();
				timeless = true;
			}

			else if (this.config.parseDate) {
				date = this.config.parseDate(date);
			}

			else if (/^\d\d:\d\d/.test(date)) { // time picker
				const m = date.match(/^(\d{1,2})[:\s]?(\d\d)?[:\s]?(\d\d)?/);
				date = new Date();
				date.setHours(m[1], m[2] || 0, m[2] || 0);
			}

			else if (/Z$/.test(date) || /GMT$/.test(date)) { // datestrings w/ timezone
				date = new Date(date);
			}

			else if (/(\d+)/g.test(date)) {
				const d = date.match(/(\d+)/g);
				date = new Date(
					`${d[0]}/${d[1] || 1}/${d[2] || 1} ${d[3] || 0}:${d[4] || 0}:${d[5] || 0}`
				);
			}
		}

		if (!(date instanceof Date) || !date.getTime()) {
			console.warn(`flatpickr: invalid date ${date}`);
			console.info(this.element);
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
		if (this.config.noCalendar || this.isMobile) {
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
			this.triggerEvent("Change");

			if (!this.config.enableTime) {
				this.close();
			}
		}
	}

	set(config, value) {
		this.config[config] = value;
		this.bringIntoView();
	}

	setDate(date, triggerChange) {
		date = this.parseDate(date);
		if (date instanceof Date && date.getTime()) {
			this.selectedDateObj = date;
			this.bringIntoView(this.selectedDateObj);
			this.updateValue();

			if (triggerChange) {
				this.triggerEvent("Change");
			}
		}
		else {
			(this.altInput || this.input).value = "";
		}
	}

	setupDates() {
		this.now = new Date();
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

	setupLocale() {
		this.l10n = Object.assign({}, Flatpickr.l10n);
	}

	setupFormats() {
		this.formats = {
			// weekday name, short, e.g. Thu
			D: (date) => this.l10n.weekdays.shorthand[this.formats.w(date)],

			// full month name e.g. January
			F: (date) => this.utils.monthToStr(this.formats.n(date) - 1, false),

			// hours with leading zero e.g. 03
			H: (date) => Flatpickr.pad(date.getHours()),

			// day (1-30) with ordinal suffix e.g. 1st, 2nd
			J: (date) => this.formats.j(date) + this.l10n.ordinal(this.formats.j()),

			// AM/PM
			K: (date) => date.getHours() > 11 ? "PM" : "AM",

			// shorthand month e.g. Jan, Sep, Oct, etc
			M: (date) => this.utils.monthToStr(this.formats.n(date) - 1, true),

			// seconds 00-59
			S: (date) => Flatpickr.pad(date.getSeconds()),

			// unix timestamp
			U: (date) => date.getTime() / 1000,

			// full year e.g. 2016
			Y: (date) => date.getFullYear(),

			// day in month, padded (01-30)
			d: (date) => Flatpickr.pad(this.formats.j(date)),

			// hour from 1-12 (am/pm)
			h: (date) => date.getHours() % 12 ? date.getHours() % 12 : 12,

			// minutes, padded with leading zero e.g. 09
			i: (date) => Flatpickr.pad(date.getMinutes()),

			// day in month (1-30)
			j: (date) => date.getDate(),

			// weekday name, full, e.g. Thursday
			l: (date) => this.l10n.weekdays.longhand[this.formats.w(date)],

			// padded month number (01-12)
			m: (date) => Flatpickr.pad(this.formats.n(date)),

			// the month number (1-12)
			n: (date) => date.getMonth() + 1,

			// seconds 0-59
			s: (date) => date.getSeconds(),

			// number of the day of the week
			w: (date) => date.getDay(),

			// last two digits of year e.g. 16 for 2016
			y: (date) => String(this.formats.Y(date)).substring(2)
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
		this.input.classList.add("flatpickr-input");
		if (this.config.altInput) {
			// replicate this.element
			this.altInput = Flatpickr.createElement(this.input.nodeName, this.config.altInputClass);
			this.altInput.placeholder = this.input.placeholder;
			this.altInput.type = "text";

			this.input.type = "hidden";
			this.input.parentNode.insertBefore(this.altInput, this.input.nextSibling);
		}
	}

	setupMobile() {
		const inputType = this.config.enableTime
			? (this.config.noCalendar ? "time" : "datetime-local")
			: "date";

		this.mobileInput = Flatpickr.createElement("input", "flatpickr-mobileInput");
		this.mobileInput.type = inputType;

		this.mobileInput.tabIndex = -1;
		this.mobileInput.type = inputType;

		if (this.selectedDateObj) {
			const formatStr = inputType === "datetime-local" ? "Y-m-d\\TH:i:S" :
				inputType === "date" ? "Y-m-d" : "H:i:S";
			this.mobileInput.default = this.formatDate(formatStr, this.selectedDateObj);
		}

		if (this.config.minDate) {
			this.mobileInput.min = this.formatDate("Y-m-d", this.config.minDate);
		}

		if (this.config.maxDate) {
			this.mobileInput.max = this.formatDate("Y-m-d", this.config.maxDate);
		}

		this.input.parentNode.appendChild(this.mobileInput);

		this.mobileInput.addEventListener("change", e => {
			this.setDate(e.target.value);
			this.triggerEvent("Change");
			this.triggerEvent("Close");
		});
	}

	toggle() {
		this.isOpen ? this.close() : this.open();
	}

	triggerEvent(event) {
		if (this.config[`on${event}`]) {
			this.config[`on${event}`](this.selectedDateObj, this.input.value, this);
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

		if (e && e.target !== this.hourElement && e.target !== this.minuteElement) {
			e.target.blur();
		}

		if (this.config.enableTime && !this.isMobile) {
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
		}

		this.input.value = this.formatDate(this.config.dateFormat, this.selectedDateObj);

		if (this.altInput) {
			this.altInput.value = this.formatDate(this.config.altFormat, this.selectedDateObj);
		}

		this.triggerEvent("ValueUpdate");
	}

	yearScroll(e) {
		e.preventDefault();

		const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY)));
		this.currentYear = e.target.value = parseInt(e.target.value, 10) + delta;
		this.redraw();
	}

	static createElement(tag, className = "", content = "") {
		const e = document.createElement(tag);
		e.className = className;

		if (content) {
			e.textContent = content;
		}

		return e;
	}

	static debounce(func, wait, immediate) {
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

	static equalDates(date1, date2) {
		return date1.getDate() === date2.getDate() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getFullYear() === date2.getFullYear();
	}

	static pad(number) {
		return `0${number}`.slice(-2);
	}

	static timeWrapper(e) {
		e.preventDefault();

		if (e.target.className === "flatpickr-am-pm") {
			e.target.textContent = ["AM", "PM"][(e.target.textContent === "AM") | 0];
			e.target.blur();
			e.stopPropagation();
			return;
		}

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

		e.target.value = Flatpickr.pad(newValue);
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
	altInput: null,

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
	prevArrow: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z" /></svg>',
	nextArrow: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z" fill="#000000" /></svg>',


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

	// called after calendar is ready
	onReady: null, // function (dateObj, dateStr) {}

	onValueUpdate: null
};

Flatpickr.l10n = {
	weekdays: {
		shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		longhand: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	},
	months: {
		shorthand: [
			"Jan", "Feb", "Mar", "Apr",
			"May", "Jun", "Jul", "Aug",
			"Sep", "Oct", "Nov", "Dec"
		],
		longhand: [
			"January", "February", "March",	"April",
			"May", "June", "July", "August",
			"September", "October", "November", "December"
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

HTMLCollection.prototype.map = NodeList.prototype.map = Array.prototype.map;
HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function (config) {
	return this.map(element => (element._flatpickr = new Flatpickr(element, config||{})));
};

if (typeof jQuery !== "undefined") {
	jQuery.fn.extend({
		flatpickr: function (config) {
			return this.each(function () {
				this._flatpickr = new Flatpickr(this, config);
			});
		},
	});
}

HTMLElement.prototype.flatpickr = function (config = {}) {
	return (this._flatpickr = new Flatpickr(this, config));
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

if (typeof module !== "undefined") {
	module.exports = Flatpickr;
}
