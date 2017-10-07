+++
title = "Events & Hooks"
weight = "5"
description = "flatpickr event and hooks API"
date="2017-03-03"
+++

## Events

flatpickr has 5 event hooks for the most common and useful actions. For each hook, you may specify a single function, or an array of functions. Callback arguments are explained below.

`selectedDates` is an array of Date objects selected by the user. When there are no dates selected, the array is empty.

`dateStr` is a string representation of the latest selected Date object by the user. The string is formatted as per the`dateFormat`option.

`instance` is the flatpickr object, containing various methods and properties.

## Hooks

### `onChange`

onChange gets triggered when the user selects a date, or changes the time on a selected date.

### `onOpen`

onOpen gets triggered when the calendar is opened.

### `onClose`

onClose gets triggered when the calendar is closed.

### `onMonthChange`

onMonthChange gets triggered when the month is changed, either by the user or programmatically.

### `onYearChange`

onMonthChange gets triggered when the year is changed, either by the user or programmatically.

```javascript

{
    onChange: function(selectedDates, dateStr, instance) {
        //...
    },
    onOpen: [
        function(selectedDates, dateStr, instance){
            //...
        },
        function(selectedDates, dateStr, instance){
            //...
        }
    ],
    onClose: function(selectedDates, dateStr, instance){
       // ...
    }
}
```


### `onReady`

onReady gets triggered once the calendar is in a ready state.

### `onValueUpdate`

onValueUpdate gets triggered when the input value is updated with a new date string.

### `onDayCreate`

Take full control of every date cell with the`onDayCreate()`hook.

```js
{
    onDayCreate: function(dObj, dStr, fp, dayElem){
        // Utilize dayElem.dateObj, which is the corresponding Date

        // dummy logic
        if (Math.random() < 0.15)
            dayElem.innerHTML += "<span class='event'></span>";

        else if (Math.random() > 0.85)
            dayElem.innerHTML += "<span class='event busy'></span>";
    }
}
```

Every flatpickr day has `relative` positioning, which makes it easier to position indicators as we'd like.

```css
.event {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 150px;
    bottom: 3px;
    left: calc(50% - 1.5px);
    content: " ";
    display: block;
    background: #3d8eb9;
}

.event.busy {
    background: #f64747;
}
```

<style>
.event {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 150px;
    bottom: 3px;
    left: calc(50% - 1.5px);
    content: " ";
    display: block;
    background: #3d8eb9;
}

.event.busy {
    background: #f64747;
}
</style>

<input data-id="onDayCreate" type="text" placeholder="Select date" class="flatpickr">
