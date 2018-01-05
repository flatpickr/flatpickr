+++
date = "2017-03-03"
title = "Examples"
weight = "3"
description = "Examples of various flatpickr options in use"
+++

Unless otherwise specified, the markup for examples below consists of just an input element, and flatpickr [invocation](/getting-started/#usage) with a given config.

## Basic

`flatpickr` without any config.

<input class=flatpickr type="text" placeholder="Select Date..">

## DateTime

```js
{
    enableTime: true,
    dateFormat: "Y-m-d H:i",
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="datetime">

## Human-friendly Dates

`altInput` hides your original input and creates a new one.

Upon date selection, the original input will contain a `Y-m-d...` string, while the `altInput` will display the date in a more legible, customizable format.

Enabling this option is highly recommended.

```js
{
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
}
```

After selecting a date, inspect this input to see how it works.

<input class=flatpickr type="text" placeholder="Select Date.." data-id="altinput">

## Supplying Dates for flatpickr

flatpickr has numerous options that accept date values in a variety of formats. Those are:

- defaultDate
- minDate
- maxDate
- enable/disable

The values accepted by these options all follow the same guidelines.

You may specify those dates in a variety of formats:

- [Date Objects](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date) are always accepted
    + `new Date(2015, 0, 10)`
- [Timestamps](https://en.wikipedia.org/wiki/Unix_time) are always accepted
    + e.g. `1488136398547`
- ISO Date Strings are always accepted
    + e.g. `"2017-02-26T19:40:03.243Z"`
- Date Strings, which **must match the `dateFormat`** chronologically
    + `dateFormat` defaults to `YYYY-MM-DD HH:MM`
    + This means that `"2016"` `"2016-10"`, `"2016-10-20"`, `"2016-10-20 15"`, `"2016-10-20 15:30"` are all valid date strings

- The shortcut `"today"`



## Preloading a Date

The selected date will get parsed from the input's value or the `defaultDate` option.

See [supplying dates](#supplying-dates-for-flatpickr) for valid date examples.


## minDate and maxDate

`minDate` option specifies the **minimum/earliest** date (inclusively) allowed for selection.

`maxDate` option specifies the **maximum/latest** date (inclusively) allowed for selection.


```js
{
    minDate: "2020-01"
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="minDate">

```js
{
    dateFormat: "d.m.Y",
    maxDate: "15.12.2017"
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="maxDateStr">



```js
{
    minDate: "today"
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="minDateToday">

```js
{
    minDate: "today",
    maxDate: new Date().fp_incr(14) // 14 days from now
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="minMaxDateTwoWeeks">


## Disabling dates

If you'd like to make certain dates unavailable for selection, there are multiple methods of doing so.

1. Disabling specific date
2. Disabling a date range
3. Disabling dates using a function

All of those are possible with the `disable` option.

---

### Disabling specific dates

```js
{
    disable: ["2025-01-30", "2025-02-21", "2025-03-08", new Date(2025, 4, 9) ],
    dateFormat: "Y-m-d",
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="disableSpecific">



---

### Disabling range(s) of dates:

```js
{
    dateFormat: "Y-m-d",
    disable: [
        {
            from: "2025-04-01",
            to: "2025-05-01"
        },
        {
            from: "2025-09-01",
            to: "2025-12-01"
        }
    ]
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="disableRange">

---

### Disabling dates by a function:

The function takes in a `Date` object, and should return a `boolean` value.<br>
If the function returns `true`, the date will be disabled.

This flexibility allows us to use any arbitrary logic to disable dates.<br>
The example below disables Saturdays and Sundays.


```js
{
    "disable": [
        function(date) {
            // return true to disable
            return (date.getDay() === 5 || date.getDay() === 6);

        }
    ],
    "locale": {
        "firstDayOfWeek": 1 // start week on Monday
    }
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="disableFunction">


## Disabling all dates except select few

This is the `enable` option, which takes in an array of date strings, date ranges and functions. Essentially the same as the `disable` option above, but reversed.

### Enabling specific dates

```js
{
    enable: ["2025-03-30", "2025-05-21", "2025-06-08", new Date(2025, 8, 9) ]
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="enableSpecific">



---

### Enabling range(s) of dates:

```js
{
    enable: [
        {
            from: "2025-04-01",
            to: "2025-05-01"
        },
        {
            from: "2025-09-01",
            to: "2025-12-01"
        }
    ]
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="enableRange">



---

### Enabling dates by a function:

```js
{
    enable: [
        function(date) {
            // return true to enable

            return (date.getMonth() % 2 === 0 && date.getDate() < 15);

        }
    ]
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="enableFunction">



## Selecting multiple dates

It is possible to select multiple dates.

```js
{
    mode: "multiple",
    dateFormat: "Y-m-d"
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="multiple">

### Preloading multiple dates

```js
{
    mode: "multiple",
    dateFormat: "Y-m-d",
    defaultDate: ["2016-10-20", "2016-11-04"]
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="multiplePreload">

### Customizing the Conjunction

```js
{
    mode: "multiple",
    dateFormat: "Y-m-d",
    conjunction: " :: "
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="multipleCustomConjunction">



## Range Calendar

Select a range of dates using the range calendar.

```js
{
    mode: "range"
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="range">

Note that disabled dates (by either `minDate`, `maxDate`, `enable` or `disable`) will not be allowed in selections.

```js
{
    mode: "range",
    minDate: "today",
    dateFormat: "Y-m-d",
    disable: [
        function(date) {
            // disable every multiple of 8
            return !(date.getDate() % 8);
        }
    ]
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="rangeDisable">

### Preloading range dates

```js
{
    mode: "range",
    dateFormat: "Y-m-d",
    defaultDate: ["2016-10-10", "2016-10-20"]
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="rangePreload">

## Time Picker

```js
{
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="timePicker">

### 24-hour Time Picker

```js
{
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="timePicker24">

### Time Picker w/ Limits

```js
{
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    minDate: "16:00",
    maxDate: "22:30",
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="timePickerMinMaxHours">

### Preloading Time

```js
{
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    defaultDate: "13:45"
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="timePickerPreloading">

## DateTimePicker with Limited Time Range

```js
{
    enableTime: true,
    minTime: "09:00"
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="minTime">

```js
{
    enableTime: true,
    minTime: "16:00",
    maxTime: "22:00"
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="minMaxTime">


## Inline Calendar

Display the calendar in an always-open state with the `inline` option.

```js
{
    inline: true
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="inline">

## Display Week Numbers

Enable the `weekNumbers` option to display the week number in a column left to the calendar.

```js
{
    weekNumbers: true,
    /*
        optionally, you may override the function that
        extracts the week numbers from a Date by
        supplying a getWeek function. It takes in a date
        as a parameter and should return a corresponding string
        that you want to appear left of every week.
    */
    getWeek: function(dateObj) {
        // ...
    }
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="weekNumbers">

## flatpickr + external elements

flatpickr can parse an input group of textboxes and buttons, common in Bootstrap and other frameworks.

This permits additional markup, as well as custom elements to trigger the state of the calendar.

```html
<div class=flatpickr>
    <input type="text" placeholder="Select Date.." data-input> <!-- input is mandatory -->

    <a class="input-button" title="toggle" data-toggle>
        <i class="icon-calendar"></i>
    </a>

    <a class="input-button" title="clear" data-clear>
        <i class="icon-close"></i>
    </a>
</div>
```

```js
{
    wrap: true
}
```


<p class="flatpickr input-group" data-id="strap">
    <input type="text" placeholder="Select Date.." data-input>

    <a class="input-button" style="fill:#444" title="toggle" data-toggle>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M14 2v-1h-3v1h-5v-1h-3v1h-3v15h17v-15h-3zM12 2h1v2h-1v-2zM4 2h1v2h-1v-2zM16 16h-15v-8.921h15v8.921zM1 6.079v-3.079h2v2h3v-2h5v2h3v-2h2v3.079h-15z" fill="#000000" /></svg>
    </a>

    <a class="input-button color-danger" title="clear" data-clear>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 17"><g></g><path d="M9.207 8.5l6.646 6.646-0.707 0.707-6.646-6.646-6.646 6.646-0.707-0.707 6.646-6.646-6.647-6.646 0.707-0.707 6.647 6.646 6.646-6.646 0.707 0.707-6.646 6.646z" fill="#000000" /></svg>
    </a>
</p>
