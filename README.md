## flatpickr - javascript datetime picker
[![Build Status](https://circleci.com/gh/flatpickr/flatpickr/tree/master.svg?style=shield)](https://circleci.com/gh/flatpickr/flatpickr/tree/master)

[![Coverage](https://coveralls.io/repos/github/chmln/flatpickr/badge.svg?branch=master)](https://coveralls.io/github/chmln/flatpickr)
[![npm version](https://badge.fury.io/js/flatpickr.svg)](https://www.npmjs.com/package/flatpickr)
[![CDNJS](https://img.shields.io/cdnjs/v/flatpickr.svg)](https://cdnjs.com/libraries/flatpickr)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=plastic)](https://raw.githubusercontent.com/flatpickr/flatpickr/master/LICENSE.md)
[![Open Source Helpers](https://www.codetriage.com/flatpickr/flatpickr/badges/users.svg)](https://www.codetriage.com/flatpickr/flatpickr)


![blue](https://cloud.githubusercontent.com/assets/11352152/14549371/3cbb65da-028d-11e6-976d-a6f63f32061f.PNG)
![green](https://cloud.githubusercontent.com/assets/11352152/14549373/3cbe975a-028d-11e6-9192-43975f0146da.PNG)
![confetti](https://cloud.githubusercontent.com/assets/11352152/14549440/de9bf55e-028d-11e6-9271-46782a99efea.PNG)
![red](https://cloud.githubusercontent.com/assets/11352152/14549374/3cc01102-028d-11e6-9ff4-0cf208a310c4.PNG)
![default](https://cloud.githubusercontent.com/assets/11352152/14549370/3cadb750-028d-11e6-818d-c6a1bc6349fc.PNG)
![dark](https://cloud.githubusercontent.com/assets/11352152/14549372/3cbc8514-028d-11e6-8daf-ec1ba01c9d7e.PNG)


## Motivation
Almost every large SPA or project involves date and time input. Browser's native implementations of those are inconsistent and limited in functionality. Most other libraries require you to pull in heavy dependencies like jQuery, Bootstrap, and moment.js. I wanted something that was good-looking out of the box, dependency-free, powerful, and extensible.

Feature overview:

- Dependency-free (no bloated bundles)
- Simple, polished UX
- Date + time input
- Range selections
- Ability to select multiple dates
- Can be used as just a time picker
- Display dates in a human-friendly format
- Easily disable specific dates, date ranges, or any date using arbitrary logic
- Week numbers
- 51 locales
- 8 colorful themes (incl. dark and material)
- Numerous plugins
- Libraries available for React, Angular, Vue, Ember, and more

![](https://user-images.githubusercontent.com/11352152/36033089-f37dc1d0-0d7d-11e8-8ec4-c7a56d1ff92e.png)

flatpickr provides more functionality at a fraction of the size of other libraries.

## Compatibility
IE9 and up, Edge, iOS Safari 6+, Chrome 8+, Firefox 6+

## Install & Use

Demos and documentation: https://flatpickr.js.org

See also:
* [angular2+-flatpickr addon](https://github.com/mezoistvan/ng2-flatpickr)
* [angularJS-flatpickr addon](https://www.npmjs.com/package/angular-flatpickr)
* [ember-flatpickr addon](https://www.npmjs.com/package/ember-flatpickr)
* [Preact Component](https://github.com/molnarmark/preact-flatpickr)
* [React Component](https://github.com/coderhaoxin/react-flatpickr)
* [Stimulus.js Controller](https://github.com/adrienpoly/stimulus-flatpickr)
* [Svelte Component](https://github.com/jacobmischka/svelte-flatpickr)
* [vue-flatpickr component](https://github.com/ankurk91/vue-flatpickr-component)

## Contributing

Bug reports, usability issues, feature suggestions and documentation requests are all welcome, please open an issue.

Assistance triaging issues and following up old requests is also welcome. Please consider [subscribing to issues on CodeTriage](https://www.codetriage.com/flatpickr/flatpickr).

If you'd like to fix a bug, add a feature or otherwise contribute to the product, Pull Requests are welcome. Before undertaking significant work, please open an issue to discuss your proposed change and make sure it's in line with the project goals.

### Code Contributions

These steps assume you already have the latest LTS version of [Node.js](https://nodejs.org/en/download/) installed.

0. Fork the repository and Git clone your fork to local
0. Create a feature branch in Git
0. Run `npm install` to install required Node modules
0. Run `npm test` to run the test suite and confirm all tests pass on your machine ![PASS](https://via.placeholder.com/100x40/00FF00/000000?text=PASS)
0. Make your proposed changes, adding tests where applicable
0. If you'd like to test out your changes in a browser, run `npm run-script build` to generate a `/dist` folder containing the compiled resources. Then tweak (or clone) `/index.template.html`, to include the required configuration options, and open it in your browser
0. Run `npm test` to confirm all tests are still passing
0. Commit and raise a PR, explaining the change

## Supporting flatpickr

flatpickr will never change its license, pester users for donations, or engage in other user-hostile behavior.

Nevertheless, if you enjoyed working with this library or if its made your life easier, you can buy me a cup of coffee :)

<a href='https://ko-fi.com/A3381DJ9' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi4.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
