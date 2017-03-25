+++
date = "2017-03-25T20:23:43-05:00"
title = "Plugins"
weight = "9"
+++

Plugins are in essentially a set of [hooks](/events-hooks), that receive a config object (optionally) and a [flatpickr instance](/instance-methods-properties-elements/)

Functionality requested by users that doesn't make it to core usually ends up in a plugin. The `flatpickr` repo comes with a few [plugins](https://github.com/chmln/flatpickr/tree/master/dist/plugins).

## `confirmDate`

Provides a visual cue for users after selecting either:

- date + time
- multiple dates

```js
{
    "enableTime": true,
    "plugins": [new confirmDatePlugin({})]
}
```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="confirmDate">

A spiffy SVG icon is included, along with sane defaults, but you can customize them.

Here are all the available options:

```js
{
    confirmIcon: "<i class='fa fa-check'></i>", // your icon's html, if you wish to override
    confirmText: "OK ",
    showAlways: false,
    theme: "light" // or "dark"
}
```

## `weekSelect`

For selecting a week.

```js
new Flatpickr({
    "plugins": [new weekSelectPlugin({})],
    "onChange": [function(){
        // extract the week number
        // note: "this" is bound to the flatpickr instance
        const weekNumber = this.selectedDates[0]
            ? this.config.getWeek(this.selectedDates[0])
            : null;

        console.log(weekNumber);
    }]
});


```

<input class=flatpickr type="text" placeholder="Select Date.." data-id="weekSelect">
