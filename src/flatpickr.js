/*! flatpickr v2.4.6, @license MIT */
function Flatpickr(element, config) {
	const self = this;

	self.changeMonth = changeMonth;
	self.changeYear = changeYear;
	self.clear = clear;
	self.close = close;
	self._createElement = createElement;
	self.destroy = destroy;
	self.formatDate = formatDate;
	self.isEnabled = isEnabled;
	self.jumpToDate = jumpToDate;
	self.open = open;
	self.redraw = redraw;
	self.set = set;
	self.setDate = setDate;
	self.toggle = toggle;

	function init() {
		if (element._flatpickr)
			destroy(element._flatpickr);

		element._flatpickr = self;

		self.element = element;
		self.instanceConfig = config || {};
		self.parseDate = Flatpickr.prototype.parseDate.bind(self);

		setupFormats();
		parseConfig();
		setupLocale();
		setupInputs();
		setupDates();
		setupHelperFunctions();

		self.isOpen = self.config.inline;

		self.isMobile = (
			!self.config.disableMobile &&
			!self.config.inline &&
			self.config.mode === "single" &&
			!self.config.disable.length &&
			!self.config.enable.length &&
			!self.config.weekNumbers &&
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		);

		if (!self.isMobile)
			build();

		bind();

		if (self.selectedDates.length || self.config.noCalendar) {
			if (self.config.enableTime)
				setHoursFromDate(self.config.noCalendar ? self.config.minDate : null);
			updateValue();
		}

		if (self.config.weekNumbers) {
			self.calendarContainer.style.width = self.days.clientWidth
				+ self.weekWrapper.clientWidth + "px";
		}

		self.showTimeInput = self.selectedDates.length > 0 || self.config.noCalendar;

		if (!self.isMobile)
			positionCalendar();
		triggerEvent("Ready");
	}

	function bindToInstance(fn) {
		if (fn && fn.bind)
			return fn.bind(self);
		return fn;
	}

	function updateTime(e) {
		if (self.config.noCalendar && !self.selectedDates.length)
			// picking time only
			self.selectedDates = [self.now];

		timeWrapper(e);

		if (!self.selectedDates.length)
			return;

		if (!self.minDateHasTime || e.type !== "input" || e.target.value.length >= 2) {
			setHoursFromInputs();
			updateValue();
		}

		else {
			setTimeout(function(){
				setHoursFromInputs();
				updateValue();
			}, 1000);
		}
	}

	function setHoursFromInputs(){
		if (!self.config.enableTime)
			return;

		let hours = (parseInt(self.hourElement.value, 10) || 0),
			minutes = (parseInt(self.minuteElement.value, 10) || 0),
			seconds = self.config.enableSeconds
				? (parseInt(self.secondElement.value, 10) || 0)
				: 0;

		if (self.amPM)
			hours = (hours % 12) + (12 * (self.amPM.textContent === "PM"));

		if (
			self.minDateHasTime
			&& compareDates(self.latestSelectedDateObj, self.config.minDate) === 0
		) {

			hours = Math.max(hours, self.config.minDate.getHours());
			if (hours === self.config.minDate.getHours())
				minutes = Math.max(minutes, self.config.minDate.getMinutes());
		}

		if (
			self.maxDateHasTime
			&& compareDates(self.latestSelectedDateObj, self.config.maxDate) === 0
		) {
			hours = Math.min(hours, self.config.maxDate.getHours());
			if (hours === self.config.maxDate.getHours())
				minutes = Math.min(minutes, self.config.maxDate.getMinutes());
		}

		setHours(hours, minutes, seconds);
	}

	function setHoursFromDate(dateObj){
		const date = dateObj || self.latestSelectedDateObj;

		if (date)
			setHours(date.getHours(), date.getMinutes(), date.getSeconds());
	}

	function setHours(hours, minutes, seconds) {
		if (self.selectedDates.length) {
			self.latestSelectedDateObj.setHours(
				hours % 24, minutes, seconds || 0, 0
			);
		}

		if (!self.config.enableTime || self.isMobile)
			return;

		self.hourElement.value = self.pad(
			!self.config.time_24hr ? (12 + hours) % 12 + 12 * (hours % 12 === 0) : hours
		);

		self.minuteElement.value = self.pad(minutes);

		if (!self.config.time_24hr)
			self.amPM.textContent = hours >= 12 ? "PM" : "AM";

		if (self.config.enableSeconds)
			self.secondElement.value = self.pad(seconds);
	}

	function onYearInput(event) {
		let year = event.target.value;
		if (event.delta)
			year = (parseInt(year) + event.delta).toString();

		if (year.length === 4) {
			self.currentYearElement.blur();
			if (!/[^\d]/.test(year))
				changeYear(year);
		}
	}

	function onMonthScroll(e) {
		e.preventDefault();
		self.changeMonth(Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY))));
	}

	function bind() {
		if (self.config.wrap) {
			["open", "close", "toggle", "clear"].forEach(el => {
				const toggles = self.element.querySelectorAll(`[data-${el}]`);
				for (let i = 0; i < toggles.length; i++)
					toggles[i].addEventListener("click", self[el]);
			});
		}

		if (window.document.createEvent !== undefined) {
			self.changeEvent = window.document.createEvent("HTMLEvents");
			self.changeEvent.initEvent("change", false, true);
		}

		if (self.isMobile)
			return setupMobile();

		self.debouncedResize = debounce(onResize, 50);
		self.triggerChange = () => {
			triggerEvent("Change");
		};
		self.debouncedChange = debounce(self.triggerChange, 300);

		if (self.config.mode === "range" && self.days)
			self.days.addEventListener("mouseover", onMouseOver);

		self.calendarContainer.addEventListener("keydown", onKeyDown);

		if (!self.config.static)
			(self.altInput || self.input).addEventListener("keydown", onKeyDown);

		if (!self.config.inline && !self.config.static)
			window.addEventListener("resize", self.debouncedResize);

		if (window.ontouchstart)
			window.document.addEventListener("touchstart", documentClick);

		window.document.addEventListener("click", documentClick);
		(self.altInput || self.input).addEventListener("blur", documentClick);

		if (self.config.clickOpens)
			(self.altInput || self.input).addEventListener("focus", open);

		if (!self.config.noCalendar) {
			self.prevMonthNav.addEventListener("click", () => changeMonth(-1));
			self.nextMonthNav.addEventListener("click", () => changeMonth(1));

			self.currentMonthElement.addEventListener("wheel", e => debounce(onMonthScroll(e), 50));
			self.currentYearElement.addEventListener("wheel", e => debounce(yearScroll(e), 50));
			self.currentYearElement.addEventListener("focus", () => {
				self.currentYearElement.select();
			});

			self.currentYearElement.addEventListener("input", onYearInput);
			self.currentYearElement.addEventListener("increment", onYearInput);

			self.days.addEventListener("click", selectDate);
		}

		if (self.config.enableTime) {
			self.timeContainer.addEventListener("transitionend", positionCalendar);
			self.timeContainer.addEventListener("wheel", e => debounce(updateTime(e), 5));
			self.timeContainer.addEventListener("input", updateTime);
			self.timeContainer.addEventListener("increment", updateTime);
			self.timeContainer.addEventListener("increment", self.debouncedChange);

			self.timeContainer.addEventListener("wheel", self.debouncedChange);
			self.timeContainer.addEventListener("input", self.triggerChange);

			self.hourElement.addEventListener("focus", () => {
				self.hourElement.select();
			});
			self.minuteElement.addEventListener("focus", () => {
				self.minuteElement.select();
			});

			if (self.secondElement) {
				self.secondElement.addEventListener("focus", () => {
					self.secondElement.select();
				});
			}

			if (self.amPM) {
				self.amPM.addEventListener("click", (e) => {
					updateTime(e);
					self.triggerChange(e);
				});
			}
		}
	}

	function jumpToDate(jumpDate) {
		jumpDate = jumpDate
			? self.parseDate(jumpDate)
			: self.latestSelectedDateObj || (self.config.minDate > self.now
				? self.config.minDate
				: self.config.maxDate && self.config.maxDate < self.now
					? self.config.maxDate
					: self.now
			);

		try {
			self.currentYear = jumpDate.getFullYear();
			self.currentMonth = jumpDate.getMonth();
		}

		catch (e) {
			/* istanbul ignore next */
			console.error(e.stack);
			/* istanbul ignore next */
			console.warn("Invalid date supplied: " + jumpDate);
		}

		self.redraw();
	}

	function incrementNumInput(e, delta, inputElem) {
		const input = inputElem || e.target.parentNode.childNodes[0];
		let ev;

		try {
			ev = new Event("increment", { "bubbles": true });
		}

		catch (err) {
			ev = window.document.createEvent("CustomEvent");
			ev.initCustomEvent("increment", true, true, {});
		}

		ev.delta = delta;
		input.dispatchEvent(ev);
	}

	function createNumberInput(inputClassName) {
		const wrapper = createElement("div", "numInputWrapper"),
			numInput = createElement("input", "numInput " + inputClassName),
			arrowUp = createElement("span", "arrowUp"),
			arrowDown = createElement("span", "arrowDown");

		numInput.type = "text";
		numInput.pattern = "\\d*";
		wrapper.appendChild(numInput);
		wrapper.appendChild(arrowUp);
		wrapper.appendChild(arrowDown);

		arrowUp.addEventListener("click", e => incrementNumInput(e, 1));
		arrowDown.addEventListener("click", e => incrementNumInput(e, -1));
		return wrapper;
	}

	function build() {
		const fragment = window.document.createDocumentFragment();
		self.calendarContainer = createElement("div", "flatpickr-calendar");
		self.numInputType = navigator.userAgent.indexOf("MSIE 9.0") > 0 ? "text" : "number";

		if (!self.config.noCalendar) {
			fragment.appendChild(buildMonthNav());
			self.innerContainer = createElement("div", "flatpickr-innerContainer")

			if (self.config.weekNumbers)
				self.innerContainer.appendChild(buildWeeks());

			self.rContainer = createElement("div", "flatpickr-rContainer");
			self.rContainer.appendChild(buildWeekdays());

			if (!self.days) {
				self.days = createElement("div", "flatpickr-days");
				self.days.tabIndex = -1;
			}

			buildDays();
			self.rContainer.appendChild(self.days);

			self.innerContainer.appendChild(self.rContainer);
			fragment.appendChild(self.innerContainer);
		}

		if (self.config.enableTime)
			fragment.appendChild(buildTime());

		if (self.config.mode === "range")
			self.calendarContainer.classList.add("rangeMode");

		self.calendarContainer.appendChild(fragment);

		const customAppend = self.config.appendTo && self.config.appendTo.nodeType;

		if (self.config.inline || self.config.static) {
			self.calendarContainer.classList.add(self.config.inline ? "inline" : "static");


			if (self.config.inline && !customAppend) {
				return self.element.parentNode.insertBefore(
					self.calendarContainer,
					(self.altInput || self.input).nextSibling
				);
			}

			if (self.config.static){
				const wrapper = createElement("div", "flatpickr-wrapper");
				self.element.parentNode.insertBefore(wrapper, self.element);
				wrapper.appendChild(self.element);

				if(self.altInput)
					wrapper.appendChild(self.altInput);

				wrapper.appendChild(self.calendarContainer);
				return;
			}
		}

		(customAppend ? self.config.appendTo : window.document.body)
			.appendChild(self.calendarContainer);
	}

	function createDay(className, date, dayNumber) {
		const dateIsEnabled = isEnabled(date, true),
			dayElement = createElement(
				"span",
				"flatpickr-day " + className,
				date.getDate()
			);

		dayElement.dateObj = date;

		toggleClass(dayElement, "today", compareDates(date, self.now) === 0);

		if (dateIsEnabled) {

			if (isDateSelected(date)){
				dayElement.classList.add("selected");
				self.selectedDateElem = dayElement;
				if (self.config.mode === "range") {
					toggleClass(
						dayElement,
						"startRange",
						compareDates(date, self.selectedDates[0]) === 0
					);

					toggleClass(
						dayElement,
						"endRange",
						compareDates(date, self.selectedDates[1]) === 0
					);
				}
			}
		}

		else {
			dayElement.classList.add("disabled");
			if (
				self.selectedDates[0]
				&& date > self.minRangeDate
				&& date < self.selectedDates[0]
			)

				self.minRangeDate = date;

			else if (
				self.selectedDates[0]
				&& date < self.maxRangeDate
				&& date > self.selectedDates[0]
			)
				self.maxRangeDate = date;
		}

		if (self.config.mode === "range") {
			if (isDateInRange(date) && !isDateSelected(date))
				dayElement.classList.add("inRange");

			if (
				self.selectedDates.length === 1 &&
				(date < self.minRangeDate || date > self.maxRangeDate)
			)
				dayElement.classList.add("notAllowed");
		}

		if (self.config.weekNumbers && className !== "prevMonthDay" && dayNumber % 7 === 1) {
			self.weekNumbers.insertAdjacentHTML(
				"beforeend",
				"<span class='disabled flatpickr-day'>" + self.config.getWeek(date) + "</span>"
			);
		}

		triggerEvent("DayCreate", dayElement);

		return dayElement;
	}

	function buildDays(year, month) {
		const firstOfMonth = (
				new Date(self.currentYear, self.currentMonth, 1).getDay() -
				self.l10n.firstDayOfWeek + 7
			) % 7,
			isRangeMode = self.config.mode === "range";

		self.prevMonthDays = self.utils.getDaysinMonth((self.currentMonth - 1 + 12) % 12);

		const daysInMonth = self.utils.getDaysinMonth(),
			days = window.document.createDocumentFragment();

		let	dayNumber = self.prevMonthDays + 1 - firstOfMonth;

		if (self.config.weekNumbers && self.weekNumbers.firstChild)
			self.weekNumbers.textContent = "";

		if (isRangeMode) {
			// const dateLimits = self.config.enable.length || self.config.disable.length || self.config.mixDate || self.config.maxDate;
			self.minRangeDate = new Date(self.currentYear, self.currentMonth - 1, dayNumber);
			self.maxRangeDate = new Date(
				self.currentYear,
				self.currentMonth + 1,
				(42 - firstOfMonth) % daysInMonth
			);
		}

		if (self.days.firstChild)
			self.days.textContent = "";

		// prepend days from the ending of previous month
		for (; dayNumber <= self.prevMonthDays; dayNumber++) {
			days.appendChild(
				createDay("prevMonthDay", new Date(self.currentYear, self.currentMonth - 1, dayNumber), dayNumber)
			);
		}

		// Start at 1 since there is no 0th day
		for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
			days.appendChild(
				createDay("", new Date(self.currentYear, self.currentMonth, dayNumber), dayNumber)
			);
		}

		// append days from the next month
		for (let dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth; dayNum++) {
			days.appendChild(
				createDay(
					"nextMonthDay",
					new Date(self.currentYear, self.currentMonth + 1, dayNum % daysInMonth),
					dayNum
				)
			);
		}

		if (isRangeMode && self.selectedDates.length === 1 && days.childNodes[0]) {
			self._hidePrevMonthArrow = self._hidePrevMonthArrow ||
				self.minRangeDate > days.childNodes[0].dateObj;

			self._hideNextMonthArrow = self._hideNextMonthArrow ||
				self.maxRangeDate < new Date(self.currentYear, self.currentMonth + 1, 1);
		}

		else
			updateNavigationCurrentMonth();

		self.days.appendChild(days);
		return self.days;
	}

	function buildMonthNav() {
		const monthNavFragment = window.document.createDocumentFragment();
		self.monthNav = createElement("div", "flatpickr-month");

		self.prevMonthNav = createElement("span", "flatpickr-prev-month");
		self.prevMonthNav.innerHTML = self.config.prevArrow;

		self.currentMonthElement = createElement("span", "cur-month");
		self.currentMonthElement.title = self.l10n.scrollTitle;

		const yearInput = createNumberInput("cur-year");
		self.currentYearElement =  yearInput.childNodes[0];
		self.currentYearElement.title = self.l10n.scrollTitle;

		if (self.config.minDate)
			self.currentYearElement.min = self.config.minDate.getFullYear();

		if (self.config.maxDate) {
			self.currentYearElement.max = self.config.maxDate.getFullYear();

			self.currentYearElement.disabled = self.config.minDate	&&
				self.config.minDate.getFullYear() === self.config.maxDate.getFullYear();
		}

		self.nextMonthNav = createElement("span", "flatpickr-next-month");
		self.nextMonthNav.innerHTML = self.config.nextArrow;

		self.navigationCurrentMonth = createElement("span", "flatpickr-current-month");
		self.navigationCurrentMonth.appendChild(self.currentMonthElement);
		self.navigationCurrentMonth.appendChild(yearInput);

		monthNavFragment.appendChild(self.prevMonthNav);
		monthNavFragment.appendChild(self.navigationCurrentMonth);
		monthNavFragment.appendChild(self.nextMonthNav);
		self.monthNav.appendChild(monthNavFragment);

		Object.defineProperty(self, "_hidePrevMonthArrow", {
			get () {
				return this.__hidePrevMonthArrow;
			},
			set (bool) {
				if (this.__hidePrevMonthArrow !== bool)
					self.prevMonthNav.style.display = bool ? "none" : "block";
				this.__hidePrevMonthArrow = bool;
			}
		});

		Object.defineProperty(self, "_hideNextMonthArrow", {
			get () {
				return this.__hideNextMonthArrow;
			},
			set (bool) {
				if (this.__hideNextMonthArrow !== bool)
					self.nextMonthNav.style.display = bool ? "none" : "block";
				this.__hideNextMonthArrow = bool;
			}
		});

		updateNavigationCurrentMonth();

		return self.monthNav;
	}

	function buildTime() {
		self.calendarContainer.classList.add("hasTime");
		if (self.config.noCalendar)
			self.calendarContainer.classList.add("noCalendar");
		self.timeContainer = createElement("div", "flatpickr-time");
		self.timeContainer.tabIndex = -1;
		const separator = createElement("span", "flatpickr-time-separator", ":");

		const hourInput = createNumberInput("flatpickr-hour");
		self.hourElement =  hourInput.childNodes[0];

		const minuteInput = createNumberInput("flatpickr-minute");
		self.minuteElement =  minuteInput.childNodes[0];

		self.hourElement.tabIndex = self.minuteElement.tabIndex = -1;

		self.hourElement.value = self.pad(self.latestSelectedDateObj
			? self.latestSelectedDateObj.getHours()
			: self.config.defaultHour
		);

		self.minuteElement.value = self.pad(self.latestSelectedDateObj
			? self.latestSelectedDateObj.getMinutes()
			: self.config.defaultMinute
		);

		self.hourElement.step = self.config.hourIncrement;
		self.minuteElement.step = self.config.minuteIncrement;

		self.hourElement.min = self.config.time_24hr ? 0 : 1;
		self.hourElement.max = self.config.time_24hr ? 23 : 12;

		self.minuteElement.min = 0;
		self.minuteElement.max = 59;

		self.hourElement.title = self.minuteElement.title = self.l10n.scrollTitle;

		self.timeContainer.appendChild(hourInput);
		self.timeContainer.appendChild(separator);
		self.timeContainer.appendChild(minuteInput);

		if (self.config.time_24hr)
			self.timeContainer.classList.add("time24hr");

		if (self.config.enableSeconds) {
			self.timeContainer.classList.add("hasSeconds");

			const secondInput = createNumberInput("flatpickr-second");
			self.secondElement =  secondInput.childNodes[0];

			self.secondElement.value =
				self.latestSelectedDateObj ? self.pad(self.latestSelectedDateObj.getSeconds()) : "00";

			self.secondElement.step = self.minuteElement.step;
			self.secondElement.min = self.minuteElement.min;
			self.secondElement.max = self.minuteElement.max;

			self.timeContainer.appendChild(
				createElement("span", "flatpickr-time-separator", ":")
			);
			self.timeContainer.appendChild(secondInput);
		}

		if (!self.config.time_24hr) { // add self.amPM if appropriate
			self.amPM = createElement(
				"span",
				"flatpickr-am-pm",
				["AM", "PM"][(self.hourElement.value > 11) | 0]
			);
			self.amPM.title = self.l10n.toggleTitle;
			self.amPM.tabIndex = -1;
			self.timeContainer.appendChild(self.amPM);
		}

		return self.timeContainer;
	}

	function buildWeekdays() {
		if (!self.weekdayContainer)
			self.weekdayContainer = createElement("div", "flatpickr-weekdays");

		const firstDayOfWeek = self.l10n.firstDayOfWeek;
		let	weekdays = self.l10n.weekdays.shorthand.slice();

		if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
			weekdays = [].concat(
				weekdays.splice(firstDayOfWeek, weekdays.length),
				weekdays.splice(0, firstDayOfWeek)
			);
		}

		self.weekdayContainer.innerHTML = `
		<span class=flatpickr-weekday>
			${weekdays.join("</span><span class=flatpickr-weekday>")}
		</span>
		`;

		return self.weekdayContainer;
	}

	/* istanbul ignore next */
	function buildWeeks() {
		self.calendarContainer.classList.add("hasWeeks");
		self.weekWrapper = createElement("div", "flatpickr-weekwrapper");
		self.weekWrapper.appendChild(
			createElement("span", "flatpickr-weekday", self.l10n.weekAbbreviation)
		);
		self.weekNumbers = createElement("div", "flatpickr-weeks");
		self.weekWrapper.appendChild(self.weekNumbers);

		return self.weekWrapper;
	}

	function changeMonth(value, is_offset) {
		is_offset = typeof is_offset === "undefined" || is_offset;
		const delta = is_offset ? value : value - self.currentMonth;

		if (
			(delta < 0 && self._hidePrevMonthArrow) ||
			(delta > 0 && self._hideNextMonthArrow)
		)
			return;

		self.currentMonth += delta;

		if (self.currentMonth < 0 || self.currentMonth > 11) {
			self.currentYear += (self.currentMonth > 11 ? 1 : -1);
			self.currentMonth = (self.currentMonth + 12) % 12;

			triggerEvent("YearChange");
		}

		updateNavigationCurrentMonth();
		buildDays();

		if (!(self.config.noCalendar))
			self.days.focus();

		triggerEvent("MonthChange");
	}

	function clear(triggerChangeEvent) {
		self.input.value = "";

		if (self.altInput)
			self.altInput.value = "";

		if (self.mobileInput)
			self.mobileInput.value = "";

		self.selectedDates = [];
		self.latestSelectedDateObj = null;
		self.showTimeInput = false;

		self.redraw();

		if (triggerChangeEvent !== false)
			// triggerChangeEvent is true (default) or an Event
			triggerEvent("Change");
	}

	function close() {
		self.isOpen = false;

		if (!self.isMobile) {
			self.calendarContainer.classList.remove("open");
			(self.altInput || self.input).classList.remove("active");
		}

		triggerEvent("Close");
	}

	function destroy(instance) {
		instance = instance || self;
		instance.clear(false);

		window.removeEventListener("resize", instance.debouncedResize);

		window.document.removeEventListener("click", documentClick);
		window.document.removeEventListener("touchstart", documentClick);
		window.document.removeEventListener("blur", documentClick);

		if (instance.timeContainer)
			instance.timeContainer.removeEventListener("transitionend", positionCalendar);

		if (instance.mobileInput) {
			if (instance.mobileInput.parentNode)
				instance.mobileInput.parentNode.removeChild(instance.mobileInput);
			delete instance.mobileInput;
		}

		else if (instance.calendarContainer && instance.calendarContainer.parentNode)
			instance.calendarContainer.parentNode.removeChild(instance.calendarContainer);

		if (instance.altInput) {
			instance.input.type = "text";
			if (instance.altInput.parentNode)
				instance.altInput.parentNode.removeChild(instance.altInput);
			delete instance.altInput;
		}

		instance.input.type = instance.input._type;
		instance.input.classList.remove("flatpickr-input");
		instance.input.removeEventListener("focus", open);
		instance.input.removeAttribute("readonly");

		delete instance.input._flatpickr;
	}

	function isCalendarElem(elem) {
		if (self.config.appendTo && self.config.appendTo.contains(elem))
			return true;

		let e = elem;
		while (e) {

			if (e === self.calendarContainer)
				return true;
			e = e.parentNode;
		}

		return false;
	}

	function documentClick(e) {
		if (self.isOpen && !self.config.inline) {
			const isCalendarElement = isCalendarElem(e.target);
			const isInput = e.target === self.input
				|| e.target === self.altInput
				|| self.element.contains(e.target)
				|| (
					// web components
					e.path && e.path.indexOf &&
					(~e.path.indexOf(self.input) || ~e.path.indexOf(self.altInput))
				);

			const lostFocus = e.type === "blur"
				? isInput && e.relatedTarget && !isCalendarElem(e.relatedTarget)
				: !isInput && !isCalendarElement;

			if(lostFocus) {
				e.preventDefault();
				self.close();

				if (self.config.mode === "range" && self.selectedDates.length === 1) {
					self.clear();
					self.redraw();
				}
			}
		}
	}

	function formatDate(frmt, dateObj) {
		if (self.config.formatDate)
			return self.config.formatDate(frmt, dateObj);

		const chars = frmt.split("");
		return chars.map((c, i) => self.formats[c] && chars[i - 1] !== "\\"
			? self.formats[c](dateObj)
			: c !== "\\" ? c : ""
		).join("");
	}

	function changeYear(newYear) {
		if (
			!newYear
			|| (self.currentYearElement.min && newYear < self.currentYearElement.min)
			|| (self.currentYearElement.max && newYear > self.currentYearElement.max)
		)
			return;

		const newYearNum = parseInt(newYear, 10),
			isNewYear = self.currentYear !== newYearNum;

		self.currentYear = newYearNum || self.currentYear;

		if (self.config.maxDate	&& self.currentYear === self.config.maxDate.getFullYear()) {
			self.currentMonth = Math.min(
				self.config.maxDate.getMonth(),
				self.currentMonth
			);
		}

		else if (
			self.config.minDate && self.currentYear === self.config.minDate.getFullYear()) {
			self.currentMonth = Math.max(
				self.config.minDate.getMonth(),
				self.currentMonth
			);
		}

		if (isNewYear) {
			self.redraw();
			triggerEvent("YearChange");
		}
	}

	function isEnabled(date, timeless) {
		const ltmin = compareDates(
			date,
			self.config.minDate,
			typeof timeless !== "undefined" ? timeless : !self.minDateHasTime
		) < 0;
		const gtmax = compareDates(
			date,
			self.config.maxDate,
			typeof timeless !== "undefined" ? timeless : !self.maxDateHasTime
		) > 0;

		if (ltmin || gtmax)
			return false;

		if (!self.config.enable.length && !self.config.disable.length)
			return true;

		const dateToCheck = self.parseDate(date, true); // timeless

		const bool = self.config.enable.length > 0,
			array = bool ? self.config.enable : self.config.disable;

		for (let i = 0, d; i < array.length; i++) {
			d = array[i];

			if (d instanceof Function && d(dateToCheck)) // disabled by function
				return bool;

			else if (d instanceof Date && d.getTime() === dateToCheck.getTime())
				// disabled by date
				return bool;

			else if (typeof d === "string" && self.parseDate(d, true).getTime() === dateToCheck.getTime())
				// disabled by date string
				return bool;

			else if ( // disabled by range
				typeof d === "object" && d.from && d.to &&
				dateToCheck >= d.from && dateToCheck <= d.to
			)
				return bool;
		}

		return !bool;
	}

	function onKeyDown(e) {

		if (e.target === (self.altInput || self.input) && e.which === 13)
			selectDate(e);

		else if (self.isOpen || self.config.inline) {
			switch (e.key) {
				case "Enter":
					if (self.timeContainer && self.timeContainer.contains(e.target))
						updateValue();

					else
						selectDate(e);

					break;

				case "Escape": // escape
					self.close();
					break;

				case "ArrowLeft":
					if (e.target !== self.input & e.target !== self.altInput) {
						e.preventDefault();
						changeMonth(-1);
						self.currentMonthElement.focus();
					}
					break;

				case "ArrowUp":
					if (!self.timeContainer || !self.timeContainer.contains(e.target)) {
						e.preventDefault();
						self.currentYear++;
						self.redraw();
					}
					else
						updateTime(e);

					break;

				case "ArrowRight":
					if (e.target !== self.input & e.target !== self.altInput) {
						e.preventDefault();
						changeMonth(1);
						self.currentMonthElement.focus();
					}
					break;

				case "ArrowDown":
					if (!self.timeContainer || !self.timeContainer.contains(e.target)) {
						e.preventDefault();
						self.currentYear--;
						self.redraw();
					}
					else
						updateTime(e);

					break;

				case "Tab":
					if (e.target === self.hourElement) {
						e.preventDefault();
						self.minuteElement.select();
					}

					else if (e.target === self.minuteElement && self.amPM) {
						e.preventDefault();
						self.amPM.focus();
					}

					break;

				default: break;

			}

			triggerEvent("KeyDown", e);
		}
	}

	function onMouseOver(e) {
		if (self.selectedDates.length !== 1 || !e.target.classList.contains("flatpickr-day"))
			return;

		let hoverDate = e.target.dateObj,
			initialDate = self.parseDate(self.selectedDates[0], true),
			rangeStartDate = Math.min(hoverDate.getTime(), self.selectedDates[0].getTime()),
			rangeEndDate = Math.max(hoverDate.getTime(), self.selectedDates[0].getTime()),
			containsDisabled = false;

		for (let t = rangeStartDate; t < rangeEndDate; t += self.utils.duration.DAY) {
			if (!isEnabled(new Date(t))) {
				containsDisabled = true;
				break;
			}
		}

		for (
			let timestamp = self.days.childNodes[0].dateObj.getTime(), i = 0;
			i < 42;
			i++, timestamp += self.utils.duration.DAY
		) {
			const outOfRange = timestamp < self.minRangeDate.getTime()
				|| timestamp > self.maxRangeDate.getTime();

			if (outOfRange) {
				self.days.childNodes[i].classList.add("notAllowed");
				["inRange", "startRange", "endRange"].forEach(c => {
					self.days.childNodes[i].classList.remove(c)
				});
				continue;
			}

			else if (containsDisabled && !outOfRange)
				continue;



			["startRange", "inRange", "endRange", "notAllowed"].forEach(c => {
				self.days.childNodes[i].classList.remove(c)
			});

			const minRangeDate = Math.max(self.minRangeDate.getTime(), rangeStartDate),
				maxRangeDate = Math.min(self.maxRangeDate.getTime(), rangeEndDate);

			e.target.classList.add(hoverDate < self.selectedDates[0] ? "startRange" : "endRange");

			if (initialDate > hoverDate && timestamp === initialDate.getTime())
				self.days.childNodes[i].classList.add("endRange");

			else if (initialDate < hoverDate && timestamp === initialDate.getTime())
				self.days.childNodes[i].classList.add("startRange");

			else if (timestamp >= minRangeDate && timestamp <= maxRangeDate)
				self.days.childNodes[i].classList.add("inRange");
		}
	}

	function onResize() {
		if (self.isOpen && !self.config.static && !self.config.inline)
			positionCalendar();
	}

	function open(e) {
		if (self.isMobile) {
			if (e) {
				e.preventDefault();
				e.target.blur();
			}

			setTimeout(() => {
				self.mobileInput.click();
			}, 0);

			triggerEvent("Open");
			return;
		}

		if (self.isOpen || (self.altInput || self.input).disabled ||self.config.inline)
			return;

		self.isOpen = true;
		self.calendarContainer.classList.add("open");
		positionCalendar();
		(self.altInput || self.input).classList.add("active");


		triggerEvent("Open");
	}

	function minMaxDateSetter(type) {
		return function(date) {
			const dateObj = self.config[`_${type}Date`] = self.parseDate(date);

			const inverseDateObj = self.config[`_${type === "min" ? "max" : "min"}Date`];
			const isValidDate = date && dateObj instanceof Date;

			if (isValidDate) {
				self[`${type}DateHasTime`] = dateObj.getHours()
					|| dateObj.getMinutes()
					|| dateObj.getSeconds();
			}

			if (self.selectedDates) {
				self.selectedDates = self.selectedDates.filter(d => isEnabled(d));
				if (!self.selectedDates.length && type === "min")
					setHoursFromDate(dateObj);
				updateValue();
			}

			if(self.days) {
				redraw();

				if(isValidDate)
					self.currentYearElement[type] = dateObj.getFullYear();
				else
					self.currentYearElement.removeAttribute(type);

				self.currentYearElement.disabled = inverseDateObj && dateObj &&
					inverseDateObj.getFullYear() === dateObj.getFullYear();
			}
		}
	}

	function parseConfig() {
		let boolOpts = [
			"utc", "wrap", "weekNumbers", "allowInput", "clickOpens", "time_24hr", "enableTime", "noCalendar", "altInput", "shorthandCurrentMonth", "inline", "static", "enableSeconds", "disableMobile"
		];

		let hooks = [
			"onChange", "onClose", "onDayCreate", "onKeyDown", "onMonthChange",
			"onOpen", "onParseConfig", "onReady", "onValueUpdate", "onYearChange"
		];

		self.config = Object.create(Flatpickr.defaultConfig);

		let userConfig = Object.assign(
			{},
			self.instanceConfig,
			JSON.parse(JSON.stringify(self.element.dataset || {}))
		);

		self.config.parseDate = userConfig.parseDate;
		self.config.formatDate = userConfig.formatDate;

		Object.assign(self.config, userConfig);

		if (!userConfig.dateFormat && userConfig.enableTime) {
			self.config.dateFormat = self.config.noCalendar
				? "H:i" + (self.config.enableSeconds ? ":S" : "")
				: Flatpickr.defaultConfig.dateFormat + " H:i" + (self.config.enableSeconds ? ":S" : "");
		}

		if (userConfig.altInput && userConfig.enableTime && !userConfig.altFormat) {
			self.config.altFormat = self.config.noCalendar
				? "h:i" + (self.config.enableSeconds ? ":S K" : " K")
				: Flatpickr.defaultConfig.altFormat + ` h:i${self.config.enableSeconds ? ":S" : ""} K`;
		}

		Object.defineProperty(self.config, "minDate", {
			get: function() {
				return this._minDate;
			},
			set: minMaxDateSetter("min")
		});

		Object.defineProperty(self.config, "maxDate", {
			get: function() {
				return this._maxDate;
			},
			set: minMaxDateSetter("max")
		});

		self.config.minDate = userConfig.minDate;
		self.config.maxDate = userConfig.maxDate;

		for (let i = 0; i < boolOpts.length; i++)
			self.config[boolOpts[i]] = (self.config[boolOpts[i]] === true) || self.config[boolOpts[i]] === "true";

		for (let i = 0; i < hooks.length; i++)
			self.config[hooks[i]] = arrayify(self.config[hooks[i]] || []).map(bindToInstance);

		for (let i = 0; i < self.config.plugins.length; i++) {
			const pluginConf = self.config.plugins[i](self) || {};
			for (let key in pluginConf) {

				if (Array.isArray(self.config[key]) || ~hooks.indexOf(key))
					self.config[key] = arrayify(pluginConf[key])
						.map(bindToInstance)
						.concat(self.config[key]);

				else if (typeof userConfig[key] === "undefined")
					self.config[key] = pluginConf[key];
			}
		}


		triggerEvent("ParseConfig");
	}

	function setupLocale() {
		if (typeof self.config.locale !== "object" &&
			typeof Flatpickr.l10ns[self.config.locale] === "undefined"
		)
			console.warn(`flatpickr: invalid locale ${self.config.locale}`);

		self.l10n = Object.assign(
			Object.create(Flatpickr.l10ns.default),
			typeof self.config.locale === "object"
				? self.config.locale
				: self.config.locale !== "default"
					? Flatpickr.l10ns[self.config.locale] || {}
					: {}
		);
	}

	function positionCalendar(e) {
		if (e && e.target !== self.timeContainer)
			return;

		const calendarHeight = self.calendarContainer.offsetHeight,
			calendarWidth = self.calendarContainer.offsetWidth,
			configPos = self.config.position,
			input = (self.altInput || self.input),
			inputBounds = input.getBoundingClientRect(),
			distanceFromBottom = window.innerHeight - inputBounds.bottom + input.offsetHeight,
			showOnTop = configPos === "above" || (
				configPos !== "below"
				&& distanceFromBottom < calendarHeight
				&& inputBounds.top > calendarHeight
			);

		let top = (window.pageYOffset + inputBounds.top) + (!showOnTop
			? (input.offsetHeight + 2)
			: (- calendarHeight - 2)
		);

		toggleClass(self.calendarContainer, "arrowTop", !showOnTop);
		toggleClass(self.calendarContainer, "arrowBottom", showOnTop);

		if (self.config.inline)
			return;

		const left = window.pageXOffset + inputBounds.left;
		const right = window.document.body.offsetWidth - inputBounds.right;
		const rightMost = left + calendarWidth > window.document.body.offsetWidth;

		toggleClass(self.calendarContainer, "rightMost", rightMost);

		if (self.config.static)
			return;

		self.calendarContainer.style.top = `${top}px`;

		if (!rightMost) {
			self.calendarContainer.style.left = `${left}px`;
			self.calendarContainer.style.right = "auto";
		}

		else {
			self.calendarContainer.style.left = "auto";
			self.calendarContainer.style.right = `${right}px`;
		}
	}

	function redraw() {
		if (self.config.noCalendar || self.isMobile)
			return;

		buildWeekdays();
		updateNavigationCurrentMonth();
		buildDays();
	}

	function selectDate(e) {
		e.preventDefault();
		e.stopPropagation();

		if (
			self.config.allowInput &&
			e.key === "Enter" &&
			(e.target === (self.altInput || self.input))
		) {
			self.setDate(
				(self.altInput || self.input).value,
				true,
				e.target === self.altInput
					? self.config.altFormat
					: self.config.dateFormat
			);
			return e.target.blur();
		}

		if (
			!e.target.classList.contains("flatpickr-day") ||
			e.target.classList.contains("disabled") ||
			e.target.classList.contains("notAllowed")
		)
			return;

		const selectedDate
			= self.latestSelectedDateObj
			= new Date(e.target.dateObj.getTime());

		self.selectedDateElem = e.target;

		if (self.config.mode === "single")
			self.selectedDates = [selectedDate];

		else if (self.config.mode === "multiple") {
			const selectedIndex = isDateSelected(selectedDate);
			if (selectedIndex)
				self.selectedDates.splice(selectedIndex, 1);

			else
				self.selectedDates.push(selectedDate);
		}

		else if (self.config.mode === "range") {
			if (self.selectedDates.length === 2)
				self.clear();

			self.selectedDates.push(selectedDate);

			// unless selecting same date twice, sort ascendingly
			if (compareDates(selectedDate, self.selectedDates[0], true) !== 0)
				self.selectedDates.sort((a,b) => a.getTime() - b.getTime());
		}

		setHoursFromInputs();

		if (selectedDate.getMonth() !== self.currentMonth && self.config.mode !== "range") {
			const isNewYear = self.currentYear !== selectedDate.getFullYear();
			self.currentYear = selectedDate.getFullYear();
			self.currentMonth = selectedDate.getMonth();

			if (isNewYear)
				triggerEvent("YearChange");

			triggerEvent("MonthChange");
		}

		buildDays();

		if (self.minDateHasTime	&& self.config.enableTime
			&& compareDates(selectedDate, self.config.minDate) === 0
		)
			setHoursFromDate(self.config.minDate);

		updateValue();

		setTimeout(() => self.showTimeInput = true, 50);

		if (self.config.mode === "range") {
			if(self.selectedDates.length === 1) {
				onMouseOver(e);

				self._hidePrevMonthArrow = self._hidePrevMonthArrow ||
					self.minRangeDate > self.days.childNodes[0].dateObj;

				self._hideNextMonthArrow = self._hideNextMonthArrow ||
					self.maxRangeDate < new Date(self.currentYear, self.currentMonth + 1, 1);
			}

			else {
				updateNavigationCurrentMonth();
				self.close();
			}
		}

		if (self.config.enableTime)
			setTimeout(() => {
				self.hourElement.select();
			}, 451);

		if (self.config.mode === "single" && !self.config.enableTime)
			self.close();

		triggerEvent("Change");
	}

	function set(option, value) {
		self.config[option] = value;
		self.redraw();
		jumpToDate();
	}

	function setSelectedDate(inputDate, format) {
		if (Array.isArray(inputDate))
			self.selectedDates = inputDate.map(d => self.parseDate(d, false, format));

		else if (inputDate instanceof Date || !isNaN(inputDate))
			self.selectedDates = [self.parseDate(inputDate)];

		else if (inputDate && inputDate.substring) {
			switch (self.config.mode) {
				case "single":
					self.selectedDates = [self.parseDate(inputDate, false, format)];
					break;

				case "multiple":
					self.selectedDates = inputDate
						.split("; ")
						.map(date => self.parseDate(date, false, format));
					break;

				case "range":
					self.selectedDates = inputDate
						.split(self.l10n.rangeSeparator)
						.map(date => self.parseDate(date, false, format));

					break;

				default: break;
			}
		}

		self.selectedDates = self.selectedDates.filter(
			d => d instanceof Date && isEnabled(d, false)
		);

		self.selectedDates.sort((a,b) => a.getTime() - b.getTime());
	}

	function setDate(date, triggerChange, format) {
		if (!date)
			return self.clear();

		setSelectedDate(date, format);

		self.showTimeInput = self.selectedDates.length > 0;
		self.latestSelectedDateObj = self.selectedDates[0];

		self.redraw();
		jumpToDate();

		setHoursFromDate();
		updateValue();

		if (triggerChange)
			triggerEvent("Change");
	}

	function setupDates() {
		function parseDateRules(arr) {
			for (let i = arr.length; i--;) {
				if (typeof arr[i] === "string" || +arr[i])
					arr[i] = self.parseDate(arr[i], true);

				else if (arr[i] && arr[i].from && arr[i].to) {
					arr[i].from = self.parseDate(arr[i].from);
					arr[i].to = self.parseDate(arr[i].to);
				}
			}

			return arr.filter(x => x); // remove falsy values
		}

		self.selectedDates = [];
		self.now = new Date();

		if (self.config.disable.length)
			self.config.disable = parseDateRules(self.config.disable);

		if (self.config.enable.length)
			self.config.enable = parseDateRules(self.config.enable);

		setSelectedDate(self.config.defaultDate || self.input.value);

		const initialDate = (self.selectedDates.length
			? self.selectedDates[0]
			: self.config.minDate && self.config.minDate.getTime() > self.now
				? self.config.minDate
				: self.config.maxDate && self.config.maxDate.getTime() < self.now
					? self.config.maxDate
					: self.now
		);

		self.currentYear = initialDate.getFullYear();
		self.currentMonth = initialDate.getMonth();

		if (self.selectedDates.length)
			self.latestSelectedDateObj = self.selectedDates[0];

		self.minDateHasTime = self.config.minDate && (self.config.minDate.getHours()
			|| self.config.minDate.getMinutes()
			|| self.config.minDate.getSeconds());

		self.maxDateHasTime = self.config.maxDate && (self.config.maxDate.getHours()
			|| self.config.maxDate.getMinutes()
			|| self.config.maxDate.getSeconds());

		Object.defineProperty(self, "latestSelectedDateObj", {
			get() {
				return self._selectedDateObj
					|| self.selectedDates[self.selectedDates.length - 1]
					|| null;
			},
			set(date) {
				self._selectedDateObj = date;
			}
		});

		if (!self.isMobile) {
			Object.defineProperty(self, "showTimeInput", {
				get () {
					return self._showTimeInput;
				},
				set (bool) {
					self._showTimeInput = bool;
					if (self.calendarContainer)
						toggleClass(self.calendarContainer, "showTimeInput", bool);
				}
			});
		}
	}

	function setupHelperFunctions() {
		self.utils = {
			duration: {
				DAY: 86400000,
			},
			getDaysinMonth (month, yr) {
				month = typeof month === "undefined"
					? self.currentMonth
					: month;

				yr = typeof yr === "undefined"
					? self.currentYear
					: yr;

				if (month === 1 && (((yr % 4 === 0) && (yr % 100 !== 0)) || (yr % 400 === 0)))
					return 29;

				return self.l10n.daysInMonth[month];
			},

			monthToStr (monthNumber, shorthand) {
				shorthand = typeof shorthand === "undefined"
					? self.config.shorthandCurrentMonth
					: shorthand;

				return self.l10n.months[(`${shorthand ? "short" : "long"}hand`)][monthNumber];
			}
		};
	}

	/* istanbul ignore next */
	function setupFormats() {
		["D", "F", "J", "M", "W", "l"].forEach(f => {
			self.formats[f] = Flatpickr.prototype.formats[f].bind(self);
		});

		self.revFormat.F = Flatpickr.prototype.revFormat.F.bind(self);
		self.revFormat.M = Flatpickr.prototype.revFormat.M.bind(self);
	}

	function setupInputs() {
		self.input = self.config.wrap
			? self.element.querySelector("[data-input]")
			: self.element;

		/* istanbul ignore next */
		if (!self.input)
			return console.warn("Error: invalid input element specified", self.input);

		self.input._type = self.input.type;
		self.input.type = "text";
		self.input.classList.add("flatpickr-input");

		if (self.config.altInput) {
			// replicate self.element
			self.altInput = createElement(
				self.input.nodeName,
				self.input.className + " " + self.config.altInputClass
			);
			self.altInput.placeholder = self.input.placeholder;
			self.altInput.type = "text";
			self.input.type = "hidden";

			if (!self.config.static && self.input.parentNode)
				self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
		}

		if (!self.config.allowInput)
			(self.altInput || self.input).setAttribute("readonly", "readonly");
	}

	function setupMobile() {
		const inputType = self.config.enableTime
			? (self.config.noCalendar ? "time" : "datetime-local")
			: "date";

		self.mobileInput = createElement("input", self.input.className + " flatpickr-mobile");
		self.mobileInput.step = "any";
		self.mobileInput.tabIndex = 1;
		self.mobileInput.type = inputType;
		self.mobileInput.disabled = self.input.disabled;
		self.mobileInput.placeholder = self.input.placeholder;

		self.mobileFormatStr = inputType === "datetime-local"
			? "Y-m-d\\TH:i:S"
			: inputType === "date"
				? "Y-m-d"
				: "H:i:S";

		if (self.selectedDates.length) {
			self.mobileInput.defaultValue
			= self.mobileInput.value
			= formatDate(self.mobileFormatStr, self.selectedDates[0]);
		}

		if (self.config.minDate)
			self.mobileInput.min = formatDate("Y-m-d", self.config.minDate);

		if (self.config.maxDate)
			self.mobileInput.max = formatDate("Y-m-d", self.config.maxDate);

		self.input.type = "hidden";
		if (self.config.altInput)
			self.altInput.type = "hidden";

		try {
			self.input.parentNode.insertBefore(self.mobileInput, self.input.nextSibling);
		}
		catch (e) {
			//
		}

		self.mobileInput.addEventListener("change", e => {
			self.latestSelectedDateObj = self.parseDate(e.target.value);
			self.setDate(self.latestSelectedDateObj);
			triggerEvent("Change");
			triggerEvent("Close");
		});
	}

	function toggle() {
		if (self.isOpen)
			self.close();
		else
			self.open();
	}

	function triggerEvent(event, data) {
		const hooks = self.config["on" + event];

		if (hooks) {
			for (let i = 0; hooks[i] && i < hooks.length; i++)
				hooks[i](self.selectedDates, self.input && self.input.value, self, data);
		}

		if (event === "Change") {
			if (typeof Event === "function" && Event.constructor) {
				self.input.dispatchEvent(new Event("change", { "bubbles": true }));

				// many front-end frameworks bind to the input event
				self.input.dispatchEvent(new Event("input", { "bubbles": true }));
			}

			/* istanbul ignore next */
			else {
				if (window.document.createEvent !== undefined)
					return self.input.dispatchEvent(self.changeEvent);

				self.input.fireEvent("onchange");
			}
		}
	}

	function isDateSelected(date) {
		for (let i = 0; i < self.selectedDates.length; i++) {
			if (compareDates(self.selectedDates[i], date) === 0)
				return "" + i;
		}

		return false;
	}

	function isDateInRange(date){
		if (self.config.mode !== "range" || self.selectedDates.length < 2)
			return false;
		return compareDates(date,self.selectedDates[0]) >= 0
			&& compareDates(date,self.selectedDates[1]) <= 0;
	}

	function updateNavigationCurrentMonth() {
		if (self.config.noCalendar || self.isMobile || !self.monthNav)
			return;

		self.currentMonthElement.textContent = self.utils.monthToStr(self.currentMonth) + " ";
		self.currentYearElement.value = self.currentYear;

		self._hidePrevMonthArrow = self.config.minDate &&
				(self.currentYear === self.config.minDate.getFullYear()
					? self.currentMonth <= self.config.minDate.getMonth()
					: self.currentYear < self.config.minDate.getFullYear());

		self._hideNextMonthArrow = self.config.maxDate &&
			(self.currentYear === self.config.maxDate.getFullYear()
				? self.currentMonth + 1 > self.config.maxDate.getMonth()
				: self.currentYear > self.config.maxDate.getFullYear());
	}


	function updateValue() {
		if (!self.selectedDates.length)
			return self.clear();

		if (self.isMobile) {
			self.mobileInput.value = self.selectedDates.length
				? formatDate(self.mobileFormatStr, self.latestSelectedDateObj)
				: "";
		}

		const joinChar = self.config.mode !== "range" ? "; " : self.l10n.rangeSeparator;

		self.input.value = self.selectedDates
			.map(dObj => formatDate(self.config.dateFormat, dObj))
			.join(joinChar);

		if (self.config.altInput) {
			self.altInput.value = self.selectedDates
				.map(dObj => formatDate(self.config.altFormat, dObj))
				.join(joinChar);
		}

		triggerEvent("ValueUpdate");
	}

	function yearScroll(e) {
		e.preventDefault();

		const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY))),
			newYear = parseInt(e.target.value, 10) + delta;

		changeYear(newYear);
		e.target.value = self.currentYear;
	}

	function createElement(tag, className, content) {
		const e = window.document.createElement(tag);
		className = className || "";
		content = content || "";

		e.className = className;

		if (content)
			e.textContent = content;

		return e;
	}

	function arrayify(obj) {
		if (Array.isArray(obj))
			return obj;
		return [obj];
	}

	function toggleClass(elem, className, bool) {
		if (bool)
			return elem.classList.add(className);
		elem.classList.remove(className);
	}

	/* istanbul ignore next */
	function debounce(func, wait, immediate) {
		let timeout;
		return function() {
			let context = this, args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			}, wait);
			if (immediate && !timeout) func.apply(context, args);
		};
	}

	function compareDates(date1, date2, timeless) {
		if (!(date1 instanceof Date) || !(date2 instanceof Date))
			return false;

		if (timeless !== false) {
			return new Date(date1.getTime()).setHours(0,0,0,0)
				- new Date(date2.getTime()).setHours(0,0,0,0);
		}

		return date1.getTime() - date2.getTime();
	}

	function timeWrapper(e) {
		e.preventDefault();

		const isKeyDown = e.type === "keydown",
			isWheel = e.type === "wheel",
			isIncrement = e.type === "increment",
			input = e.target;

		if ((e.type !== "input" && !isKeyDown) &&
			(e.target.value || e.target.textContent).length >= 2 // typed two digits
		) {
			e.target.focus();
			e.target.blur();
		}

		if (self.amPM && e.target === self.amPM)
			return e.target.textContent = ["AM", "PM"][(e.target.textContent === "AM") | 0];

		const min = Number(input.min),
			max = Number(input.max),
			step = Number(input.step),
			curValue = parseInt(input.value, 10),
			delta = e.delta || (!isKeyDown
				? Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY))) || 0
				: e.which === 38 ? 1 : -1);

		let newValue = curValue + step * delta;

		if (typeof(input.value) !== "undefined" && input.value.length === 2) {
			const isHourElem = input === self.hourElement,
				isMinuteElem = input === self.minuteElement;

			if (newValue < min) {
				newValue = max + newValue + !isHourElem
					+ (isHourElem && !self.amPM);

				if (isMinuteElem)
					incrementNumInput(null, -1, self.hourElement)
			}

			else if (newValue > max) {
				newValue = input === self.hourElement
					? newValue - max - (!self.amPM)
					: min;

				if (isMinuteElem)
					incrementNumInput(null, 1, self.hourElement);
			}

			if (
				self.amPM && isHourElem && (step === 1
					? newValue + curValue === 23
					: Math.abs(newValue - curValue) > step)
			)
				self.amPM.textContent = self.amPM.textContent === "PM" ? "AM" : "PM";


			input.value = self.pad(newValue);
		}
	}

	init();
	return self;
}

/* istanbul ignore next */
Flatpickr.defaultConfig = {

	mode: "single",

	position: "top",

	/* if true, dates will be parsed, formatted, and displayed in UTC.
	preloading date strings w/ timezones is recommended but not necessary */
	utc: false,

	// wrap: see https://chmln.github.io/flatpickr/#strap
	wrap: false,

	// enables week numbers
	weekNumbers: false,

	// allow manual datetime input
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
	altInputClass: "flatpickr-input form-control input",

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

	// dateformatter that transforms a given date object to a string, according to passed format
	formatDate: null,

	getWeek: function (givenDate) {
		const date = new Date(givenDate.getTime());
		date.setHours(0, 0, 0, 0);

		// Thursday in current week decides the year.
		date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
		// January 4 is always in week 1.
		const week1 = new Date(date.getFullYear(), 0, 4);
		// Adjust to Thursday in week 1 and count number of weeks from date to week1.
		return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 +
			(week1.getDay() + 6) % 7) / 7);
	},

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

	// DOM node to append the calendar to in *static* mode
	appendTo: null,

	// code for previous/next icons. this is where you put your custom icon code e.g. fontawesome
	prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
	nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",

	// enables seconds in the time picker
	enableSeconds: false,

	// step size used when scrolling/incrementing the hour element
	hourIncrement: 1,

	// step size used when scrolling/incrementing the minute element
	minuteIncrement: 5,

	// initial value in the hour element
	defaultHour: 12,

	// initial value in the minute element
	defaultMinute: 0,

	// disable native mobile datetime input support
	disableMobile: false,

	// default locale
	locale: "default",

	plugins: [],

	// called every time calendar is closed
	onClose: [], // function (dateObj, dateStr) {}

	// onChange callback when user selects a date or time
	onChange: [], // function (dateObj, dateStr) {}

	// called for every day element
	onDayCreate: [],

	// called every time the month is changed
	onMonthChange: [],

	// called every time calendar is opened
	onOpen: [], // function (dateObj, dateStr) {}

	// called after the configuration has been parsed
	onParseConfig: [],

	// called after calendar is ready
	onReady: [], // function (dateObj, dateStr) {}

	// called after input value updated
	onValueUpdate: [],

	// called every time the year is changed
	onYearChange: [],

	onKeyDown: []
};

/* istanbul ignore next */
Flatpickr.l10ns = {
	en: {
		weekdays: {
			shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			longhand: [
				"Sunday", "Monday", "Tuesday", "Wednesday",
				"Thursday", "Friday", "Saturday"
			]
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
		rangeSeparator: " to ",
		weekAbbreviation: "Wk",
		scrollTitle: "Scroll to increment",
		toggleTitle: "Click to toggle"
	}
};

Flatpickr.l10ns.default = Object.create(Flatpickr.l10ns.en);
Flatpickr.localize = l10n => Object.assign(Flatpickr.l10ns.default, l10n || {});
Flatpickr.setDefaults = config => Object.assign(Flatpickr.defaultConfig, config || {});

Flatpickr.prototype = {
	formats: {
		// get the date in UTC
		Z: date => date.toISOString(),

		// weekday name, short, e.g. Thu
		D: function (date) {
			return this.l10n.weekdays.shorthand[this.formats.w(date)];
		},

		// full month name e.g. January
		F: function (date) {
			return this.utils.monthToStr(this.formats.n(date) - 1, false);
		},

		// hours with leading zero e.g. 03
		H: date => Flatpickr.prototype.pad(date.getHours()),

		// day (1-30) with ordinal suffix e.g. 1st, 2nd
		J: function (date) {
			return date.getDate() + this.l10n.ordinal(date.getDate())
		},

		// AM/PM
		K: date => date.getHours() > 11 ? "PM" : "AM",

		// shorthand month e.g. Jan, Sep, Oct, etc
		M: function (date) {
			return this.utils.monthToStr(date.getMonth(), true);
		},

		// seconds 00-59
		S: date => Flatpickr.prototype.pad(date.getSeconds()),

		// unix timestamp
		U: date => date.getTime() / 1000,

		W: function(date) {
			return this.config.getWeek(date);
		},

		// full year e.g. 2016
		Y: date => date.getFullYear(),

		// day in month, padded (01-30)
		d: date => Flatpickr.prototype.pad(date.getDate()),

		// hour from 1-12 (am/pm)
		h: date => date.getHours() % 12 ? date.getHours() % 12 : 12,

		// minutes, padded with leading zero e.g. 09
		i: date => Flatpickr.prototype.pad(date.getMinutes()),

		// day in month (1-30)
		j: date => date.getDate(),

		// weekday name, full, e.g. Thursday
		l: function (date) {
			return this.l10n.weekdays.longhand[date.getDay()];
		},

		// padded month number (01-12)
		m: date => Flatpickr.prototype.pad(date.getMonth() + 1),

		// the month number (1-12)
		n: date => date.getMonth() + 1,

		// seconds 0-59
		s: date => date.getSeconds(),

		// number of the day of the week
		w: date => date.getDay(),

		// last two digits of year e.g. 16 for 2016
		y: date => String(date.getFullYear()).substring(2)
	},

	revFormat: {
		D: () => {},
		F: function(dateObj, monthName) {
			dateObj.setMonth(this.l10n.months.longhand.indexOf(monthName));
		},
		H: (dateObj, hour) => dateObj.setHours(parseFloat(hour)),
		J: (dateObj, day) => dateObj.setDate(parseFloat(day)),
		K: (dateObj, amPM) => {
			const hours = dateObj.getHours();

			if (hours !== 12)
				dateObj.setHours(hours % 12 + 12 * /pm/i.test(amPM));
		},
		M: function(dateObj, shortMonth) {
			dateObj.setMonth(this.l10n.months.shorthand.indexOf(shortMonth));
		},
		S: (dateObj, seconds) => dateObj.setSeconds(seconds),
		W: () => {},
		Y: (dateObj, year) => dateObj.setFullYear(year),
		Z: (dateObj, ISODate) => dateObj = new Date(ISODate),

		d: (dateObj, day) => dateObj.setDate(parseFloat(day)),
		h: (dateObj, hour) => dateObj.setHours(parseFloat(hour)),
		i: (dateObj, minutes) => dateObj.setMinutes(parseFloat(minutes)),
		j: (dateObj, day) => dateObj.setDate(parseFloat(day)),
		l: () => {},
		m: (dateObj, month) => dateObj.setMonth(parseFloat(month) - 1),
		n: (dateObj, month) => dateObj.setMonth(parseFloat(month) - 1),
		s: (dateObj, seconds) => dateObj.setSeconds(parseFloat(seconds)),
		w: () => {},
		y: (dateObj, year) => dateObj.setFullYear(2000 + parseFloat(year)),
	},

	tokenRegex: {
		D:"(\\w+)",
		F:"(\\w+)",
		H:"(\\d\\d|\\d)",
		J:"(\\d\\d|\\d)\\w+",
		K:"(\\w+)",
		M:"(\\w+)",
		S:"(\\d\\d|\\d)",
		Y:"(\\d{4})",
		Z:"(.+)",
		d:"(\\d\\d|\\d)",
		h:"(\\d\\d|\\d)",
		i:"(\\d\\d|\\d)",
		j:"(\\d\\d|\\d)",
		l:"(\\w+)",
		m:"(\\d\\d|\\d)",
		n:"(\\d\\d|\\d)",
		s:"(\\d\\d|\\d)",
		w: "(\\d\\d|\\d)",
		y:"(\\d{2})"
	},

	pad: number => `0${number}`.slice(-2),

	parseDate (date, timeless, givenFormat) {
		if (!date)
			return null;

		const date_orig = date;

		if (date.toFixed) // timestamp
			date = new Date(date);

		else if (typeof date === "string") {
			const format = typeof givenFormat === "string" ? givenFormat : this.config.dateFormat;
			date = date.trim();

			if (date === "today") {
				date = new Date();
				timeless = true;
			}

			else if (this.config && this.config.parseDate)
				date = this.config.parseDate(date);

			else if (/Z$/.test(date) || /GMT$/.test(date)) // datestrings w/ timezone
				date = new Date(date);

			else {
				const parsedDate = this.config.noCalendar
					? new Date(new Date().setHours(0,0,0,0))
					: new Date(new Date().getFullYear(), 0, 1, 0, 0, 0 ,0);

				let matched = false;

				for (let i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
					const token = format[i];
					const isBackSlash = token === "\\";
					const escaped = format[i - 1] === "\\" || isBackSlash;
					if (this.tokenRegex[token] && !escaped) {
						regexStr += this.tokenRegex[token];
						const match = new RegExp(regexStr).exec(date);
						if (match && (matched = true))
							this.revFormat[token](parsedDate, match[++matchIndex]);
					}

					else if (!isBackSlash)
						regexStr += "."; // don't really care
				}

				date = matched	? parsedDate : null;
			}
		}

		else if (date instanceof Date)
			date = new Date(date.getTime()); // create a copy

		/* istanbul ignore next */
		if (!(date instanceof Date)) {
			console.warn(`flatpickr: invalid date ${date_orig}`);
			console.info(this.element);
			return null;
		}

		if (this.config && this.config.utc && !date.fp_isUTC)
			date = date.fp_toUTC();

		if (timeless === true)
			date.setHours(0, 0, 0, 0);

		return date;
	}
};

/* istanbul ignore next */
function _flatpickr(nodeList, config) {
	const nodes = Array.prototype.slice.call(nodeList); // static list
	let instances = [];
	for (let i = 0; i < nodes.length; i++) {
		try {
			nodes[i]._flatpickr = new Flatpickr(nodes[i], config || {});
			instances.push(nodes[i]._flatpickr);
		}

		catch (e) {
			console.warn(e, e.stack);
		}
	}

	return instances.length === 1 ? instances[0] : instances;
}

/* istanbul ignore next */
if (typeof HTMLElement !== "undefined") { // browser env
	HTMLCollection.prototype.flatpickr =
	NodeList.prototype.flatpickr = function (config) {
		return _flatpickr(this, config);
	};

	HTMLElement.prototype.flatpickr = function (config) {
		return _flatpickr([this], config);
	};
}

/* istanbul ignore next */
function flatpickr(selector, config) {
	return _flatpickr(window.document.querySelectorAll(selector), config);
}

/* istanbul ignore next */
if (typeof jQuery !== "undefined") {
	jQuery.fn.flatpickr = function (config) {
		return _flatpickr(this, config);
	};
}

Date.prototype.fp_incr = function (days) {
	return new Date(
		this.getFullYear(),
		this.getMonth(),
		this.getDate() + parseInt(days, 10)
	);
};

Date.prototype.fp_isUTC = false;
Date.prototype.fp_toUTC = function () {
	const newDate = new Date(
		this.getUTCFullYear(),
		this.getUTCMonth(),
		this.getUTCDate(),
		this.getUTCHours(),
		this.getUTCMinutes(),
		this.getUTCSeconds()
	);

	newDate.fp_isUTC = true;
	return newDate;
};

// IE9 classList polyfill
/* istanbul ignore next */
if (
	!(window.document.documentElement.classList) &&
	Object.defineProperty && typeof HTMLElement !== "undefined"
) {
	Object.defineProperty(HTMLElement.prototype, "classList", {
		get: function () {
			let self = this;
			function update(fn) {
				return function (value) {
					let classes = self.className.split(/\s+/),
						index = classes.indexOf(value);

					fn(classes, index, value);
					self.className = classes.join(" ");
				};
			}

			let ret = {
				add: update((classes, index, value) => {
					if (!(~index))
						classes.push(value);
				}),

				remove: update((classes, index) => {
					if (~index)
						classes.splice(index, 1);
				}),

				toggle: update((classes, index, value) => {
					if (~index)
						classes.splice(index, 1);
					else
						classes.push(value);
				}),

				contains: value => !!~self.className.split(/\s+/).indexOf(value),

				item: function (i) {
					return self.className.split(/\s+/)[i] || null;
				}
			};

			Object.defineProperty(ret, "length", {
				get: function () {
					return self.className.split(/\s+/).length;
				}
			});

			return ret;
		}
	});
}

if (typeof module !== "undefined")
	module.exports = Flatpickr;
