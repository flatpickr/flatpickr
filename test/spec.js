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

				expect(fp.selectedDateObj).toBeDefined();
				expect(fp.selectedDateObj.getFullYear()).toEqual(2016);
				expect(fp.selectedDateObj.getMonth()).toEqual(9);
			});

			it('should parse "2016-10-20 3:30"', () => {
				init();
				const fp = elem.flatpickr({
					defaultDate: "2016-10-20 3:30"
				});

				expect(fp.selectedDateObj).toBeDefined();
				expect(fp.selectedDateObj.getFullYear()).toEqual(2016);
				expect(fp.selectedDateObj.getMonth()).toEqual(9);
				expect(fp.selectedDateObj.getDate()).toEqual(20);
				expect(fp.selectedDateObj.getHours()).toEqual(3);
				expect(fp.selectedDateObj.getMinutes()).toEqual(30);
			});

			it('should parse ISO8601', () => {
				init();
				const fp = elem.flatpickr({
					defaultDate: "2007-03-04T21:08:12",
					enableTime: true,
					enableSeconds: true
				});

				expect(fp.selectedDateObj).toBeDefined();
				expect(fp.selectedDateObj.getFullYear()).toEqual(2007);
				expect(fp.selectedDateObj.getMonth()).toEqual(2);
				expect(fp.selectedDateObj.getDate()).toEqual(4);
				expect(fp.selectedDateObj.getHours()).toEqual(21);
				expect(fp.selectedDateObj.getMinutes()).toEqual(8);
				expect(fp.selectedDateObj.getSeconds()).toEqual(12);
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

				expect(fp.selectedDateObj).toBeDefined();
				expect(fp.selectedDateObj.getHours()).toEqual(21);
				expect(fp.selectedDateObj.getMinutes()).toEqual(11);
				expect(fp.selectedDateObj.getSeconds()).toEqual(12);
			});

			it('should parse "11:59 PM"', () => {
				init();
				elem.value = '11:59 PM';
				const fp = elem.flatpickr({
					allowInput: true,
					enableTime: true,
					noCalendar: true,
				});

				expect(fp.selectedDateObj).toBeDefined();
				expect(fp.selectedDateObj.getHours()).toBe(23);
				expect(fp.selectedDateObj.getMinutes()).toBe(59);
				expect(fp.selectedDateObj.getSeconds()).toBe(0);

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

				expect(fp.selectedDateObj).toBeDefined();
				expect(fp.selectedDateObj.getHours()).toBe(15);
				expect(fp.selectedDateObj.getMinutes()).toBe(5);
				expect(fp.selectedDateObj.getSeconds()).toBe(3);

				const amPmElement = fp.amPM;

				expect(amPmElement).toBeDefined();
				expect(amPmElement.innerHTML).toBe('PM');
			});

		});

	});
});
