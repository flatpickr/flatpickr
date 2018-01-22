+++
date = "2017-04-23T20:23:43-05:00"
title = "Updating from flatpickr v2"
weight = "13"
+++

Breaking changes in flatpickr v3 have been kept to a minimum to ensure an easy upgrade path for users.

## Deprecation of the utc option

### Motivation

The `utc` option was a hack using date manipulation.
<br>It didn't yield the correct timezone.
<br>Resulting dates were not always accurate.

### Upgrade path

Use the `dateFormat: "Z"` option, which is a shortcut for the ISO date format.
<br>It contains the correct timezone information and is supported by nearly every database.

Additionally I recommend using the `altInput: true` option to display a nicer date to the user.
<br>Any existing date formats using a `Z` must be escaped `dateFormat: "dHi\\Z M y"`.

## Simplified invocation

### Motivation

In `v2`, users would often get confused about which invocation syntax to use.
<br>There was `new Flatpickr()` which only supported elements and `flatpickr()` which only supported selector strings.

It wasn't always easy to remember, and the two are now merged in `v3`.

### Upgrade path

For those using `flatpickr` with `require()` (webpack and other bundlers) - great!
<br>There is nothing to change and you can safely upgrade to `v3`.

For those using `flatpickr` with `<script src=".../flatpickr.js"...` - only a single change is necessary.
<br>Simply find and replace `Flatpickr` with `flatpickr` in your scripts.

Note that this also includes statements like `Flatpickr.defaultConfig...`.
<br>Just swap out `Flatpickr` for `flatpickr` and you're good to go.
