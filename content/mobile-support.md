+++
date = "2017-04-23T20:23:43-05:00"
title = "Mobile Support"
weight = "11"
+++

## Native DateTime Input

When `flatpickr` detects a mobile browser, it turns the date input into a native date/time/datetime input.

Native datetime selection provides a UX that's familiar to the user and is superior to most web-based solutions.

There is no extra configuration necessary. However, native datetime selection is limited to the following features:

- Preloading a date/time/datetime
- minDate
- maxDate

Callbacks like `onChange` work as well.

Thus due to missing functionality in native datetime selection, using certain features (e.g. disabling only specific dates) 
will prevent native datetime selection and fall back to flatpickr instead.

If you'd like to disable native datetime inputs in all cases (not recommended), use the `disableMobile` option.

```js
{
    disableMobile: "true"
}
```