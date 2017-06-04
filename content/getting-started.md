+++
weight = "2"
date = "2017-03-03"
title = "Getting Started"
description = "flatpickr installation and usage"
+++

## Installation

### Installing a flatpickr module

flatpickr is available on npm and bower. Use either one to easily stay up to date with new features and (inevitably) bugfixes.

```sh
# using npm install
npm i flatpickr --save

# bower
bower install flatpickr-calendar --save

# or, if you like yarn better
yarn add flatpickr
```

### Non-module environments

If, for any reason, you are constained to a non-module environment (e.g. no bundlers such as webpack) - don't fret. I suggest simply pulling the latest version of `flatpickr` from `unpkg`.

```html
<link rel="stylesheet" href="https://unpkg.com/flatpickr/dist/flatpickr.min.css">
<script src="https://unpkg.com/flatpickr"></script>
```


## Usage

If you're using a bundler, e.g. `webpack`, you'll need to import flatpickr.

```js
const flatpickr = require("flatpickr");
```

All of the following are valid ways to create flatpickr instance.

```javascript
flatpickr("#myID", {});
flatpickr(".myClass", {}); // creates multiple instances
flatpickr(element, {}); // https://developer.mozilla.org/en-US/docs/Web/API/Element
```

Configuration is optional and passed in an object `{}`.

### jQuery

If you have jQuery, flatpickr is available as a plugin.
Simply

```js
$(".selector").flatpickr(optional_config);
```
