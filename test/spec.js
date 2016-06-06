describe("flatpickr", function() {

	var calendar;

	describe("uDate: parsing in local timezone mode", function() {

		beforeEach(function() {
			calendar = flatpickr(".flatpickr").calendars[0];
		});

		it("should parse a time string", function() {
			expect(calendar.uDate("09:00")).toEqual(jasmine.any(Date));
		});

		it("should parse a datetime string", function() {

			let parsed = calendar.uDate("2016-06-09 09:00");

			expect(parsed).toEqual(jasmine.any(Date));
			expect(parsed.getMinutes()).toEqual(0);
			expect(parsed.getHours()).toEqual(9);
		 	expect(parsed.getDate()).toEqual(9);
		 	expect(parsed.getMonth()).toEqual(5);
		 	expect(parsed.getFullYear()).toEqual(2016);
		});

	});

	describe("uDate: parsing in utc mode", function() {

		beforeEach(function() {
			calendar = flatpickr(".flatpickr", {utc: true}).calendars[0];
		});

		it("should parse a datetime string", function() {

			let parsed = calendar.uDate("Mon Jun 06 2016 00:14:45");

			expect(parsed.getMinutes()).toEqual(14);
			expect(parsed.getHours()).toEqual(4);
		 	expect(parsed.getDate()).toEqual(6);

		});

	});

});
