describe('flatpickr', () => {

	const container = document.querySelector('.container');
	let elem;

	beforeEach(() => {
		elem = document.createElement("input");
		document.body.appendChild(elem);
	});

	afterEach(() => {
		elem.parentNode.removeChild(elem);
	});

	function createInstance(config) {
		return new Flatpickr(elem, config);
	}

	describe("init", () => {
		it("should parse minDate", () => {
			const fp = createInstance({
				minDate: "2016-02-27T16:16:22.585Z",
			});

			expect(fp.currentMonth).toEqual(1);
		});

		it("should parse defaultDate", () => {
			const fp = createInstance({
				defaultDate: "2016-12-27T16:16:22.585Z",
			});

			expect(fp.days.querySelector(".selected").textContent).toEqual("27");
		});

		it("shouldn't parse out-of-bounds defaultDate", () => {
			let fp = createInstance({
				minDate: "2016-12-28T16:16:22.585Z",
				defaultDate: "2016-12-27T16:16:22.585Z",
			});

			expect(fp.days.querySelector(".selected")).toEqual(null);

			fp = createInstance({
				defaultDate: '2016-12-27T16:16:22.585Z',
				enableTime: true
			});

			fp.set('maxDate', '2016-12-25T16:16:22.585Z');
			fp.set('minDate', '2016-12-24T16:16:22.585Z');

			expect(fp.currentMonth).toEqual(11);
			expect(fp.days.querySelector(".selected")).toEqual(null);

			let enabledDays = fp.days.querySelectorAll(":not(.disabled)");

			expect(enabledDays.length).toEqual(2);
			expect(enabledDays[0].textContent).toEqual("24");
			expect(enabledDays[1].textContent).toEqual("25");
		});
	});

	describe("datetimestring parser", () => {

		describe("date string parser", () => {
			it('should parse timestamp', () => {

				const fp = elem.flatpickr({
					defaultDate: 1477111633771
				});

				expect(fp.selectedDates[0]).toBeDefined();
				expect(fp.selectedDates[0].getFullYear()).toEqual(2016);
				expect(fp.selectedDates[0].getMonth()).toEqual(9);

			});

			it('should parse "2016-10"', () => {

				const fp = elem.flatpickr({
					defaultDate: "2016-10"
				});

				expect(fp.selectedDates[0]).toBeDefined();
				expect(fp.selectedDates[0].getFullYear()).toEqual(2016);
				expect(fp.selectedDates[0].getMonth()).toEqual(9);
			});

			it('should parse "2016-10-20 3:30"', () => {

				const fp = elem.flatpickr({
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

				const fp = elem.flatpickr({
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
			it('should parse "21:11:12"', () => {

				elem.value = '21:11:12';
				const fp = elem.flatpickr({
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
				const fp = elem.flatpickr({
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
				const fp = elem.flatpickr({
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


	describe("API", () => {
		it("set (option, value)", () => {

			const fp = new Flatpickr(elem);
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

			const fp = new Flatpickr(elem);
			fp.setDate("2016-10-20 03:00");

			expect(fp.selectedDates[0]).toBeDefined();
			expect(fp.selectedDates[0].getFullYear()).toEqual(2016);
			expect(fp.selectedDates[0].getMonth()).toEqual(9);
			expect(fp.selectedDates[0].getDate()).toEqual(20);
			expect(fp.selectedDates[0].getHours()).toEqual(3);

			fp.setDate("");
			expect(fp.selectedDates[0]).not.toBeDefined();
		});
	});


	describe("Internals", () => {
		it("updateNavigationCurrentMonth()", () => {
			const fp = new Flatpickr(elem, {
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
			const verifySelected = date => {
				expect(date).toBeDefined();

				expect(date.getFullYear()).toEqual(2016);
				expect(date.getMonth()).toEqual(9);
				expect(date.getDate()).toEqual(10);
			};
			const fp = createInstance({
				enableTime: true,
				minDate: "2016-10-01",
				onChange: (dates, datestr) => {
					verifySelected(dates[0]);
				}
			});

			fp.open();
			fp.days.childNodes[15].click(); // oct 10

			verifySelected(fp.selectedDates[0]);
		});
	});
});
