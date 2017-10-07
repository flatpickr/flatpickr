+++
weight = "4"
date = "2017-03-03"
title = "The flatpickr Instance"
slug = "instance-methods-properties-elements"
description = "Methods and properties of flatpickr instances"
+++

## Retrieving the flatpickr instance

You may store the instance by assigning the result of an [invocation](/getting-started/#usage) to a variable.

Here are a few ways to do it.

```js
const fp = flatpickr("#myID", {}); // flatpickr
```

```js
const myInput = document.querySelector(".myInput");
const fp = flatpickr(myInput, {});  // flatpickr
```

```js
const calendars = flatpickr(".calendar", {});
calendars[0] // flatpickr
```

And if you've forgot to save the instance to a variable

```js
flatpickr("#myInput", {}); // invocation without saving to a var
// ...

const fp = document.querySelector("#myInput")._flatpickr;
```

## Properties

Once you've got the instance in say `fp`, accessing props is as simple as e.g. `fp.currentYear`

### selectedDates
The array of selected dates (Date objects).

### currentYear
The year currently displayed on the calendar.

### currentMonth
The zero-indexed month number (0-11) currently displayed on the calendar.

### config
The configuration object (defaults + user-specified options).

## Methods

### changeMonth(monthNum, is_offset = true)

Changes the current month.
```js
let calendar = flatpickr(yourElement, config);
calendar.changeMonth(1); // go a month ahead
calendar.changeMonth(-2); // go two months back

calendar.changeMonth(0, false); // go to January
```

### clear()
Resets the selected dates (if any) and clears the input.


### close()
Closes the calendar.


### destroy()

Destroys the flatpickr instance, cleans up - removes event listeners, restores inputs, etc.

### formatDate(dateObj, formatStr)

`dateObj` is a Date, and `formatStr` is a string consisting of formatting tokens.

**Return Value**
A string representation of`dateObj`,  formatted as per `formatStr`


### jumpToDate(date)

Sets the calendar view to the year and month of `date`, which can be a date string, a Date, or nothing.

If`date`is undefined, the view is set to the latest selected date, the `minDate`, or today's date


### open()
Shows/opens the calendar.


### parseDate(dateStr, dateFormat)
Parses a date string or a timestamp, and returns a Date.


### redraw()
Redraws the calendar. Shouldn't be necessary in most cases.

### set(option, value)

Sets a config option `option`to `value`, redrawing the calendar and updating the current view, if necessary.

### setDate(date, triggerChange, dateStrFormat)

Sets the current selected date(s) to`date`, which can be a date string, a Date, or an`Array` of the Dates.

Optionally, pass true as the second argument to force any onChange events to fire.
And if you're passing a date string with a format other than your `dateFormat`, provide a `dateStrFormat` e.g. `"m/d/Y"`.


### toggle()
Shows/opens the calendar if its closed, hides/closes it otherwise.



## Elements

### input
The text `input` element associated with `flatpickr`.

### calendarContainer

Self-explanatory. This is the `div.flatpickr-calendar` element.

### prevMonthNav
The "left arrow" element responsible for decrementing the current month.

### nextMonthNav
The "right arrow" element responsible for incrementing the current month.


### currentMonthElement
The `span` holding the current month's name.

### currentYearElement
The `input` holding the current year.


### days
The container for all the day elements. 

## Useful prototype methods

flatpickr exposes its date parser and formatter which don't require an instance to work.

While not as powerful as say `moment.js`, they're functional enough to replace it in most of the basic usecases.

### flatpickr.prototype.parseDate(dateStr, dateFormat)

Returns a `Date` object.

`flatpickr.prototype.parseDate("2016-10-20", "Y-m-d")`

Thu Oct 20 2016 00:00:00

`flatpickr.prototype.parseDate("31/01/1995", "d/m/Y")`

Tue Jan 31 1995 00:00:00

### flatpickr.prototype.formatDate(dateObj, dateFormat)
`flatpickr.prototype.formatDate(new Date(), "Y-m-d h:i K")`

"2017-04-24 11:56 AM"
