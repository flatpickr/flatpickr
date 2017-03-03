+++
date = "2017-02-16"
title = "Examples"
weight = 3
+++

Unless otherwise specified, the markup for examples below consists of just an input element, and flatpickr [invocation](/getting-started/#usage) with a given config.

## Basic

`flatpickr` without any config. Some features right off the bat:

- The year is scrollable and can be typed in
- The month name is scrollable

<input class=flatpickr type="text" placeholder="Select Date..">

## DateTime

```js
{
    enableTime: true
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="datetime">

## Human-friendly Dates

`altInput` hides your original input and creates a new one. 

Upon date selection, the original input will contain a `Y-m-d...` string, while the `altInput` will display the date in a more legible, customizable format.

Enabling this option is highly recommended.

```js
{
    altInput: true
}
```

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
    minDate: "2017-04"
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="minDate2017">

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


## Disabling specific dates

If you'd like to make certain dates unavailable for selection, there are multiple methods of doing so.

1. Disabling specific date
2. Disabling a date range
3. Disabling dates using a function

All of those are possible with the `disable` option.

---

1: Disabling specific dates

<input class=flatpickr type="text" placeholder="Select Date.." data-id="disableSpecific">

```js
{
    disable: ["2017-03-30", "2017-05-21", "2017-06-08", new Date(2017, 8, 9) ]
}
```

---

2: Disabling range(s) of dates:

<input class=flatpickr type="text" placeholder="Select Date.." data-id="disableRange">

```js
{
    disable: [
        {
            from: "2017-04-01",
            to: "2017-06-01"
        },
        {
            from: "2017-09-01",
            to: "2017-12-01"
        }
    ]
}
```

---

3: Disabling dates by a function:

The function takes in a Date object, and should return a boolean value.
If the function returns `true`, the date will be disabled.

This flexibility allows you to use any arbitrary logic to disable dates.

<input class=flatpickr type="text" placeholder="Select Date.." data-id="disableFunction">

```js
{
    disable: [
        function(date) {
            // return true to disable

            return (date.getMonth() % 2 === 0 && date.getDate() < 15);

        }
    ]
}
```


## Disabling all dates except select few

This is the `enable` option, which takes in an array of date strings, date ranges and functions. Essentially the same as the `disable` option above, but reversed.

1: Enabling specific dates

<input class=flatpickr type="text" placeholder="Select Date.." data-id="enableSpecific">

```js
{
    enable: ["2017-03-30", "2017-05-21", "2017-06-08", new Date(2017, 8, 9) ]
}
```

---

2: Enabling range(s) of dates:

<input class=flatpickr type="text" placeholder="Select Date.." data-id="enableRange">

```js
{
    enable: [
        {
            from: "2017-04-01",
            to: "2017-06-01"
        },
        {
            from: "2017-09-01",
            to: "2017-12-01"
        }
    ]
}
```

---

3: Enabling dates by a function:

<input class=flatpickr type="text" placeholder="Select Date.." data-id="enableFunction">

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

## Selecting multiple dates

It is possible to select multiple dates.

```js
{
    mode: "multiple"
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="multiple">

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
    disable: [
        function(date) {
            // disable every multiple of 8
            return !(date.getDate() % 8);
        }
    ]
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="rangeDisable">

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
