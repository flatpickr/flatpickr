+++
date = "2017-04-09T20:23:43-05:00"
title = "Themes"
weight = "10"
+++

<label for=themes>Select Theme:</label>
<select id=themes>
    <option value="">Default</option>
</select>

<input class=flatpickr type="text" placeholder="Select Date.." data-id="datetime">

<hr>

## Usage

To use a theme of your choice, simply load its corresponding CSS file.

For webpack builds and similar, you'd do something like:

```js
require("flatpickr/dist/themes/dark.css");
```


### Themes in browser environments
Otherwise, if you're constrained to a browser, just link the CSS file as a regular stylesheet.

```html
<link rel="stylesheet" type="text/css" href="https://npmcdn.com/flatpickr/dist/themes/dark.css">
```

## Available Themes

Available theme names are listed in the theme selector on top of the page.
