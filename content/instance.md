+++
weight = "4"
date = "2017-03-03"
title = "The Flatpickr Instance"
slug = "instance-methods-properties-elements"
description = "Methods and properties of flatpickr instances"
+++

## Properties

### selectedDates
The array of selected dates (Date objects).

### currentYear
The year currently displayed on the calendar.

### currentMonth
The zero-indexed month number (0-11) currently displayed on the calendar.

### config
The configuration object (defaults + user-specified options).

## Methods

### `changeMonth(monthNum, is_offset = true)`

Changes the current month.

    let calendar = new Flatpickr(yourElement, config);
    calendar.changeMonth(1); // go a month ahead
    calendar.changeMonth(-2); // go two months back

    calendar.changeMonth(0, false); // go to January


### `clear()`
Resets the selected dates (if any) and clears the input.


### `close()`
Closes the calendar.


### `destroy()`

Destroys the Flatpickr instance, cleans up - removes event listeners, restores inputs, etc.

### `formatDate(dateObj, formatStr)`

`dateObj` is a Date, and `formatStr` is a string consisting of formatting tokens.

**Return Value**
A string representation of`dateObj`,  formatted as per `formatStr`


### `jumpToDate(date)`

Sets the calendar view to the year and month of`date`, which can be a date string, a Date, or nothing.

If`date`is undefined, the view is set to the latest selected date, the `minDate`, or today's date


### `open()`
Shows/opens the calendar.


### `parseDate(date)`
Parses a date string or a timestamp, and returns a Date.


### `redraw()`
Redraws the calendar. Shouldn't be necessary in most cases.

### `set(option, value)`

Sets a config option `option`to `value`, redrawing the calendar and updating the current view, if necessary.

### `setDate(date, triggerChange)`

Sets the current selected date(s) to`date`, which can be a date string, a Date, or an`Array` of the Dates.

Optionally, pass false as the second argument to force any onChange events not to fire.


### `toggle()`
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
