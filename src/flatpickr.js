/*! flatpickr v2.2.5, @license MIT */

class Flatpickr {
	constructor(element, config) {
		const self = this;
		if (element._flatpickr)
			self.destroy(element._flatpickr);

		element._flatpickr = self;

		self.element = element;
		self.instanceConfig = config || {};

		self._fp.parseConfig();
		self._fp.setupLocale();
		self._fp.setupInputs();
		self._fp.setupDates();

		self.isOpen = self.config.inline;

		self.isMobile = (
			!self.config.disableMobile &&
			!self.config.inline &&
			self.config.mode === "single" &&
			!self.config.disable.length &&
			!self.config.enable.length &&
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		);

		if (!self.isMobile)
			self._fp.build();

		self._fp.bind();

		self.minDateHasTime = self.config.minDate && (
			self.config.minDate.getHours()
			|| self.config.minDate.getMinutes()
			|| self.config.minDate.getSeconds()
		);

		self.maxDateHasTime = self.config.maxDate && (
			self.config.maxDate.getHours()
			|| self.config.maxDate.getMinutes()
			|| self.config.maxDate.getSeconds()
		);

		if (!self.isMobile) {
			Object.defineProperty(self, "dateIsPicked", {
				set (bool) {
					if (bool)
						return self.calendarContainer.classList.add("dateIsPicked");
					self.calendarContainer.classList.remove("dateIsPicked");
				}
			});
		}

		self.dateIsPicked = self.selectedDates.length > 0 || self.config.noCalendar;

		if (self.selectedDates.length) {
			if (self.config.enableTime)
				self._fp.setHoursFromDate();
			self._fp.updateValue();
		}

		if (self.config.weekNumbers) {
			self.calendarContainer.style.width = self.days.offsetWidth
				+ self.weekWrapper.offsetWidth + "px";
		}

		self.triggerEvent("Ready");
		return self;
	}

	get _fp() {
		const self = this;

		return {
			updateTime(e) {
				if (self.config.noCalendar && !self.selectedDates.length)
					// picking time only
					self.selectedDates = [self.now];

				self._fp.timeWrapper(e);

				if (!self.selectedDates.length)
					return;

				self._fp.setHoursFromInputs();
				self._fp.updateValue();
			},

			setHoursFromInputs(){
				if (!self.config.enableTime)
					return;

				let hours = (parseInt(self.hourElement.value, 10) || 0),
					minutes = (parseInt(self.minuteElement.value, 10) || 0),
					seconds = self.config.enableSeconds
						? (parseInt(self.secondElement.value, 10) || 0)
						: 0;

				if (self.amPM)
					hours = (hours % 12) + (12 * (self.amPM.innerHTML === "PM"));

				if (
					self.minDateHasTime
					&& self.compareDates(self.latestSelectedDateObj, self.config.minDate) === 0
				) {
					hours = Math.max(hours, self.config.minDate.getHours());
					if (hours === self.config.minDate.getHours())
						minutes = Math.max(minutes, self.config.minDate.getMinutes());
				}

				else if (
					self.maxDateHasTime
					&& self.compareDates(self.latestSelectedDateObj, self.config.maxDate) === 0
				) {
					hours = Math.min(hours, self.config.maxDate.getHours());
					if (hours === self.config.maxDate.getHours())
						minutes = Math.min(minutes, self.config.maxDate.getMinutes());
				}

				self._fp.setHours(hours, minutes, seconds);
			},

			setHoursFromDate(dateObj){
				const date = dateObj || self.latestSelectedDateObj;

				if (date)
					self._fp.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
			},

			setHours(hours, minutes, seconds) {
				if (self.selectedDates.length) {
					self.selectedDates[self.selectedDates.length - 1].setHours(
						hours % 24, minutes, seconds || 0, 0
					);
				}

				if (!self.config.enableTime || self.isMobile)
					return;

				self.hourElement.value = self.pad(
					!self.config.time_24hr
						? (12 + hours) % 12 + 12 * (hours % 12 === 0)
						: hours
				);

				self.minuteElement.value = self.pad(minutes);

				if (!self.config.time_24hr && self.selectedDates.length)
					self.amPM.textContent = self.latestSelectedDateObj.getHours() >= 12 ? "PM" : "AM";

				if (self.config.enableSeconds)
					self.secondElement.value = self.pad(seconds);
			},

			bind() {
				if (self.config.wrap) {
					["open", "close", "toggle", "clear"].forEach(el => {
						try {
							self.element.querySelector(`[data-${el}]`)
								.addEventListener("click", self[el].bind(self));
						}
						catch (e) {
							//
						}
					});
				}

				if ("createEvent" in document) {
					self.changeEvent = document.createEvent("HTMLEvents");
					self.changeEvent.initEvent("change", false, true);
				}


				if (self.isMobile)
					return self._fp.setupMobile();

				self.debouncedResize = self._fp.debounce(self._fp.onResize, 50);
				self.triggerChange = () => self.triggerEvent("Change");
				self.debouncedChange = self._fp.debounce(self.triggerChange, 1000);

				if (self.config.mode === "range")
					self.days.addEventListener("mouseover", self._fp.onMouseOver);

				document.addEventListener("keydown", self._fp.onKeyDown);
				window.addEventListener("resize", self.debouncedResize);

				const clickEvent = typeof window.ontouchstart !== "undefined"
					? "touchstart"
					: "click";

				document.addEventListener(clickEvent, self.onDocumentClick.bind(self));
				document.addEventListener("blur", self.onDocumentClick.bind(self));

				if (self.config.clickOpens)
					(self.altInput || self.input).addEventListener("focus", self.open);

				if (!self.config.noCalendar) {
					self.prevMonthNav.addEventListener("click", () => self.changeMonth(-1));
					self.nextMonthNav.addEventListener("click", () => self.changeMonth(1));

					self.currentYearElement.addEventListener("wheel", e => self._fp.debounce(self._fp.yearScroll(e), 50));
					self.currentYearElement.addEventListener("focus", () => {
						self.currentYearElement.select();
					});

					self.currentYearElement.addEventListener("input", event => {
						if (event.target.value.length === 4) {
							self.currentYearElement.blur();
							self._fp.handleYearChange(event.target.value);
							event.target.value = self.currentYear;
						}
					});

					self.days.addEventListener("click", self._fp.selectDate);
				}

				if (self.config.enableTime) {
					self.timeContainer.addEventListener("wheel", e => self._fp.debounce(self._fp.updateTime(e), 5));
					self.timeContainer.addEventListener("input", self._fp.updateTime);

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
							self._fp.updateTime(e);
							self.triggerChange(e);
						});
					}
				}
			},

			incrementNumInput(e, delta) {
				const input = e.target.parentNode.childNodes[0];
				input.value = parseInt(input.value, 10) + delta * (input.step || 1);

				try {
					input.dispatchEvent(new Event("input", { "bubbles": true }));

				}

				catch (e) {
					const ev = document.createEvent("CustomEvent");
					ev.initCustomEvent("input", true, true, {});
					input.dispatchEvent(ev);
				}
			},

			createNumberInput(inputClassName) {
				const wrapper = self._fp.createElement("div", "numInputWrapper"),
					numInput = self._fp.createElement("input", "numInput " + inputClassName),
					arrowUp = self._fp.createElement("span", "arrowUp"),
					arrowDown = self._fp.createElement("span", "arrowDown");

				numInput.type = "text";
				wrapper.appendChild(numInput);
				wrapper.appendChild(arrowUp);
				wrapper.appendChild(arrowDown);

				arrowUp.addEventListener("click", e => self._fp.incrementNumInput(e, 1));
				arrowDown.addEventListener("click", e => self._fp.incrementNumInput(e, -1));
				return wrapper;
			},

			build() {
				const fragment = document.createDocumentFragment();
				self.calendarContainer = self._fp.createElement("div", "flatpickr-calendar");
				self.numInputType = navigator.userAgent.indexOf("MSIE 9.0") > 0 ? "text" : "number";

				if (!self.config.noCalendar) {
					fragment.appendChild(self._fp.buildMonthNav());
					self.innerContainer = self._fp.createElement("div", "flatpickr-innerContainer")

					if (self.config.weekNumbers)
						self.innerContainer.appendChild(self._fp.buildWeeks());

					self.rContainer = self._fp.createElement("div", "flatpickr-rContainer");
					self.rContainer.appendChild(self._fp.buildWeekdays());
					self.rContainer.appendChild(self._fp.buildDays());
					self.innerContainer.appendChild(self.rContainer);
					fragment.appendChild(self.innerContainer);
				}

				if (self.config.enableTime)
					fragment.appendChild(self._fp.buildTime());

				if (self.config.mode === "range")
					self.calendarContainer.classList.add("rangeMode");

				self.calendarContainer.appendChild(fragment);

				if (self.config.inline || self.config.static) {
					self.calendarContainer.classList.add(self.config.inline ? "inline" : "static");
					self.positionCalendar();

					if (self.config.appendTo && self.config.appendTo.nodeType)
						self.config.appendTo.appendChild(self.calendarContainer);

					else {
						self.element.parentNode.insertBefore(
							self.calendarContainer,
							(self.altInput || self.input).nextSibling
						);
					}

				}
				else
					document.body.appendChild(self.calendarContainer);
			},

			createDay(className, date, dayNumber) {
				const dateIsEnabled = self.isEnabled(date),
					dayElement = self._fp.createElement(
						"span",
						"flatpickr-day " + className,
						date.getDate()
					);

				dayElement.dateObj = date;

				if (self.compareDates(date, self.now) === 0)
					dayElement.classList.add("today");

				if (dateIsEnabled) {
					dayElement.tabIndex = 0;

					if (self.isDateSelected(date)){
						dayElement.classList.add("selected");

						if (self.config.mode === "range") {
							dayElement.classList.add(
								self.compareDates(date, self.selectedDates[0]) === 0
									? "startRange"
									: "endRange"
								);
						}

						else
							self.selectedDateElem = dayElement;
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
					if (self.isDateInRange(date) && !self.isDateSelected(date))
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

				self.triggerEvent("DayCreate", dayElement);

				return dayElement;
			},

			buildDays() {
				if (!self.days) {
					self.days = self._fp.createElement("div", "flatpickr-days");
					self.days.tabIndex = -1;
				}

				self.firstOfMonth = (
						new Date(self.currentYear, self.currentMonth, 1).getDay() -
						self.l10n.firstDayOfWeek + 7
					) % 7;

				self.prevMonthDays = self._fp.utils.getDaysinMonth(
					(self.currentMonth - 1 + 12) % 12
				);

				const daysInMonth = self._fp.utils.getDaysinMonth(),
					days = document.createDocumentFragment();

				let	dayNumber = self.prevMonthDays + 1 - self.firstOfMonth;

				if (self.config.weekNumbers)
					self.weekNumbers.innerHTML = "";

				if (self.config.mode === "range") {
					// const dateLimits = self.config.enable.length || self.config.disable.length || self.config.mixDate || self.config.maxDate;
					self.minRangeDate = new Date(
						self.currentYear,
						self.currentMonth - 1,
						dayNumber
					);

					self.maxRangeDate = new Date(
						self.currentYear,
						self.currentMonth + 1,
						(42 - self.firstOfMonth) % daysInMonth
					);
				}

				self.days.innerHTML = "";

				// prepend days from the ending of previous month
				for (let i = 0; dayNumber <= self.prevMonthDays; i++, dayNumber++) {
					days.appendChild(
						self._fp.createDay("prevMonthDay", new Date(self.currentYear, self.currentMonth - 1, dayNumber), dayNumber)
					);
				}

				// Start at 1 since there is no 0th day
				for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
					days.appendChild(
						self._fp.createDay(
							"",
							new Date(self.currentYear, self.currentMonth, dayNumber),
							dayNumber
						)
					);
				}

				// append days from the next month
				for (
					let dayNum = daysInMonth + 1;
					dayNum <= 42 - self.firstOfMonth;
					dayNum++
				) {
					days.appendChild(
						self._fp.createDay(
							"nextMonthDay",
							new Date(
								self.currentYear,
								self.currentMonth + 1,
								dayNum % daysInMonth
							),
							dayNum
						)
					);
				}

				self.days.appendChild(days);
				return self.days;
			},

			buildMonthNav() {
				const monthNavFragment = document.createDocumentFragment();
				self.monthNav = self._fp.createElement("div", "flatpickr-month");

				self.prevMonthNav = self._fp.createElement("span", "flatpickr-prev-month");
				self.prevMonthNav.innerHTML = self.config.prevArrow;

				self.currentMonthElement = self._fp.createElement("span", "cur-month");

				const yearInput = self._fp.createNumberInput("cur-year");
				self.currentYearElement =  yearInput.childNodes[0];
				self.currentYearElement.title = self.l10n.scrollTitle;

				if (self.config.minDate)
					self.currentYearElement.min = self.config.minDate.getFullYear();

				if (self.config.maxDate) {
					self.currentYearElement.max = self.config.maxDate.getFullYear();

					self.currentYearElement.disabled = self.config.minDate	&&
						self.config.minDate.getFullYear()
						=== self.config.maxDate.getFullYear();
				}

				self.nextMonthNav = self._fp.createElement("span", "flatpickr-next-month");
				self.nextMonthNav.innerHTML = self.config.nextArrow;

				self.navigationCurrentMonth = self._fp.createElement("span", "flatpickr-current-month");
				self.navigationCurrentMonth.appendChild(self.currentMonthElement);
				self.navigationCurrentMonth.appendChild(yearInput);

				monthNavFragment.appendChild(self.prevMonthNav);
				monthNavFragment.appendChild(self.navigationCurrentMonth);
				monthNavFragment.appendChild(self.nextMonthNav);
				self.monthNav.appendChild(monthNavFragment);

				self._fp.updateNavigationCurrentMonth();

				return self.monthNav;
			},

			buildTime() {
				self.calendarContainer.classList.add("hasTime");
				self.timeContainer = self._fp.createElement("div", "flatpickr-time");
				self.timeContainer.tabIndex = -1;
				const separator = self._fp.createElement("span", "flatpickr-time-separator", ":");

				const hourInput = self._fp.createNumberInput("flatpickr-hour");
				self.hourElement =  hourInput.childNodes[0];

				const minuteInput = self._fp.createNumberInput("flatpickr-minute");
				self.minuteElement =  minuteInput.childNodes[0];

				self.hourElement.tabIndex = self.minuteElement.tabIndex = 0;
				self.hourElement.pattern = self.minuteElement.pattern = "\d*";

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

					const secondInput = self._fp.createNumberInput("flatpickr-second");
					self.secondElement =  secondInput.childNodes[0];

					self.secondElement.pattern = self.hourElement.pattern;
					self.secondElement.value =
						self.latestSelectedDateObj ? self.pad(self.latestSelectedDateObj.getSeconds()) : "00";

					self.secondElement.step = self.minuteElement.step;
					self.secondElement.min = self.minuteElement.min;
					self.secondElement.max = self.minuteElement.max;

					self.timeContainer.appendChild(
						self._fp.createElement("span", "flatpickr-time-separator", ":")
					);
					self.timeContainer.appendChild(secondInput);
				}

				if (!self.config.time_24hr) { // add self.amPM if appropriate
					self.amPM = self._fp.createElement(
						"span",
						"flatpickr-am-pm",
						["AM", "PM"][(self.hourElement.value > 11) | 0]
					);
					self.amPM.title = self.l10n.toggleTitle;
					self.amPM.tabIndex = 0;
					self.timeContainer.appendChild(self.amPM);
				}

				return self.timeContainer;
			},

			buildWeekdays() {
				if (!self.weekdayContainer)
					self.weekdayContainer = self._fp.createElement("div", "flatpickr-weekdays");

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
			},

			buildWeeks() {
				self.calendarContainer.classList.add("hasWeeks");
				self.weekWrapper = self._fp.createElement("div", "flatpickr-weekwrapper");
				self.weekWrapper.appendChild(
					self._fp.createElement("span", "flatpickr-weekday", self.l10n.weekAbbreviation)
				);
				self.weekNumbers = self._fp.createElement("div", "flatpickr-weeks");
				self.weekWrapper.appendChild(self.weekNumbers);

				return self.weekWrapper;
			},


			handleYearChange(newYear) {
				if (self.currentMonth < 0 || self.currentMonth > 11) {
					self.currentYear += self.currentMonth % 11;
					self.currentMonth = (self.currentMonth + 12) % 12;
					self.triggerEvent("YearChange");
				}

				else if (
					newYear
					&& (!self.currentYearElement.min || newYear >= self.currentYearElement.min)
					&& (!self.currentYearElement.max || newYear <= self.currentYearElement.max)
				) {
					self.currentYear = parseInt(newYear, 10) || self.currentYear;

					if (
						self.config.maxDate
						&& self.currentYear === self.config.maxDate.getFullYear()
					) {
						self.currentMonth = Math.min(
							self.config.maxDate.getMonth(),
							self.currentMonth
						);
					}

					else if (
						self.config.minDate
						&& self.currentYear === self.config.minDate.getFullYear()
					) {
						self.currentMonth = Math.max(
							self.config.minDate.getMonth(),
							self.currentMonth
						);
					}

					self.redraw();
					self.triggerEvent("YearChange");
				}
			},

			onKeyDown(e) {
				if (self.isOpen) {
					switch (e.which) {
						case 13:
							if (self.timeContainer && self.timeContainer.contains(e.target))
								self._fp.updateValue();

							else
								self._fp.selectDate(e);

							break;

						case 27: // escape
							self.clear();
							self.redraw();
							self.close();
							break;

						case 37:
							if (e.target !== self.input & e.target !== self.altInput)
								self.changeMonth(-1);
							break;

						case 38:
							e.preventDefault();

							if (self.timeContainer && self.timeContainer.contains(e.target))
								self._fp.updateTime(e);

							else {
								self.currentYear++;
								self.redraw();
							}

							break;

						case 39:
							if (e.target !== self.input & e.target !== self.altInput)
								self.changeMonth(1);
							break;

						case 40:
							e.preventDefault();
							if (self.timeContainer && self.timeContainer.contains(e.target))
								self._fp.updateTime(e);

							else {
								self.currentYear--;
								self.redraw();
							}

							break;

						default: break;
					}
				}
			},

			onMouseOver(e) {
				if (self.selectedDates.length !== 1 || !e.target.classList.contains("flatpickr-day"))
					return;

				let hoverDate = e.target.dateObj,
					initialDate = self.parseDate(self.selectedDates[0], true),
					rangeStartDate = Math.min(
						hoverDate.getTime(),
						self.selectedDates[0].getTime()
					),
					rangeEndDate = Math.max(
						hoverDate.getTime(),
						self.selectedDates[0].getTime()
					),
					containsDisabled = false;

				for (
					let t = rangeStartDate;
					t < rangeEndDate;
					t += self._fp.utils.duration.DAY
				) {
					if (!self.isEnabled(new Date(t))) {
						containsDisabled = true;
						break;
					}
				}

				for (
					let timestamp = self.days.childNodes[0].dateObj.getTime(), i = 0;
					i < 42;
					i++, timestamp += self._fp.utils.duration.DAY
				) {
					const outOfRange = timestamp < self.minRangeDate.getTime()
						|| timestamp > self.maxRangeDate.getTime();

					if (outOfRange) {
						self.days.childNodes[i].classList.add("notAllowed");
						self.days.childNodes[i].classList.remove("inRange", "startRange", "endRange");
						continue;
					}

					else if (containsDisabled && !outOfRange)
						continue;

					self.days.childNodes[i].classList.remove("startRange", "inRange", "endRange", "notAllowed");

					const minRangeDate = Math.max(self.minRangeDate.getTime(), rangeStartDate),
						maxRangeDate = Math.min(self.maxRangeDate.getTime(), rangeEndDate);

					e.target.classList.add(hoverDate < self.selectedDates[0] ? "startRange" : "endRange");

					if (initialDate > hoverDate && timestamp === initialDate.getTime())
						self.days.childNodes[i].classList.add("endRange");

					else if (initialDate < hoverDate && timestamp === initialDate.getTime())
						self.days.childNodes[i].classList.add("startRange");

					else if (timestamp > minRangeDate && timestamp < maxRangeDate)
						self.days.childNodes[i].classList.add("inRange");
				}
			},

			onResize() {
				if (self.isOpen && !self.config.static && !self.config.inline)
					self.positionCalendar();
			},

			parseConfig() {
				var boolOpts = [
					"utc", "wrap", "weekNumbers", "allowInput", "clickOpens", "time_24hr", "enableTime", "noCalendar", "altInput", "shorthandCurrentMonth", "inline", "static", "enableSeconds", "disableMobile"
				];
				self.config = Object.create(Flatpickr.defaultConfig);
				let userConfig = Object.assign(
					{},
					self.instanceConfig,
					self.element.dataset || {}
				);

				Object.defineProperty(self.config, "minDate", {
					get: function() {
						return this._minDate;
					},
					set: function(date) {
						this._minDate = self.parseDate(date);

						if(self.days)
							self.redraw();

						if (!self.currentYearElement)
							return;

						if (date && this._minDate instanceof Date) {
							self.minDateHasTime = this._minDate.getHours()
								|| this._minDate.getMinutes()
								|| this._minDate.getSeconds();

							self.currentYearElement.min = this._minDate.getFullYear();
						}

						else
							self.currentYearElement.removeAttribute("min");

						self.currentYearElement.disabled = this._maxDate && this._minDate &&
							this._maxDate.getFullYear() === this._minDate.getFullYear();
					}
				});

				Object.defineProperty(self.config, "maxDate", {
					get: function() {
						return this._maxDate;
					},
					set: function(date) {
						this._maxDate = self.parseDate(date);
						if(self.days)
							self.redraw();

						if (!self.currentYearElement)
							return;

						if (date && this._maxDate instanceof Date) {
							self.currentYearElement.max = this._maxDate.getFullYear();
							self.maxDateHasTime = this._maxDate.getHours()
								|| this._maxDate.getMinutes()
								|| this._maxDate.getSeconds();
						}

						else
							self.currentYearElement.removeAttribute("max");

						self.currentYearElement.disabled = this._maxDate && this._minDate &&
							this._maxDate.getFullYear() === this._minDate.getFullYear();
					}
				});

				Object.assign(self.config, userConfig);

				for (var i = 0; i < boolOpts.length; i++)
					self.config[boolOpts[i]] = (self.config[boolOpts[i]] === true) || self.config[boolOpts[i]] === "true";

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
			},

			setupLocale() {
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
			},

			selectDate(e) {
				if (
					self.config.allowInput &&
					e.which === 13 &&
					(e.target === (self.altInput || self.input))
				)
					return self.setDate((self.altInput || self.input).value), e.target.blur();

				if (
					!e.target.classList.contains("flatpickr-day") ||
					e.target.classList.contains("disabled") ||
					e.target.classList.contains("notAllowed")
				)
					return;

				const selectedDate = e.target.dateObj;
				self.selectedDateElem = e.target;

				if (self.config.mode === "single") {
					self.selectedDates = [selectedDate];

					if (!self.config.enableTime)
						self.close();
				}

				else if (self.config.mode === "multiple") {
					const selectedIndex = self.isDateSelected(selectedDate);
					if (selectedIndex)
						self.selectedDates.splice(selectedIndex, 1);
					else
						self.selectedDates.push(selectedDate);

				}

				else if (self.config.mode === "range") {
					if (self.selectedDates.length === 2)
						self.clear();

					self.selectedDates.push(selectedDate);
					self.selectedDates.sort((a,b) => a.getTime() - b.getTime());
				}

				self._fp.setHoursFromInputs();


				if (selectedDate.getMonth() !== self.currentMonth && self.config.mode !== "range") {
					self.currentYear = selectedDate.getFullYear();
					self.currentMonth = selectedDate.getMonth();
					self._fp.updateNavigationCurrentMonth();
				}

				self._fp.buildDays();

				if (self.minDateHasTime	&& self.config.enableTime
					&& self.compareDates(selectedDate, self.config.minDate) === 0
				)
					self._fp.setHoursFromDate(self.config.minDate);

				self._fp.updateValue();

				setTimeout(() => self.dateIsPicked = true, 50);

				if (self.config.mode === "range" && self.selectedDates.length === 1)
					self._fp.onMouseOver(e);

				self.triggerEvent("Change");
			},

			setupDates() {
				self.selectedDates = [];
				self.now = new Date();
				const inputDate = self.config.defaultDate || self.input.value;

				if (Array.isArray(inputDate))
					self.selectedDates = inputDate.map(self.parseDate);

				else if (inputDate) {
					switch (self.config.mode) {
						case "single":
							self.selectedDates = [self.parseDate(inputDate)];
							break;

						case "multiple":
							self.selectedDates = inputDate.split("; ").map(self.parseDate);
							break;

						case "range":
							self.selectedDates = inputDate
								.split(self.l10n.rangeSeparator)
								.map(self.parseDate);
							break;

						default: break;
					}
				}

				self.selectedDates = self.selectedDates.filter(
					d => d instanceof Date && d.getTime() && self.isEnabled(d)
				);

				const initialDate = (self.selectedDates.length
					? self.selectedDates[0]
					: (self.config.minDate > self.now ? self.config.minDate : self.now)
				);

				self.currentYear = initialDate.getFullYear();
				self.currentMonth = initialDate.getMonth();
			},

			setupInputs() {
				self.input = self.config.wrap ? self.element.querySelector("[data-input]") : self.element;

				self.input.classList.add("flatpickr-input");
				if (self.config.altInput) {
					// replicate self.element
					self.altInput = self._fp.createElement(
						self.input.nodeName,
						self.config.altInputClass
					);
					self.altInput.placeholder = self.input.placeholder;
					self.altInput.type = "text";

					self.input.type = "hidden";
					if (self.input.parentNode) {
						self.input.parentNode.insertBefore(
							self.altInput,
							self.input.nextSibling
						);
					}
				}

				if (!self.config.allowInput)
					(self.altInput || self.input).setAttribute("readonly", "readonly");
			},

			setupMobile() {
				const inputType = self.config.enableTime
					? (self.config.noCalendar ? "time" : "datetime-local")
					: "date";

				self.mobileInput = self._fp.createElement("input", "flatpickr-input flatpickr-mobile");
				self.mobileInput.step = "any";
				self.mobileInput.tabIndex = -1;
				self.mobileInput.type = inputType;
				self.mobileInput.disabled = self.input.disabled;


				self.mobileFormatStr = inputType === "datetime-local"
					? "Y-m-d\\TH:i:S"
					: inputType === "date"
						? "Y-m-d"
						: "H:i:S";

				if (self.selectedDates.length) {
					self.mobileInput.defaultValue
					= self.mobileInput.value
					= self.formatDate(self.mobileFormatStr, self.selectedDates[0]);
				}

				if (self.config.minDate)
					self.mobileInput.min = self.formatDate("Y-m-d", self.config.minDate);

				if (self.config.maxDate)
					self.mobileInput.max = self.formatDate("Y-m-d", self.config.maxDate);

				self.input.type = "hidden";
				if (self.config.altInput)
					self.altInput.type = "hidden";

				try {
					self.input.parentNode.insertBefore(
						self.mobileInput,
						self.input.nextSibling
					);
				}
				catch (e) {
					//
				}

				self.mobileInput.addEventListener("change", e => {
					self.setDate(e.target.value);
					self.triggerEvent("Change");
					self.triggerEvent("Close");
				});
			},

			updateNavigationCurrentMonth() {
				if (self.config.noCalendar || self.isMobile || !self.monthNav)
					return;

				self.currentMonthElement.textContent = self._fp.utils.monthToStr(self.currentMonth) + " ";
				self.currentYearElement.value = self.currentYear;

				if (self.config.minDate) {
					const hidePrevMonthArrow = self.currentYear
					=== self.config.minDate.getFullYear()
						? (self.currentMonth + 11) % 12 < self.config.minDate.getMonth()
						: self.currentYear < self.config.minDate.getFullYear();

					self.prevMonthNav.style.display = hidePrevMonthArrow ? "none" : "block";
				}

				else
					self.prevMonthNav.style.display = "block";


				if (self.config.maxDate) {
					const hideNextMonthArrow = self.currentYear
					=== self.config.maxDate.getFullYear()
						? self.currentMonth + 1 > self.config.maxDate.getMonth()
						: self.currentYear > self.config.maxDate.getFullYear();

					self.nextMonthNav.style.display = hideNextMonthArrow ? "none" : "block";
				}

				else
					self.nextMonthNav.style.display = "block";

			},

			updateValue() {
				if (!self.selectedDates.length)
					return self.clear();

				if (self.isMobile) {
					self.mobileInput.value = self.selectedDates.length
						? self.formatDate(self.mobileFormatStr, self.latestSelectedDateObj)
						: "";
				}

				const joinChar = self.config.mode !== "range" ? "; " : self.l10n.rangeSeparator;

				self.input.value = self.selectedDates
					.map(dObj => self.formatDate(self.config.dateFormat, dObj))
					.join(joinChar);

				if (self.config.altInput) {
					self.altInput.value = self.selectedDates
						.map(dObj => self.formatDate(self.config.altFormat, dObj))
						.join(joinChar);
				}

				self.triggerEvent("ValueUpdate");
			},

			yearScroll(e) {
				e.preventDefault();

				const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY))),
					newYear = parseInt(e.target.value, 10) + delta;

				self._fp.handleYearChange(newYear);
				e.target.value = self.currentYear;
			},

			createElement(tag, className = "", content = "") {
				const e = document.createElement(tag);
				e.className = className;

				if (content)
					e.innerHTML = content;

				return e;
			},

			debounce(func, wait, immediate) {
				let timeout;
				return function(...args) {
					const context = this;
					const later = function() {
						timeout = null;
						if (!immediate)
							func.apply(context, args);
					};

					clearTimeout(timeout);
					timeout = setTimeout(later, wait);
					if (immediate && !timeout)
						func.apply(context, args);
				};
			},

			timeWrapper(e) {
				e.preventDefault();
				if (e && (
					(e.target.value || e.target.textContent).length >= 2 || // typed two digits
					(e.type !== "keydown" && e.type !== "input") // scroll event
				))
					e.target.blur();

				if (self.amPM && e.target === self.amPM)
					return e.target.textContent = ["AM", "PM"][(e.target.textContent === "AM") | 0];

				const min = Number(e.target.min),
					max = Number(e.target.max),
					step = Number(e.target.step),
					curValue = parseInt(e.target.value, 10),
					delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY)));

				let newValue = Number(curValue);

				if (e.type === "wheel")
					newValue = curValue + step * delta;

				else if (e.type === "keydown")
					newValue = curValue + step * (e.which === 38 ? 1 : -1);

				if (newValue < min) {
					newValue = max + newValue + (e.target !== self.hourElement)
						+ (e.target === self.hourElement && !self.amPM);
				}

				else if (newValue > max) {
					newValue = e.target === self.hourElement
						? newValue - max - (!self.amPM)
						: min;
				}

				if (
					self.amPM && e.target === self.hourElement && (step === 1
						? newValue + curValue === 23
						: Math.abs(newValue - curValue) > step)
				)
					self.amPM.textContent = self.amPM.innerHTML === "PM" ? "AM" : "PM";

				e.target.value = self.pad(newValue);
			},

			utils: {
				duration: {
					DAY: 86400000,
				},
				getDaysinMonth (month = self.currentMonth, yr = self.currentYear) {
					if (month === 1 && (((yr % 4 === 0) && (yr % 100 !== 0)) || (yr % 400 === 0)))
						return 29;
					return self.l10n.daysInMonth[month];
				},

				monthToStr (monthNumber, short = self.config.shorthandCurrentMonth) {
					return self.l10n.months[
						(`${short ? "short" : "long"}hand`)
					][monthNumber];
				}
			}
		};
	}

	clear (triggerChangeEvent = true) {
		this.input.value = "";

		if (this.altInput)
			this.altInput.value = "";

		if (this.mobileInput)
			this.mobileInput.value = "";

		this.selectedDates = [];
		this.dateIsPicked = false;

		this.redraw();

		if (triggerChangeEvent !== false)
			// triggerChangeEvent is true (default) or an Event
			this.triggerEvent("Change");
	}

	changeMonth(value, is_offset) {
		this.currentMonth = (typeof is_offset === "undefined" || is_offset)
			? this.currentMonth + value
			: value;

		this._fp.handleYearChange();
		this._fp.updateNavigationCurrentMonth();
		this._fp.buildDays();

		if (!(this.config.noCalendar))
			this.days.focus();

		this.triggerEvent("MonthChange");
	}

	close() {
		this.isOpen = false;

		if (!this.isMobile) {
			this.calendarContainer.classList.remove("open");
			(this.altInput || this.input).classList.remove("active");
		}

		this.triggerEvent("Close");
	}

	compareDates(date1, date2) {
		if (!(date1 instanceof Date) || !(date2 instanceof Date))
			return false;

		return new Date(date1.getTime()).setHours(0,0,0,0)
			- new Date(date2.getTime()).setHours(0,0,0,0);
	}

	destroy(instance) {
		instance = instance || this;
		instance.clear(false);

		document.removeEventListener("keydown", instance.onKeyDown);
		window.removeEventListener("resize", instance.debouncedResize);

		document.removeEventListener("click", instance.onDocumentClick);
		document.removeEventListener("blur", instance.onDocumentClick);

		if (instance.mobileInput && instance.mobileInput.parentNode)
			instance.mobileInput.parentNode.removeChild(instance.mobileInput);

		else if (instance.calendarContainer && instance.calendarContainer.parentNode)
			instance.calendarContainer.parentNode.removeChild(instance.calendarContainer);

		if (instance.altInput) {
			instance.input.type = "text";
			if (instance.altInput.parentNode)
				instance.altInput.parentNode.removeChild(instance.altInput);
		}

		instance.input.classList.remove("flatpickr-input");
		instance.input.removeEventListener("focus", instance.open);
		instance.input.removeAttribute("readonly");

		delete instance.input._flatpickr;
	}

	onDocumentClick(e) {
		const self = this;
		function isCalendarElem(elem) {
			let e = elem;
			while (e) {
				if (/flatpickr-day|flatpickr-calendar/.test(e.className))
					return true;
				e = e.parentNode;
			}

			return false;
		}

		const isInput = self.element.contains(e.target)
			|| e.target === self.input
			|| e.target === self.altInput;

		if (self.isOpen && !isCalendarElem(e.target) && !isInput) {
			self.close();

			if (self.config.mode === "range" && self.selectedDates.length === 1) {
				self.clear();
				self.redraw();
			}
		}
	}

	formatDate(frmt, dateObj) {
		const self = this;
		if (self.config.formatDate)
			return self.config.formatDate(frmt, dateObj);

		const chars = frmt.split("");
		return chars.map((c, i) => self.formats[c] && chars[i - 1] !== "\\"
			? self.formats[c](dateObj)
			: c !== "\\" ? c : ""
		).join("");
	}

	get formats() {
		const self = this;

		return {
			// weekday name, short, e.g. Thu
			D: date => self.l10n.weekdays.shorthand[self.formats.w(date)],

			// full month name e.g. January
			F: date => self._fp.utils.monthToStr(self.formats.n(date) - 1, false),

			// hours with leading zero e.g. 03
			H: date => Flatpickr.prototype.pad(date.getHours()),

			// day (1-30) with ordinal suffix e.g. 1st, 2nd
			J: date => date.getDate() + self.l10n.ordinal(date.getDate()),

			// AM/PM
			K: date => date.getHours() > 11 ? "PM" : "AM",

			// shorthand month e.g. Jan, Sep, Oct, etc
			M: date => self._fp.utils.monthToStr(date.getMonth(), true),

			// seconds 00-59
			S: date => Flatpickr.prototype.pad(date.getSeconds()),

			// unix timestamp
			U: date => date.getTime() / 1000,

			// full year e.g. 2016
			Y: date => date.getFullYear(),

			// day in month, padded (01-30)
			d: date => Flatpickr.prototype.pad(self.formats.j(date)),

			// hour from 1-12 (am/pm)
			h: date => date.getHours() % 12 ? date.getHours() % 12 : 12,

			// minutes, padded with leading zero e.g. 09
			i: date => Flatpickr.prototype.pad(date.getMinutes()),

			// day in month (1-30)
			j: date => date.getDate(),

			// weekday name, full, e.g. Thursday
			l: date => self.l10n.weekdays.longhand[self.formats.w(date)],

			// padded month number (01-12)
			m: date => Flatpickr.prototype.pad(self.formats.n(date)),

			// the month number (1-12)
			n: date => date.getMonth() + 1,

			// seconds 0-59
			s: date => date.getSeconds(),

			// number of the day of the week
			w: date => date.getDay(),

			// last two digits of year e.g. 16 for 2016
			y: date => String(self.formats.Y(date)).substring(2)
		}
	}

	isDateInRange(date){
		if (this.config.mode !== "range" || this.selectedDates.length < 2)
			return false;
		return this.compareDates(date,this.selectedDates[0]) >= 0
			&& this.compareDates(date,this.selectedDates[1]) <= 0;
	}

	isDateSelected(date) {
		for (var i = 0; i < this.selectedDates.length; i++) {
			if (this.compareDates(this.selectedDates[i], date) === 0)
				return "" + i;
		}

		return false;
	}


	isEnabled(dateToCheck) {
		if (
			(this.config.minDate && this.compareDates(dateToCheck, this.config.minDate) < 0) ||
			(this.config.maxDate && this.compareDates(dateToCheck, this.config.maxDate) > 0)
		)
			return false;

		if (!this.config.enable.length && !this.config.disable.length)
			return true;


		dateToCheck = this.parseDate(dateToCheck, true); // timeless

		const bool = this.config.enable.length > 0,
			array = bool ? this.config.enable : this.config.disable;

		for (let i = 0, d; i < array.length; i++) {
			d = array[i];

			if (d instanceof Function && d(dateToCheck)) // disabled by function
				return bool;


			else if ((d instanceof Date || (typeof d === "string")) &&
				this.parseDate(d, true).getTime() === dateToCheck.getTime()
			)
				// disabled by date string
				return bool;

			else if ( // disabled by range
				typeof d === "object" && d.from && d.to &&
				dateToCheck >= this.parseDate(d.from) &&	dateToCheck <= this.parseDate(d.to)
			)
				return bool;
		}

		return !bool;
	}

	jumpToDate(jumpDate) {
		jumpDate = jumpDate
			? this.parseDate(jumpDate)
			: this.latestSelectedDateObj || (this.config.minDate > this.now
				? this.config.minDate
				: this.now
			);

		try {
			this.currentYear = jumpDate.getFullYear();
			this.currentMonth = jumpDate.getMonth();
		}

		catch (e) {
			console.error(e.stack);
			console.warn("Invalid date supplied: " + jumpDate);
		}

		this.redraw();
	}

	get latestSelectedDateObj() {
		if (this.selectedDates.length)
			return this.selectedDates[this.selectedDates.length - 1];
		return null;
	}

	open(e) {
		const self  = this;

		if (self.isMobile) {
			if (e) {
				e.preventDefault();
				e.target.blur();
			}

			setTimeout(() => {
				self.mobileInput.click();
			}, 0);

			self.triggerEvent("Open");
			return;
		}

		else if (self.isOpen || (self.altInput || self.input).disabled || self.config.inline)
			return;

		self.calendarContainer.classList.add("open");

		if (!self.config.static && !self.config.inline)
			self.positionCalendar();

		self.isOpen = true;

		if (!self.config.allowInput) {
			(self.altInput || self.input).blur();
			(self.config.noCalendar
				? self.timeContainer
				: self.selectedDateElem
					? self.selectedDateElem
					: self.days).focus();
		}

		(self.altInput || self.input).classList.add("active");
		self.triggerEvent("Open");
	}



	positionCalendar() {
		const self = this,
			calendarHeight = self.calendarContainer.offsetHeight,
			input = (self.altInput || self.input),
			inputBounds = input.getBoundingClientRect(),
			distanceFromBottom = window.innerHeight - inputBounds.bottom + input.offsetHeight;

		let top,
			left = (window.pageXOffset + inputBounds.left);

		if (distanceFromBottom < calendarHeight) {
			top = (window.pageYOffset - calendarHeight + inputBounds.top) - 2;
			self.calendarContainer.classList.remove("arrowTop");
			self.calendarContainer.classList.add("arrowBottom");
		}

		else {
			top = (window.pageYOffset + input.offsetHeight + inputBounds.top) + 2;
			self.calendarContainer.classList.remove("arrowBottom");
			self.calendarContainer.classList.add("arrowTop");
		}

		if (!self.config.static && !self.config.inline) {
			self.calendarContainer.style.top = `${top}px`;
			self.calendarContainer.style.left = `${left}px`;
		}

	}

	pad (number) {
		return `0${number}`.slice(-2);
	}

	parseDate(date, timeless = false) {
		if (!date)
			return null;

		const dateTimeRegex = /(\d+)/g,
			timeRegex = /^(\d{1,2})[:\s](\d\d)?[:\s]?(\d\d)?\s?(a|p)?/i,
			timestamp = /^(\d+)$/g,
			date_orig = date;

		if (date.toFixed || timestamp.test(date)) // timestamp
			date = new Date(date);

		else if (typeof date === "string") {
			date = date.trim();

			if (date === "today") {
				date = new Date();
				timeless = true;
			}

			else if (this.config.parseDate)
				date = this.config.parseDate(date);

			else if (timeRegex.test(date)) { // time picker
				const m = date.match(timeRegex),
					hours = !m[4]
						? m[1]  // military time, no conversion needed
						: (m[1] % 12) + (m[4].toLowerCase() === "p" ? 12 : 0); // am/pm

				date = new Date();
				date.setHours(hours, m[2] || 0, m[3] || 0);
			}

			else if (/Z$/.test(date) || /GMT$/.test(date)) // datestrings w/ timezone
				date = new Date(date);

			else if (dateTimeRegex.test(date) && /^[0-9]/.test(date)) {
				const d = date.match(dateTimeRegex);
				date = new Date(
					`${d[0]}/${d[1] || 1}/${d[2] || 1} ${d[3] || 0}:${d[4] || 0}:${d[5] || 0}`
				);
			}

			else // fallback
				date = new Date(date);
		}

		if (!(date instanceof Date)) {
			console.warn(`flatpickr: invalid date ${date_orig}`);
			console.info(this.element);
			return null;
		}

		if (this.config.utc && !date.fp_isUTC)
			date = date.fp_toUTC();

		if (timeless === true)
			date.setHours(0, 0, 0, 0);

		return date;
	}

	redraw() {
		if (this.config.noCalendar || this.isMobile)
			return;

		this._fp.buildWeekdays();
		this._fp.updateNavigationCurrentMonth();
		this._fp.buildDays();
	}

	set(option, value) {
		this.config[option] = value;
		this.redraw();
		this.jumpToDate();
	}

	setDate(date, triggerChange) {
		const self = this;
		if (!date)
			return self.clear();

		self.selectedDates = (
			Array.isArray(date)
				? date.map(self.parseDate)
				: [self.parseDate(date)]
		).filter(
			d => d instanceof Date && self.isEnabled(d)
		);

		self.redraw();
		self.jumpToDate();

		self._fp.setHoursFromDate();
		self._fp.updateValue();

		self.dateIsPicked = self.selectedDates.length > 0;

		if (triggerChange)
			self.triggerEvent("Change");
	}


	toggle() {
		this[this.isOpen ? "close" : "open"]();
	}

	triggerEvent(event, data) {
		const self = this;
		if (self.config["on" + event]) {
			const hooks = Array.isArray(self.config["on" + event])
				? self.config["on" + event]
				: [self.config["on" + event]];

			for (var i = 0; i < hooks.length; i++)
				hooks[i].bind(self)(self.selectedDates, self.input.value, self, data);
		}

		if (event === "Change") {
			try {
				self.input.dispatchEvent(new Event("change", { "bubbles": true }));

				// many front-end frameworks bind to the input event
				self.input.dispatchEvent(new Event("input", { "bubbles": true }));
			}

			catch(e) {
				if ("createEvent" in document)
					return self.input.dispatchEvent(self.changeEvent);

				self.input.fireEvent("onchange");
			}

		}
	}

	static localize(l10n) {
		Object.assign(Flatpickr.l10ns.default, l10n || {});
	}
}

Flatpickr.defaultConfig = {

	mode: "single",

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

	// onChange callback when user selects a date or time
	onChange: null, // function (dateObj, dateStr) {}

	// called every time calendar is opened
	onOpen: null, // function (dateObj, dateStr) {}

	// called every time calendar is closed
	onClose: null, // function (dateObj, dateStr) {}

	// called after calendar is ready
	onReady: null, // function (dateObj, dateStr) {}

	onValueUpdate: null,

	onDayCreate: null
};

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

Flatpickr.l10ns.default = Flatpickr.l10ns.en;

function _flatpickr(nodeList, config) {
	let instances = [];
	for (let i = 0; i < nodeList.length; i++) {
		try {
			nodeList[i]._flatpickr = new Flatpickr(nodeList[i], config || {});
			instances.push(nodeList[i]._flatpickr);
		}

		catch (e) {
			console.warn(e, e.stack);
		}
	}

	return instances.length === 1 ? instances[0] : instances;
}
if (typeof HTMLElement !== "undefined") { // browser env
	HTMLCollection.prototype.flatpickr =
	NodeList.prototype.flatpickr = function (config) {
		return _flatpickr(this, config);
	};

	HTMLElement.prototype.flatpickr = function (config) {
		return _flatpickr([this], config);
	};
}

function flatpickr(selector, config) {
	return _flatpickr(document.querySelectorAll(selector), config);
}

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
if (
	!("classList" in document.documentElement) &&
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
