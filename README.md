## datepickr

A simple JavaScript date picker

Sample implementations: http://joshsalverda.github.io/datepickr

### Introduction

A simple, powerful, lightweight (only 6KB minified, 8KB including CSS), feature-packed date picker with no external dependencies.

A lot has changed since the last version, hopefully for the better. Many new features and some bug fixes.

### Details

The simplest method to get up and running:

```
datepickr('#inputElementId');
```

Obviously replace 'inputElementId' with the actual id of the input element you will be using.

What's new is that you can pass in any selector that is supported by [querySelectorAll](https://developer.mozilla.org/en/docs/Web/API/Document.querySelectorAll) (by default, more on this below):

```
datepickr('#some .complex [selector]');
```

You can also pass in a node directly:

```
datepickr(document.getElementById('myId'));
```

##### Misc.

If your input has a value attribute on page load, or anytime before the datepickr instance is created, then datepickr will use that date as the default selected one. As long as Date.parse can read the value.

For February, the datepickr code automatically handles checking for a leap year. This may not be ideal for localization so it may change in the future. I will need to investigate this further.

datepickr is minified using the Google Closure Compiler.

### Browser Support

The out-of-the-box browser support is every browser except for IE9 and lower.

WHAT! BUT MY CALENDERZ NEED TO WORK ON IE6!

Whoa, whoa, hold on. So, IE6 might be stretching it a bit (maybe, I haven't tested it), but you could get datepickr to work on IE7 and up. How, you ask...? (continued in next section)

### Modifying datepickr methods

If you don't care about supporting older browsers you can skip this section.

I've tried to make it as easy as possible to modify some of the base methods to support older browsers, if necessary:

| Method | Description | Parameters |
| ------------- | ----------- | ------------- |
| hasClass | Whether an element contains a class or not (should return a boolean) | element, className |
| addClass | Adds a class to an element | element, className |
| removeClass | Removes a class from an element | element, className |
| forEach | Iterate over an array | items, callback |
| querySelectorAll | Should return an array of elements that were matched by the selector | selector |
| isArray | Is this thing an array? | object |
| addEventListener | Adds an event listener to an element | element, type, listener, useCapture |
| removeEventListener | Removes an event listener | element, type, listener, useCapture |

To do this you will need to do some JavaScript magic, for example:

```
<script>
    datepickr.prototype.addClass = function (element, className) { element.className += ' ' + className; };
    datepickr('#yourId');
</script>
```

That was easy. Of course implementing a proper shim might be better, but the above would work in all browsers.

This can be done for all of the methods listed above.

For example, if you wanted to use jQuery to select the elements for some reason:

```
<script>
    datepickr.prototype.querySelectorAll = jQuery;
    datepickr('.some #crazy [selector]');
</script>
```

If you're not sure what's going on above, that's fine, but then I would recommend getting some help with the implementation. It could get quite complex.

### Localization

Datepickr supports localizing text in a similar way to modifying the methods (above).

| Property | Type | Default | Description |
| ------------- | ----------- | ------------- | ------------- |
| l10n.weekdays.shorthand | array | ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] | The shortened version of each weekday, starting with Sunday |
| l10n.weekdays.longhand | array | ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] | The long version of each weekday, starting with Sunday |
| l10n.months.shorthand | array | ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] | Shortened version of each month, starting with January |
| l10n.months.longhand | array | ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] | Long version of each month, starting with January |
| l10n.daysInMonth | array | [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] | How many days in each month, starting with January |
| l10n.firstDayOfWeek | integer | 0 | Start the calendar on a different weekday (0 = Sunday, 1 = Monday, 2 = Tuesday, etc.) |

Weekdays in french:

```
<script>
    datepickr.prototype.l10n.weekdays.longhand = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    datepickr('#yourId');
</script>
```

Start the calendar on Monday instead of Sunday:

```
<script>
    datepickr.prototype.l10n.firstDayOfWeek = 1;
    datepickr('#yourId');
</script>
```

### Config Options

You can also customize each datepickr instance by passing in some extra config options. The default values that can be overridden are:

| Config Option | Type | Default | Description |
| ------------- | ----------- | ------------- | ------------- |
| dateFormat | string | 'F j, Y' | A string of characters which are used to define how the date will be displayed in the input box. Very similar to the PHP date function, but with less options. The supported characters are defined below. |
| altInput | node | null | A reference to another input element. This can be useful if you want to show the user a readable date, but return something totally different to the server. |
| altFormat | string | null | Exactly the same as date format, but for the altInput field |
| minDate | integer | null | The minimum date that a user can start picking from, as a JavaScript timestamp. I recommend using [getTime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime) |
| maxDate | integer | null | The maximum date that a user can pick from, as a JavaScript timestamp. I recommend using [getTime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime) |
| shorthandCurrentMonth | boolean | false | Show the month using the shorthand version. I don't know if this is very useful, but maybe? |

Change the default date format:

```
<script>
    datepickr('.someClassName', { dateFormat: 'd-m-Y' });
</script>
```

Specify a min and max date:

```
<script>
    datepickr('#minAndMax', {
        // few days ago
        minDate: new Date().getTime() - 2.592e8,
        // few days from now
        maxDate: new Date().getTime() + 2.592e8
    });
</script>
```

Use an alternate input and format:

```
<input id="userInput">
<input id="altInput" type="hidden">

<script>
    datepickr('#userInput', {
        dateFormat: 'l, F d, Y', // Wednesday, January 15, 2014
        altInput: document.getElementById('altInput'),
        altFormat: 'm-d-Y' // 01-15-2014
    });
</script>
```

### Date Format

| Character | Description | Example |
| ------------- | ----------- | ------------- |
| d | Day of the month, 2 digits with leading zeros | 01 to 31 |
| D | A textual representation of a day | Mon through Sun |
| j | Day of the month without leading zeros | 1 to 31 |
| l (lowercase 'L') | A full textual representation of the day of the week | Sunday through Saturday |
| w | Numeric representation of the day of the week | 0 (for Sunday) through 6 (for Saturday) |
| F | A full textual representation of a month | January through December |
| m | Numeric representation of a month, with leading zero | 01 through 12 |
| M | A short textual representation of a month | Jan through Dec |
| n | Numeric representation of a month, without leading zeros | 1 through 12 |
| U | The number of seconds since the Unix Epoch | 1413704993 |
| y | A two digit representation of a year | 99 or 03 |
| Y | A full numeric representation of a year, 4 digits | 1999 or 2003 |

Note: Suffixes have been removed because JavaScript's Date.parse didn't like them.

### Escaping date format characters

To escape a character (if you need to use one of the reserved format characters above) use a double backslash: \\\

Example:

```
dateFormat: '\\Da\\y picke\\d: Y/m/d'
```

To get something like:

**Day picked: 2013/02/12**

If you do not escape the characters you would end up with something like this instead:

**Tuea13 picke12: 2013/02/12**

Which is probably not what you want...
