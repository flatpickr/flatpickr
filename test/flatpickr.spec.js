const Flatpickr = require("../src/flatpickr.js");
Flatpickr.l10ns.ru = require("../dist/l10n/ru.js").ru;

let elem, fp;

function createInstance(config) {
	fp = new Flatpickr(elem, config);
	return fp;
}

function beforeEachTest(){
	if (elem)
		elem.parentNode.removeChild(elem);

	if (fp)
		fp.destroy();

	elem = document.createElement("input");
	document.body.appendChild(elem);
}

function incrementTime(type, times = 1) {
	for(let i = times; i--;)
		fp[`${type}Element`].parentNode.childNodes[1].click();
}

function decrementTime(type, times = 1) {
	for(let i = times; i--;)
		fp[`${type}Element`].parentNode.childNodes[2].click();
}

function simulate(eventType, onElement, options) {
	onElement.dispatchEvent(
		new Event(
			eventType,
			Object.assign({ "bubbles": true }, options||{})
		)
	);
}

describe('flatpickr', () => {
	beforeEach(beforeEachTest);

	describe("init", () => {
		it("should parse defaultDate", () => {
			createInstance({
				defaultDate: "2016-12-27T16:16:22.585Z",
				enableTime: true
			});

			expect(fp.currentYear).toEqual(2016);
			expect(fp.currentMonth).toEqual(11);
			expect(fp.days.querySelector(".selected").textContent).toEqual("27");
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

			let enabledDays = fp.days.querySelectorAll(":not(.disabled)");

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
					defaultDate: "2016-10-20 3:30"
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
				DFEAULT_FORMAT_1 = 'd.m.y H:i:S',
				DFEAULT_FORMAT_2 = 'D j F, \'y';

			it(`should format the date with the pattern "${DFEAULT_FORMAT_1}"`, () => {
				const RESULT = '20.10.16 09:19:59';
				createInstance({
					dateFormat: DFEAULT_FORMAT_1
				});

				fp.setDate(DATE_STR);
				expect(fp.input.value).toEqual(RESULT);
				fp.setDate('2015-11-21 19:29:49');
				expect(fp.input.value).not.toEqual(RESULT);
			});

			it(`should format the date with the pattern "${DFEAULT_FORMAT_2}"`, () => {
				const RESULT = 'Thu 20 October, \'16';
				createInstance({
					dateFormat: DFEAULT_FORMAT_2
				});

				fp.setDate(DATE_STR);
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
					formatDate(formatStr, date) {
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

				fp.setDate(DATE_STR);
				expect(fp.input.value).toEqual(RESULT);
				fp.setDate('2015-11-21 19:29:49');
				expect(fp.input.value).not.toEqual(RESULT);
			});
		});
	});

	describe("API", () => {
		it("set (option, value)", () => {
			createInstance();
			fp.set("minDate", "2016-10-20");

			expect(fp.config.minDate).toBeDefined();
			expect(fp.currentYearElement.min).toEqual("2016");

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
	});


	describe("Internals", () => {
		it("updateNavigationCurrentMonth()", () => {
			createInstance({
				defaultDate: "2016-12-20"
			});

			fp.changeMonth(1);
			expect(fp.currentYear).toEqual(2017);

			fp.changeMonth(-1);
			expect(fp.currentYear).toEqual(2016);

			fp.changeMonth(2);
			expect(fp.currentMonth).toEqual(1);
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
			fp.days.childNodes[15].click(); // oct 10

			verifySelected(fp.selectedDates[0]);
		});

		it("year input", () => {
			createInstance();
			fp.currentYearElement.value = "2000";
			simulate("input", fp.currentYearElement);

			expect(fp.currentYear).toEqual(2000);
			incrementTime("currentYear");

			expect(fp.currentYear).toEqual(2001);
			expect(fp.currentYearElement.value).toEqual("2001");
			expect(fp.days.childNodes[10].dateObj.getFullYear()).toEqual(2001);
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
			expect(fp.latestSelectedDateObj).toEqual(null);
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

			fp.amPM.click();
			expect(fp.amPM.textContent).toEqual("PM");

			simulate("wheel", fp.hourElement, {
				wheelDelta: 1
			});

			expect(fp.hourElement.value).toEqual("12");

			fp.hourElement.value = "9";
			simulate("input", fp.hourElement);

			expect(fp.hourElement.value).toEqual("09");
		});

		it("time input respects minDate", () => {
			createInstance({
				enableTime: true,
				defaultDate: "2017-1-1 4:00",
				minDate: "2017-1-01 3:35",
			});

			fp.hourElement.parentNode.childNodes[2].click();
			expect(fp.hourElement.value).toEqual("03");
			expect(fp.minuteElement.value).toEqual("35");

			fp.hourElement.parentNode.childNodes[2].click();
			expect(fp.hourElement.value).toEqual("03"); // unchanged

			fp.minuteElement.parentNode.childNodes[2].click();
			expect(fp.minuteElement.value).toEqual("35"); // can't go lower than min

			fp.minuteElement.parentNode.childNodes[1].click(); // increment
			expect(fp.minuteElement.value).toEqual("40");

			fp.hourElement.value = "2";
			simulate("input", fp.hourElement);

			setTimeout(() => {
				expect(fp.hourElement.value).toEqual("03");
			}, 1001);

			fp.minuteElement.value = "00";
			simulate("input", fp.minuteElement);

			setTimeout(() => {
				expect(fp.minuteElement.value).toEqual("35");
			}, 1001);
		});

		it("time input respects maxDate", () => {
			createInstance({
				enableTime: true,
				defaultDate: "2017-1-1 3:00",
				maxDate: "2017-1-01 3:35",
			});

			fp.hourElement.parentNode.childNodes[2].click();
			expect(fp.hourElement.value).toEqual("02"); // ok

			incrementTime("hour", 3);
			expect(fp.hourElement.value).toEqual("03");

			incrementTime("minute", 8);
			expect(fp.minuteElement.value).toEqual("35"); // can't go higher than 35
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
