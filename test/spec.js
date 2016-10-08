describe('flatpickr', () => {

	const container = document.querySelector('.container');
	let elem;

	const init = () => {
		container.innerHTML = '<input type="text" class="flatpickr" style="display:none;" />';
		elem = container.querySelector('.flatpickr');
	};

	describe("datetimestring parser", () => {

		describe("date string parser", () => {

			it('should parse "2016-10"', () => {
				init();
				const fp = elem.flatpickr({
					defaultDate: "2016-10"
				});

				expect(fp.selectedDates[0]).toBeDefined();
				expect(fp.selectedDates[0].getFullYear()).toEqual(2016);
				expect(fp.selectedDates[0].getMonth()).toEqual(9);
			});

			it('should parse "2016-10-20 3:30"', () => {
				init();
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
				init();
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
				init();
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
				init();
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
				init();
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
			init();
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
			init();
			const fp = new Flatpickr(elem);
			fp.setDate("2016-10-20");

			expect(fp.selectedDates[0]).toBeDefined();
			expect(fp.selectedDates[0].getFullYear()).toEqual(2016);
			expect(fp.selectedDates[0].getMonth()).toEqual(9);
			expect(fp.selectedDates[0].getDate()).toEqual(20);

			fp.setDate("");
			expect(fp.selectedDates[0]).not.toBeDefined();
		});
	});
});
