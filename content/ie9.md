+++
date = "2017-04-23T20:23:43-05:00"
title = "Usage in IE9"
weight = "12"
+++

flatpickr should work out-of-the-box in IE10+, Safari 6+, Firefox, and Chrome.

### IE9

flatpickr depends on `classList` which is absent from IE9, thus if you're targeting IE9
you will need to include a [polyfill](https://www.npmjs.com/package/classlist-polyfill).

Additionally, flatpickr has [specific styles for IE9](https://npmcdn.com/flatpickr/dist/ie.css).

Make sure to include that as well, utilizing browser detection.

For instance,

```html
<!--[if IE 9]>
<link rel="stylesheet" type="text/css" href="https://npmcdn.com/flatpickr/dist/ie.css">
<![endif]-->
```

If you're using a bundler like webpack, see [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin/issues/155)