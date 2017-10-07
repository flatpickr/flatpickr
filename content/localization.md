+++
date = "2017-03-03T20:23:43-05:00"
title = "Localization"
weight = "7"
+++

[Dozens of locales](https://github.com/chmln/flatpickr/tree/master/src/l10n) are available.

flatpickr can be localized per-instance, or globally.


## Using Modules

```js
const flatpickr = require("flatpickr");
const Russian = require("flatpickr/dist/l10n/ru.js").ru;
// or.. import {ru} from "flatpickr/dist/l10n/ru.js"

flatpickr(myElem, {
    "locale": Russian // locale for this instance only
});
```

Localize globally (for all instances):

```js
const Russian = require("flatpickr/dist/l10n/ru.js").ru;
flatpickr.localize(Russian); // default locale is now Russian

flatpickr(myElem);
```


## Localization in a Browser Environment

```html
<script src="https://npmcdn.com/flatpickr/dist/flatpickr.min.js"></script>
<script src="https://npmcdn.com/flatpickr/dist/l10n/ru.js"></script>
```

```js
flatpickr(myElement, {
    "locale": "ru"  // locale for this instance only
});
```

Localize globally (for all instances):

```js
flatpickr.localize(flatpickr.l10ns.ru);
flatpickr("mySelector");
```




You may also wish to modify only certain values of locale.
For instance, to set the first day of the week to Monday:

```js
flatpickr.l10ns.default.firstDayOfWeek = 1; // Monday
```

If you'd like the option to persist regardless of locale, use the `locale` option to override specific fields:

```js
flatpickr(myElem, {
    locale: {
        firstDayOfWeek: 2
    }
});
```
