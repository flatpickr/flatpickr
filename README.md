## flatpickr

![calendar](https://cloud.githubusercontent.com/assets/11352152/9289678/d5f5977c-4346-11e5-8193-d028412e4d8d.PNG)

Demos and Usage: http://chmln.github.io/flatpickr

### Introduction

A super lightweight (only 2.75kb minified and gzipped), feature-packed date picker with no external dependencies.



### How to Use

The easiest way to start:

```
flatpickr('#inputElementId');
```

Obviously replace 'inputElementId' with the actual id of the input element you will be using.

You can pass in any selector that is supported by [querySelectorAll](https://developer.mozilla.org/en/docs/Web/API/Document.querySelectorAll) (by default, more on this below):

```
flatpickr('#some .complex [selector]');
```

You can also pass in a node directly:

```
flatpickr(document.getElementById('myId'));
```

### Config Options

You can also customize each flatpickr instance by passing in some extra config options. The default values that can be overridden are:

| Config Option | Type | Default | Description |
| ------------- | ----------- | ------------- | ------------- |
| dateFormat | string | 'F j, Y' | A string of characters which are used to define how the date will be displayed in the input box. Very similar to the PHP date function, but with less options. The supported characters are defined below. |
| altInput | node | null | A reference to another input element. This can be useful if you want to show the user a readable date, but return something totally different to the server. |
| altFormat | string | null | Exactly the same as date format, but for the altInput field |
| minDate | integer | Date() | The minimum date that a user can start picking from, as a JavaScript Date. See (https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date) |
| maxDate | integer | Date() | The maximum date that a user can pick to, as a JavaScript Date. See (https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date) |
| disable | array | null | Dates to disable, using intervals |
| shorthandCurrentMonth | boolean | false | Show the month using the shorthand version. I don't know if this is very useful, but maybe? |

Change the default date format:

```
<script>
    flatpickr('.someClassName', { dateFormat: 'd-m-Y' });
</script>
```

Specify a min and max date:

```
<script>
    flatpickr('#minAndMax', {
        // today
        minDate: new Date(),
        // some point in the future
        maxDate: new Date("2015-12-31")
    });
</script>
```

Disable a date range:

```
<script>
    flatpickr('#sampleInput', {
        disable: [ { 'from': '2015-09-02', 'to': '2015-10-02' } ]
    });
</script>
```

Use an alternate input and format:

```
<input id="userInput">
<input id="altInput" type="hidden">

<script>
    flatpickr('#userInput', {
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






### Localization

flatpickr supports localizing text in a similar way to modifying the methods (above).

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
    flatpickr.prototype.l10n.weekdays.longhand = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    flatpickr('#yourId');
</script>
```

Start the calendar on Monday instead of Sunday:

```
<script>
    flatpickr.prototype.l10n.firstDayOfWeek = 1;
    flatpickr('#yourId');
</script>
```


