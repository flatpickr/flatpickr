+++
weight = 2
date = "2017-02-15"
title = "Getting Started"
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

### Using the flatpickr **module**

This is the recommended method if you can `require` packages on front end

```javascript
const Flatpickr = require("flatpickr");
new Flatpickr(element, optional_config);
```

where `element` is a [node](https://developer.mozilla.org/en-US/docs/Web/API/Element). 

Configuration is optional and passed in an object`{}`.

### Non-module environments

The above syntax works just as well for non-module environments. Make sure the flatpickr's script is included, and the `Flatpickr` variable will be available.

Additionally, flatpickr registers a helper function to make invocation easier.

```js
flatpickr(".mySelector", optional_config);
```

### jQuery

If you have jQuery, flatpickr is available as a plugin.
Simply

```js
$(".selector").flatpickr(optional_config);
```
