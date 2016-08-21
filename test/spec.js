describe('flatpickr', () => {

	const container = document.querySelector('.container');
	let elem;

	const init = () => {
		container.innerHTML = '<input type="text" class="flatpickr" style="display:none;" />';
		elem = container.querySelector('.flatpickr');
	};
	
	describe('parsing time only in [h:mm A] format', () => {

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

		it('should parse "12:05am"', () => {
			init();
			elem.value = '12:05am';
			const fp = elem.flatpickr({
				allowInput: true,
				enableTime: true,
				noCalendar: true,
			});

			debugger;
			expect(fp.selectedDateObj).toBeDefined();
			expect(fp.selectedDateObj.getHours()).toBe(0);
			expect(fp.selectedDateObj.getMinutes()).toBe(5);
			expect(fp.selectedDateObj.getSeconds()).toBe(0);

			const amPmElement = fp.amPM;

			expect(amPmElement).toBeDefined();
			expect(amPmElement.innerHTML).toBe('AM');
		});
	});


	it('should parse "12:05pm"', () => {
		init();
		elem.value = '12:05pm';
		const fp = elem.flatpickr({
			allowInput: true,
			enableTime: true,
			noCalendar: true,
		});

		debugger;
		expect(fp.selectedDateObj).toBeDefined();
		expect(fp.selectedDateObj.getHours()).toBe(12);
		expect(fp.selectedDateObj.getMinutes()).toBe(5);
		expect(fp.selectedDateObj.getSeconds()).toBe(0);

		const amPmElement = fp.amPM;

		expect(amPmElement).toBeDefined();
		expect(amPmElement.innerHTML).toBe('PM');
	});

	describe('parsing time only in [hh:mm:ss] format', () => {

		it('should properly extract seconds.', () => {
			init();
			elem.value = '10:11:12';
			const fp = elem.flatpickr({
				allowInput: true,
				enableTime: true,
				noCalendar: true,
			});

			expect(fp.selectedDateObj).toBeDefined();
			expect(fp.selectedDateObj.getSeconds()).toEqual(12);
		});
	});
});
