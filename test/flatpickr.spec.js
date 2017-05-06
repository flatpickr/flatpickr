const Flatpickr = require("../src/flatpickr.js");
Flatpickr.l10ns.ru = require("../dist/l10n/ru.js").ru;

Flatpickr.defaultConfig.animate = false;
Flatpickr.defaultConfig.closeOnSelect = true;
jest.useFakeTimers();

let elem, fp;
const UA = navigator.userAgent;
let mockAgent = null;

navigator.__defineGetter__('userAgent', function(){
    return mockAgent || UA;
});

function createInstance(config) {
	fp = new Flatpickr(elem, config);
	return fp;
}

function beforeEachTest(){
	mockAgent = false;
	jest.runAllTimers();
	document.activeElement.blur();

	if (fp)
		fp.destroy();

	if (elem === undefined) {
		elem = document.createElement("input");
		document.body.appendChild(elem);
	}
}

function incrementTime(type, times = 1) {
	for(let i = times; i--;)
		simulate("mousedown",fp[`${type}Element`].parentNode.childNodes[1], {which: 1});
}

function decrementTime(type, times = 1) {
	for(let i = times; i--;)
		simulate("mousedown",fp[`${type}Element`].parentNode.childNodes[2], {which: 1});
}

function simulate(eventType, onElement, options, type) {
	const eventOptions = Object.assign(options || {}, { bubbles: true});
	const evt = new (type || CustomEvent)(eventType, eventOptions);
	try {
		Object.assign(evt, eventOptions);
	}

	catch (e) {

	}

	onElement.dispatchEvent(evt);
}

describe('flatpickr', () => {
	beforeEach(beforeEachTest);

	describe("init", () => {
		it("should parse defaultDate", () => {
			createInstance({
				defaultDate: "2016-12-27T16:16:22.585Z",
				enableTime: true
			});

		const date = new Date("2016-12-27T16:16:22.585Z");
			expect(fp.currentYear).toEqual(date.getFullYear());
			expect(fp.currentMonth).toEqual(date.getMonth());
			expect(fp.days.querySelector(".selected").textContent).toEqual(date.getDate() + '');
		});

		it("should parse UTC defaultDate", () => {
			createInstance({
				defaultDate: "2016-12-27T16:16:22.585Z",
				enableTime: true,
				utc: true
			});

			expect(fp.currentYear).toEqual(2016);
			expect(fp.currentMonth).toEqual(11);
			expect(fp.days.querySelector(".selected").textContent).toEqual("27");

			expect(fp.showTimeInput).toBe(true);

			expect(fp.hourElement.value).toEqual("04");
			expect(fp.minuteElement.value).toEqual("16");
			expect(fp.amPM.textContent).toEqual("PM");

		});

		it("shouldn't parse out-of-bounds defaultDate", () => {
			createInstance({
				minDate: "2016-12-28T16:16:22.585Z",
				defaultDate: "2016-12-27T16:16:22.585Z",
			});

			expect(fp.days.querySelector(".selected")).toEqual(null);

			createInstance({
				defaultDate: '2016-12-27T16:16:22.585Z',
				enableTime: true
			});

			fp.set('maxDate', '2016-12-25');
			fp.set('minDate', '2016-12-24');

			expect(fp.currentMonth).toEqual(11);
			expect(fp.days.querySelector(".selected")).toEqual(null);

			let enabledDays = fp.days.querySelectorAll(".flatpickr-day:not(.disabled)");

			expect(enabledDays.length).toEqual(2);
			expect(enabledDays[0].textContent).toEqual("24");
			expect(enabledDays[1].textContent).toEqual("25");

			createInstance({
				defaultDate: '2016-12-27T16:16:22.585Z',
				minDate: '2016-12-27T16:26:22.585Z',
				enableTime: true
			});

			expect(fp.selectedDates.length).toBe(0);
			expect(fp.days.querySelector(".selected")).toEqual(null);
		});

		it("doesn't throw with undefined properties", () => {
			createInstance({
				onChange: undefined,
			});
			fp.set("minDate", "2016-10-20");
			expect(fp.config.minDate).toBeDefined();
		});
	});

	describe("datetimestring parser", () => {
		describe("date string parser", () => {
			it('should parse timestamp', () => {

				createInstance({
					defaultDate: 1477111633771
				});

				expect(fp.selectedDates[0]).toBeDefined();
				expect(fp.selectedDates[0].getFullYear()).toEqual(2016);
				expect(fp.selectedDates[0].getMonth()).toEqual(9);
				expect(fp.selectedDates[0].getDate()).toEqual(22);
			});

			it('should parse unix time', () => {
				createInstance({
					defaultDate: "1477111633.771", // shouldnt parse as a timestamp
					dateFormat: "U"
				});

				const parsedDate = fp.selectedDates[0];
				expect(parsedDate).toBeDefined();
				expect(parsedDate.getFullYear()).toEqual(2016);
				expect(parsedDate.getMonth()).toEqual(9);
				expect(parsedDate.getDate()).toEqual(22);
			});

			it('should parse "2016-10"', () => {
				createInstance({
					defaultDate: "2016-10"
				});

				expect(fp.selectedDates[0]).toBeDefined();
				expect(fp.selectedDates[0].getFullYear()).toEqual(2016);
				expect(fp.selectedDates[0].getMonth()).toEqual(9);
			});

			it('should parse "2016-10-20 3:30"', () => {
				createInstance({
					defaultDate: "2016-10-20 3:30",
					enableTime: true
				});

				expect(fp.selectedDates[0]).toBeDefined();
				expect(fp.selectedDates[0].getFullYear()).toEqual(2016);
				expect(fp.selectedDates[0].getMonth()).toEqual(9);
				expect(fp.selectedDates[0].getDate()).toEqual(20);
				expect(fp.selectedDates[0].getHours()).toEqual(3);
				expect(fp.selectedDates[0].getMinutes()).toEqual(30);
			});

			it('should parse ISO8601', () => {
				createInstance({
					defaultDate: "2007-03-04T21:08:12",
					enableTime: true,
					enableSeconds: true
				});

				expect(fp.selectedDates[0]).toBeDefined();
				expect(fp.selectedDates[0].getFullYear()).toEqual(2007);
				expect(fp.selectedDates[0].getMonth()).toEqual(2);
				expect(fp.selectedDates[0].getDate()).toEqual(4);
				expect(fp.selectedDates[0].getHours()).toEqual(21);
				expect(fp.selectedDates[0].getMinutes()).toEqual(8);
				expect(fp.selectedDates[0].getSeconds()).toEqual(12);
			});

			it('should parse "today"', () => {
				createInstance();
				expect(fp.parseDate("today")).toBeDefined();
				expect(fp.parseDate("today", true).getHours()).toBe(0);
			});

			it ("should parse JSON datestrings", () => {
				createInstance();

				const date = fp.parseDate("2016-12-27T16:16:22.585Z", false);
				expect(date.getTime()).toBeDefined();
				expect(date.getTime()).toEqual(Date.parse("2016-12-27T16:16:22.585Z"));
			});
		});

		describe("time string parser", () => {
			it('should parse "21:11"', () => {
				createInstance({
					defaultDate: '21:11',
					allowInput: true,
					enableTime: true,
					noCalendar: true,
				});

				expect(fp.selectedDates[0]).toBeDefined();
				expect(fp.selectedDates[0].getHours()).toEqual(21);
				expect(fp.selectedDates[0].getMinutes()).toEqual(11);
			});

			it('should parse "21:11:12"', () => {
				elem.value = '21:11:12';
				createInstance({
					allowInput: true,
					enableTime: true,
					enableSeconds: true,
					noCalendar: true,
				});

				expect(fp.selectedDates[0]).toBeDefined();
				expect(fp.selectedDates[0].getHours()).toEqual(21);
				expect(fp.selectedDates[0].getMinutes()).toEqual(11);
				expect(fp.selectedDates[0].getSeconds()).toEqual(12);
			});

			it('should parse "11:59 PM"', () => {
				elem.value = '11:59 PM';
				createInstance({
					allowInput: true,
					enableTime: true,
					noCalendar: true,
					dateFormat: "h:i K"
				});

				expect(fp.selectedDates[0]).toBeDefined();
				expect(fp.selectedDates[0].getHours()).toBe(23);
				expect(fp.selectedDates[0].getMinutes()).toBe(59);
				expect(fp.selectedDates[0].getSeconds()).toBe(0);

				const amPmElement = fp.amPM;

				expect(amPmElement).toBeDefined();
				expect(amPmElement.innerHTML).toBe('PM');
			});

			it('should parse "3:05:03 PM"', () => {

				elem.value = '3:05:03 PM';
				createInstance({
					allowInput: true,
					enableTime: true,
					enableSeconds: true,
					noCalendar: true,
					dateFormat: "h:i:S K"
				});

				expect(fp.selectedDates[0]).toBeDefined();
				expect(fp.selectedDates[0].getHours()).toBe(15);
				expect(fp.selectedDates[0].getMinutes()).toBe(5);
				expect(fp.selectedDates[0].getSeconds()).toBe(3);

				const amPmElement = fp.amPM;

				expect(amPmElement).toBeDefined();
				expect(amPmElement.innerHTML).toBe('PM');
			});

		});

	});

	describe('date formatting', () => {
		const DATE_STR = '2016-10-20 09:19:59';

		describe('default formatter', () => {
			const
				DEFAULT_FORMAT_1 = 'd.m.y H:i:S',
				DEFAULT_FORMAT_2 = 'D j F, \'y';

			it(`should format the date with the pattern "${DEFAULT_FORMAT_1}"`, () => {
				const RESULT = '20.10.16 09:19:59';
				createInstance({
					dateFormat: DEFAULT_FORMAT_1
				});

				fp.setDate('20.10.16 09:19:59');
				expect(fp.input.value).toEqual(RESULT);
				fp.setDate('2015.11.21 19:29:49');
				expect(fp.input.value).not.toEqual(RESULT);
			});

			it(`should format the date with the pattern "${DEFAULT_FORMAT_2}"`, () => {
				const RESULT = 'Thu 20 October, \'16';
				createInstance({
					dateFormat: DEFAULT_FORMAT_2
				});

				fp.setDate("Thu 20 October, '16");
				expect(fp.input.value).toEqual(RESULT);
				fp.setDate('2015-11-21 19:29:49');
				expect(fp.input.value).not.toEqual(RESULT);
			});
		});

		describe('custom formatter', () => {
			it('should format the date using the custom formatter', () => {
				const RESULT = 'MAAAGIC.*^*.2016.*^*.20.*^*.10';
				createInstance({
					dateFormat: 'YEAR-DAYOFMONTH-MONTH',
					formatDate(date, formatStr) {
						let segs = formatStr.split('-');
						return 'MAAAGIC.*^*.' + segs.map(seg => {
								let mapped = null;
								switch (seg) {
									case 'DAYOFMONTH':
										mapped = date.getDate();
										break;
									case 'MONTH':
										mapped = date.getMonth() + 1;
										break;
									case 'YEAR':
										mapped = date.getFullYear();
										break;
								}
								return '' + mapped;
							}).join('.*^*.');
					}
				});


				fp.setDate(new Date(2016, 9, 20));
				expect(fp.input.value).toEqual(RESULT);

				fp.setDate(new Date(2016, 10, 20));
				expect(fp.input.value).not.toEqual(RESULT);

			});
		});
	});

	describe("API", () => {
		it("changeMonth()", () => {
			createInstance({
				defaultDate: "2016-12-20"
			});

			fp.changeMonth(1);
			expect(fp.currentYear).toEqual(2017);

			fp.changeMonth(-1);
			expect(fp.currentYear).toEqual(2016);

			fp.changeMonth(2);
			expect(fp.currentMonth).toEqual(1);
			expect(fp.currentYear).toEqual(2017);

			fp.changeMonth(14);
			expect(fp.currentYear).toEqual(2018);
			expect(fp.currentMonth).toEqual(3);
		});

		it("monthScroll", () => {
			createInstance();
			fp.changeMonth(1, false);

			fp.open();
			simulate("wheel", fp.currentMonthElement, {
				wheelDelta: 1
			});

			jest.runAllTimers();
			expect(fp.currentMonth).toEqual(2);
		});

		it("yearScroll", () => {
			createInstance();
			const now = new Date();
			fp.setDate(now);

			fp.open();
			simulate("wheel", fp.currentYearElement, {
				wheelDelta: 1
			}, window.MouseEvent);

			jest.runAllTimers();
			expect(fp.currentYear).toEqual(now.getFullYear() + 1);
		});

		it("destroy()", () => {
			let fired = false;
			const input = fp.input;

			createInstance({
				altInput: true,
				onKeyDown: [() => {fired = true;}]
			});

			expect(input.type).toEqual("hidden");

			fp.open();
			simulate("keydown", fp.altInput, {key: "ArrowLeft", bubbles: true});
			expect(fired).toEqual(true);


			fp.destroy();

			expect(input.type).toEqual("text");
			expect(fp.altInput).toBeUndefined();
			expect(fp.config).toBeUndefined();

			fired = false;

			simulate("keydown", input, {key: "ArrowLeft", bubbles: true});
			simulate("keydown", document.body, {key: "ArrowLeft", bubbles: true});
			expect(fired).toEqual(false);
		});

		it("set (option, value)", () => {
			createInstance();
			fp.set("minDate", "2016-10-20");

			expect(fp.currentYearElement.min).toEqual("2016");
			expect(fp.config.minDate).toBeDefined();


			fp.set("minDate", null);
			expect(fp.currentYearElement.hasAttribute("min")).toEqual(false);

			fp.set("maxDate", "2016-10-20");

			expect(fp.config.maxDate).toBeDefined();
			expect(fp.currentYearElement.max).toEqual("2016");

			fp.set("maxDate", null);
			expect(fp.currentYearElement.hasAttribute("max")).toEqual(false);

			fp.set("mode", "range");
			expect(fp.config.mode).toEqual("range");
		});

		it("setDate (date)", () => {
			createInstance({
				enableTime: true
			});
			fp.setDate("2016-10-20 03:00");

			expect(fp.selectedDates[0]).toBeDefined();
			expect(fp.selectedDates[0].getFullYear()).toEqual(2016);
			expect(fp.selectedDates[0].getMonth()).toEqual(9);
			expect(fp.selectedDates[0].getDate()).toEqual(20);
			expect(fp.selectedDates[0].getHours()).toEqual(3);

			expect(fp.currentYear).toEqual(2016);
			expect(fp.currentMonth).toEqual(9);

			expect(fp.hourElement.value).toEqual("03");
			expect(fp.minuteElement.value).toEqual("00");
			expect(fp.amPM.textContent).toEqual("AM");

			fp.setDate("");
			expect(fp.selectedDates[0]).not.toBeDefined();
		});

		it("has valid latestSelectedDateObj", () => {
			createInstance({
				defaultDate: "2016-10-01 3:30",
				enableTime: true
			});

			expect(fp.latestSelectedDateObj).toBeDefined();
			expect(fp.latestSelectedDateObj.getFullYear()).toEqual(2016);
			expect(fp.latestSelectedDateObj.getMonth()).toEqual(9);
			expect(fp.latestSelectedDateObj.getDate()).toEqual(1);
			expect(fp.hourElement.value).toEqual("03");
			expect(fp.minuteElement.value).toEqual("30");
			expect(fp.amPM.textContent).toEqual("AM");

			fp.setDate("2016-11-03 16:49");
			expect(fp.latestSelectedDateObj).toBeDefined();
			expect(fp.latestSelectedDateObj.getFullYear()).toEqual(2016);
			expect(fp.latestSelectedDateObj.getMonth()).toEqual(10);
			expect(fp.latestSelectedDateObj.getDate()).toEqual(3);

			expect(fp.hourElement.value).toEqual("04");
			expect(fp.minuteElement.value).toEqual("49");
			expect(fp.amPM.textContent).toEqual("PM");

			fp.setDate("");
			expect(fp.latestSelectedDateObj).toEqual(undefined);
		});

		it("parses dates in enable[] and disable[]", () => {
			createInstance({
				disable: [
					{from: "2016-11-20", to: "2016-12-20"},
					"2016-12-21",
					null
				]
			});

			expect(fp.config.disable[0].from instanceof Date).toBe(true);
			expect(fp.config.disable[0].to instanceof Date).toBe(true);
			expect(fp.config.disable[1] instanceof Date).toBe(true);

			expect(fp.config.disable.includes(null)).toBe(false);

			fp.set("disable", []);
			fp.clear();

			createInstance({
				enable: [
					{from: "2016-11-20", to: "2016-12-20"},
					"2016-12-21",
					null
				]
			});

			expect(fp.config.enable[0].from instanceof Date).toBe(true);
			expect(fp.config.enable[0].to instanceof Date).toBe(true);
			expect(fp.config.enable[1] instanceof Date).toBe(true);

			expect(fp.config.enable.includes(null)).toBe(false);
		});

		it("documentClick", () => {
			createInstance({
				mode: "range"
			});

			simulate("focus", fp._input, { which:1, bubbles: true }, CustomEvent);
			fp._input.focus();

			expect(fp.isOpen).toBe(true);
			simulate("mousedown", window.document.body, { which:1 }, CustomEvent);
			fp._input.blur();

			expect(fp.isOpen).toBe(false);
			expect(fp.calendarContainer.classList.contains("open")).toBe(false);

			expect(fp.selectedDates.length).toBe(0);
			simulate("focus", fp._input);
			simulate("mousedown", fp.days.childNodes[15], { which:1, bubbles: true }, CustomEvent);
			expect(fp.selectedDates.length).toBe(1);

			fp.isOpen = true;
			simulate("mousedown", window.document.body, { which:1 }, CustomEvent);
			expect(fp.isOpen).toBe(false);
			expect(fp.selectedDates.length).toBe(0);
			expect(fp._input.value).toBe("");
		});

		it("onKeyDown", () => {
			createInstance({
				enableTime: true,
				altInput: true
			});

			fp.jumpToDate("2016-2-1");

			fp.open();
			fp.days.childNodes[15].focus();

			simulate("keydown", fp.days.childNodes[15], {
				key: "Enter"
			}, KeyboardEvent);

			expect(fp.selectedDates.length).toBe(1);
			simulate("keydown", fp.calendarContainer, {
				key: "Escape"
			}, KeyboardEvent);

			expect(fp.isOpen).toEqual(false);
		});

		it("onKeyDown: arrow nav", () => {
			jest.runAllTimers();
			createInstance({
				defaultDate: "2017-01-01"
			});

			fp.open();

			simulate("keydown", document.body, {key: "ArrowLeft", bubbles: true});
			expect(fp.currentMonth).toBe(0);
			expect(document.activeElement.dateObj.getDate()).toEqual(1);

			simulate("keydown", document.activeElement, {key: "ArrowLeft"});
			expect(fp.currentMonth).toBe(11);
			expect(fp.currentYear).toBe(2016);
			expect(document.activeElement.dateObj.getDate()).toEqual(7);

			simulate("keydown", document.activeElement, {key: "ArrowRight"});
			expect(document.activeElement.dateObj.getDate()).toEqual(1);
			expect(fp.currentMonth).toBe(0);
			expect(fp.currentYear).toBe(2017);

			simulate("keydown", document.activeElement, {key: "ArrowUp"});
			simulate("keydown", document.activeElement, {key: "ArrowUp"});
			expect(fp.currentMonth).toBe(11);
			expect(fp.currentYear).toBe(2016);
			expect(document.activeElement.dateObj.getDate()).toEqual(25);

			simulate("keydown", document.activeElement, {key: "ArrowDown"});
			simulate("keydown", document.activeElement, {key: "ArrowDown"});
			expect(fp.currentMonth).toBe(0);
			expect(fp.currentYear).toBe(2017);
			expect(document.activeElement.dateObj.getDate()).toEqual(1);

			simulate("keydown", document.activeElement, {key: "ArrowRight", ctrlKey: true});
			expect(fp.currentMonth).toBe(1);
			expect(fp.currentYear).toBe(2017);

			simulate("keydown", document.activeElement, {key: "ArrowLeft", ctrlKey: true});
			simulate("keydown", document.activeElement, {key: "ArrowLeft", ctrlKey: true});
			expect(fp.currentMonth).toBe(11);
			expect(fp.currentYear).toBe(2016);
		});

		it("enabling dates by function", () => {
			createInstance({
				enable: [
					d => d.getDate() === 6,
					new Date()
				],
				disable: [
					{from: "2016-10-20", to: "2016-10-25"}
				]
			});

			expect(fp.isEnabled("2016-10-06")).toBe(true);
			expect(fp.isEnabled(new Date())).toBe(true);
			expect(fp.isEnabled("2016-10-20")).toBe(false);
			expect(fp.isEnabled("2016-10-22")).toBe(false);
			expect(fp.isEnabled("2016-10-25")).toBe(false);
		});
	});


	describe("UI", () => {
		it("mode: multiple", () => {
			createInstance({
				mode: "multiple"
			});

			fp.jumpToDate("2017-1-1");
			fp.open();

			simulate("keydown", fp.days.childNodes[0], {key: "Enter"});
			expect(fp.selectedDates.length).toBe(1);

			simulate("keydown", fp.days.childNodes[0], {key: "Enter"});
			expect(fp.selectedDates.length).toBe(0);
		});

		it("switch month to selectedDate", () => {
			createInstance();
			fp.jumpToDate("2017-1-1");
			expect(fp.currentMonth).toBe(0);

			simulate("mousedown", fp.days.childNodes[41], { which:1 }, MouseEvent);
			expect(fp.selectedDates.length).toBe(1);
			expect(fp.currentMonth).toBe(1);
		});

		it("static calendar", () => {
			createInstance({
				"static": true
			});

			expect(fp.calendarContainer.classList.contains("static")).toBe(true);
			expect(fp.element.parentNode.classList.contains("flatpickr-wrapper")).toBe(true);
			expect(fp.element.parentNode.childNodes[0]).toEqual(fp.element);
			expect(fp.element.parentNode.childNodes[1]).toEqual(fp.calendarContainer);
		});

		it("mobile calendar", () => {
			mockAgent = "Android";
			createInstance({
				enableTime: true
			});
			expect(fp.isMobile).toBe(true);

			fp.mobileInput.value = "2016-10-20T02:30";
			simulate("change", fp.mobileInput);

			expect(fp.selectedDates.length).toBe(1);
			expect(fp.latestSelectedDateObj.getFullYear()).toBe(2016);
			expect(fp.latestSelectedDateObj.getMonth()).toBe(9);
			expect(fp.latestSelectedDateObj.getDate()).toBe(20);
			expect(fp.latestSelectedDateObj.getHours()).toBe(2);
			expect(fp.latestSelectedDateObj.getMinutes()).toBe(30);
		});

		it("selectDate() + onChange() through GUI", () => {
			function verifySelected (date) {
				expect(date).toBeDefined();

				expect(date.getFullYear()).toEqual(2016);
				expect(date.getMonth()).toEqual(9);
				expect(date.getDate()).toEqual(10);

				expect(fp.hourElement.value).toEqual("03");
				expect(fp.minuteElement.value).toEqual("30");
				expect(fp.amPM.textContent).toEqual("AM");
			};

			createInstance({
				enableTime: true,
				defaultDate: "2016-10-01 3:30",
				onChange: (dates, datestr) => {
					if (dates.length)
						verifySelected(dates[0]);
				}
			});

			fp.open();
			simulate("mousedown", fp.days.childNodes[15], { which:1 }, MouseEvent); // oct 10

			verifySelected(fp.selectedDates[0]);
		});

		it("year input", () => {
			createInstance();
			fp.currentYearElement.value = "2000";
			simulate("keyup", fp.currentYearElement);

			expect(fp.currentYear).toEqual(2000);
			incrementTime("currentYear");

			expect(fp.currentYear).toEqual(2001);
			expect(fp.currentYearElement.value).toEqual("2001");
			expect(fp.days.childNodes[10].dateObj.getFullYear()).toEqual(2001);
		});

		it("time input and increments", () => {
			createInstance({
				enableTime: true,
				defaultDate: "2017-1-1 10:00"
				//minDate: "2017-1-01 3:35",
			});

			expect(fp.hourElement.value).toEqual("10");
			expect(fp.minuteElement.value).toEqual("00");
			expect(fp.amPM.textContent).toEqual("AM");

			incrementTime("hour");
			expect(fp.hourElement.value).toEqual("11");

			incrementTime("minute");
			expect(fp.minuteElement.value).toEqual("05");

			simulate("mousedown", fp.amPM, { which:1 }, MouseEvent);
			expect(fp.amPM.textContent).toEqual("PM");

			simulate("wheel", fp.hourElement, {
				wheelDelta: 1
			}, window.MouseEvent);

			expect(fp.hourElement.value).toEqual("12");

			fp.hourElement.value = "9";
			simulate("input", fp.hourElement);

			expect(fp.hourElement.value).toEqual("09");
		});

		it("time input respects minDate", () => {
			createInstance({
				enableTime: true,
				dateFormat: "Y-m-d H:i",
				defaultDate: "2017-1-1 4:00",
				minDate: "2017-1-01 3:35",
			});

			expect(!!fp.minDateHasTime).toBe(true);
			simulate("mousedown", fp.hourElement.parentNode.childNodes[2], { which:1 }, MouseEvent);
			expect(fp.hourElement.value).toEqual("03");
			expect(fp.minuteElement.value).toEqual("35");

			simulate("mousedown", fp.hourElement.parentNode.childNodes[2], { which:1 }, MouseEvent);
			expect(fp.hourElement.value).toEqual("03"); // unchanged

			simulate("mousedown", fp.minuteElement.parentNode.childNodes[2], { which:1 }, MouseEvent);
			expect(fp.minuteElement.value).toEqual("35"); // can't go lower than min

			simulate("mousedown", fp.minuteElement.parentNode.childNodes[1], { which:1 }, MouseEvent); // increment
			expect(fp.minuteElement.value).toEqual("40");

			fp.hourElement.value = "2";
			simulate("input", fp.hourElement);

			jest.runAllTimers();

			expect(fp.hourElement.value).toEqual("03");

			fp.minuteElement.value = "00";
			simulate("input", fp.minuteElement);

			expect(fp.minuteElement.value).toEqual("35");
		});

		it("time input respects maxDate", () => {
			createInstance({
				enableTime: true,
				defaultDate: "2017-1-1 3:00",
				maxDate: "2017-1-01 3:35",
			});

			simulate("mousedown", fp.hourElement.parentNode.childNodes[2], { which:1 }, MouseEvent);
			expect(fp.hourElement.value).toEqual("02"); // ok

			incrementTime("hour", 3);
			expect(fp.hourElement.value).toEqual("03");

			incrementTime("minute", 8);
			expect(fp.minuteElement.value).toEqual("35"); // can't go higher than 35
		});

		it("time input respects same-day minDate/maxDate", () => {
			createInstance({
				enableTime: true,
				minDate: "2017-1-01 2:00 PM",
				maxDate: "2017-1-01 3:35 PM",
			});

			fp.setDate("2017-1-1 2:30 PM");

			decrementTime("hour");

			simulate("wheel", fp.hourElement, {
				wheelDelta: -1
			}, window.MouseEvent);

			expect(fp.hourElement.value).toEqual("02"); // ok

			incrementTime("hour", 4);
			expect(fp.hourElement.value).toEqual("03");

			incrementTime("minute", 8);
			simulate("wheel", fp.minuteElement, {
				wheelDelta: 1
			}, window.MouseEvent);

			expect(fp.minuteElement.value).toEqual("35"); // can't go higher than 35
		});

		it("time picker: implicit selectedDate", () => {
			createInstance({
				enableTime: true,
				noCalendar: true
			});

			expect(fp.selectedDates.length).toEqual(0);
			simulate("mousedown", fp.minuteElement.parentNode.childNodes[1], { which:1 }, MouseEvent);

			expect(fp.selectedDates.length).toEqual(1);
			expect(fp.selectedDates[0].getDate()).toEqual(new Date().getDate());
		});

		it("time picker: minDate/maxDate + preloading", () => {
			createInstance({
				enableTime: true,
				noCalendar: true,
				minDate: "02:30",
				defaultDate: "3:30"
			});

			expect(fp.hourElement.value).toBe("03");
			expect(fp.minuteElement.value).toBe("30");
			expect(fp.amPM.textContent).toBe("AM");

			decrementTime("hour", 1);
			expect(fp.hourElement.value).toBe("02");

			fp.set("maxDate", "04:30");
			incrementTime("hour", 3);
			expect(fp.hourElement.value).toBe("04");

			simulate("mousedown", fp.amPM, { which:1 }, MouseEvent);
			expect(fp.amPM.textContent).toBe("AM");

			fp.clear();

			fp.setDate("03:30");
			expect(fp.hourElement.value).toBe("03");

			fp.setDate("05:30");
			expect(fp.hourElement.value).toBe("03");

			fp.setDate("00:30");
			expect(fp.hourElement.value).toBe("03");
		});

		it("should delay time input validation on keydown", () => {
			createInstance({
				enableTime: true,
				defaultDate: new Date().setHours(17, 30, 0, 0),
				minDate: new Date().setHours(16, 30, 0, 0),
				time_24hr: true
			});

			fp.hourElement.value = "16";
			simulate("input", fp.hourElement);

			jest.runAllTimers();
			expect(fp.hourElement.value).toEqual("16");

			fp.hourElement.value = "1";

			simulate("input", fp.hourElement);
			expect(fp.hourElement.value).toEqual("1");

			jest.runAllTimers();
			expect(fp.hourElement.value).toEqual("16");
		});

		it("should have working strap mode", () => {
			let wrapper = document.createElement("div");
			const input = document.createElement("input");
			input.setAttribute("data-input", "");

			wrapper.appendChild(input);

			["open", "close", "toggle", "clear"].forEach(type => {
				let e = document.createElement("button");
				e.setAttribute(`data-${type}`, "");
				wrapper.appendChild(e);
			});

			const instance = new Flatpickr(wrapper, {
				wrap: true
			});

			expect(instance.input).toEqual(input);

			simulate("mousedown", wrapper.childNodes[1], { which:1 }, MouseEvent); // open
			expect(instance.isOpen).toEqual(true);

			simulate("mousedown", wrapper.childNodes[2], { which:1 }, MouseEvent); // close
			expect(instance.isOpen).toEqual(false);

			simulate("mousedown", wrapper.childNodes[3], { which:1 }, MouseEvent); // toggle
			expect(instance.isOpen).toEqual(true);
			simulate("mousedown", wrapper.childNodes[3], { which:1 }, MouseEvent);
			expect(instance.isOpen).toEqual(false);

			instance.setDate(new Date());
			expect(instance.selectedDates.length).toEqual(1);

			expect(instance.selectedDateElem).toBeDefined();
			expect(parseInt(instance.selectedDateElem.textContent)).toEqual(new Date().getDate());

			simulate("mousedown", wrapper.childNodes[4], { which:1 }, MouseEvent); // clear
			expect(instance.selectedDates.length).toEqual(0);
			expect(instance.input.value).toEqual("");

			instance.destroy();
			wrapper = null;
		});

		it("valid mouseover behavior in range mode", () => {
			createInstance({
				mode: "range"
			});

			simulate("mouseover", fp.days.childNodes[15]);
			expect(fp.selectedDates.length).toEqual(0);

			fp.setDate("2016-1-17");
			expect(fp.selectedDates.length).toEqual(1);

			simulate("mouseover", fp.days.childNodes[32]);
			expect(fp.days.childNodes[21].classList.contains("startRange")).toEqual(true);
			expect(fp.days.childNodes[32].classList.contains("endRange")).toEqual(true);

			for (let i = 22; i < 32; i++) {
				expect(fp.days.childNodes[i].classList.contains("inRange")).toEqual(true);
			}

			fp.clear();
			fp.set("disable", ["2016-1-12", "2016-1-20"]);
			fp.setDate("2016-1-17");

			simulate("mouseover", fp.days.childNodes[32]);
			expect(fp.days.childNodes[32].classList.contains("endRange")).toEqual(false);
			expect(fp.days.childNodes[24].classList.contains("disabled")).toEqual(true);
			expect(fp.days.childNodes[25].classList.contains("notAllowed")).toEqual(true);

			for (let i = 25; i < 32; i++) {
				expect(fp.days.childNodes[i].classList.contains("inRange")).toEqual(false);
			}

			for (let i = 17; i < 22; i++) {
				expect(fp.days.childNodes[i].classList.contains("notAllowed")).toEqual(false);
				expect(fp.days.childNodes[i].classList.contains("disabled")).toEqual(false);
			}

			simulate("mousedown", fp.days.childNodes[17], { which:1 }, MouseEvent);
			expect(fp.selectedDates.length).toEqual(2);
			expect(fp.input.value).toEqual("2016-01-13 to 2016-01-17");
		});

		it("show and hide prev/next month arrows", () => {
			const isArrowVisible = which => fp[`${which}MonthNav`].style.display !== "none";
			createInstance({
				minDate: "2099-1-1",
				maxDate: "2099-3-4",
				mode: "range"
			});

			expect(fp.currentMonth).toBe(0);
			expect(isArrowVisible("prev")).toBe(false);
			expect(isArrowVisible("next")).toBe(true);

			simulate("mousedown", fp.days.childNodes[10], { which:1 }, MouseEvent); // select some date
			jest.runOnlyPendingTimers();
			simulate("mousedown", fp.nextMonthNav, { which:1 }, MouseEvent);


			expect(isArrowVisible("prev")).toBe(true);
			expect(isArrowVisible("next")).toBe(true);

			simulate("mousedown", fp.nextMonthNav, { which:1 }, MouseEvent);
			expect(isArrowVisible("prev")).toBe(true);
			expect(isArrowVisible("next")).toBe(false);
		});
	});

	describe("Localization", () => {
		it("By locale config option", () => {
			createInstance({
				locale: "ru"
			});

			expect(fp.l10n.months.longhand[0]).toEqual("Январь");

			createInstance();
			expect(fp.l10n.months.longhand[0]).toEqual("January");
		});

		it("By overriding default locale", () => {
			Flatpickr.localize(Flatpickr.l10ns.ru);
			expect(Flatpickr.l10ns.default.months.longhand[0]).toEqual("Январь");

			createInstance();
			expect(fp.l10n.months.longhand[0]).toEqual("Январь");
		});
	});

	afterAll(() => {
		fp.destroy();
		elem.parentNode.removeChild(elem);
	});

});
