+++
weight = "2"
date = "2017-03-03"
title = "Getting Started"
description = "flatpickr installation and usage"
+++

## Installation

### Installing a flatpickr module

flatpickr is delivered primarily via npm.

Bower users: please use https://www.npmjs.com/package/bower-npm-resolver

```sh
# using npm install
npm i flatpickr --save
```

### Non-module environments

If, for any reason, you are constained to a non-module environment (e.g. no bundlers such as webpack) - don't fret. I suggest simply pulling the latest version of `flatpickr` from `jsdelivr`.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
```


## Usage

If you're using a bundler, e.g. `webpack`, you'll need to import flatpickr.

```ts
// commonjs
const flatpickr = require("flatpickr");

// es modules are recommended, if available, especially for typescript
import flatpickr from "flatpickr";
```

All of the following are valid ways to create flatpickr instance.

```js
// If using flatpickr in a framework, its recommended to pass the element directly
flatpickr(element, {});

// Otherwise, selectors are also supported
flatpickr("#myID", {});

// creates multiple instances
flatpickr(".anotherSelector");


```

Configuration is optional and passed in an object `{}`.

### jQuery

If you have jQuery, flatpickr is available as a plugin.
Simply

```js
$(".selector").flatpickr(optional_config);
```
