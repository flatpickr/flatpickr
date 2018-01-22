+++
date = "2017-03-03T20:23:43-05:00"
title = "Formatting Tokens"
weight = "7"
description = "Date and time formatting tokens"
+++

Each character in the table below can be used in `dateFormat` and `altFormat` options to achieve the format you need.

## Date Formatting Tokens

<table>
<thead>
<tr>
<th>Character</th>
<th>Description</th>
<th>Example</th>
</tr>
</thead>
<tbody>
<tr>
<td>d</td>
<td>Day of the month, 2 digits with leading zeros</td>
<td>01 to 31</td>
</tr>
<tr>
<td>D</td>
<td>A textual representation of a day</td>
<td>Mon through Sun</td>
</tr>
<tr>
<td>l (lowercase 'L')</td>
<td>A full textual representation of the day of the week</td>
<td>Sunday through Saturday</td>
</tr>
<tr>
<td>j</td>
<td>Day of the month without leading zeros</td>
<td>1 to 31</td>
</tr>
<tr>
<td>J</td>
<td>Day of the month without leading zeros and ordinal suffix</td>
<td>1st, 2nd, to 31st</td>
</tr>
<tr>
<td>w</td>
<td>Numeric representation of the day of the week</td>
<td>0 (for Sunday) through 6 (for Saturday)</td>
</tr>
<tr>
<td>F</td>
<td>A full textual representation of a month</td>
<td>January through December</td>
</tr>
<tr>
<td>m</td>
<td>Numeric representation of a month, with leading zero</td>
<td>01 through 12</td>
</tr>
<tr>
<td>n</td>
<td>Numeric representation of a month, without leading zeros</td>
<td>1 through 12</td>
</tr>
<tr>
<td>M</td>
<td>A short textual representation of a month</td>
<td>Jan through Dec</td>
</tr>
<tr>
<td>U</td>
<td>The number of seconds since the Unix Epoch</td>
<td>1413704993</td>
</tr>
<tr>
<td>y</td>
<td>A two digit representation of a year</td>
<td>99 or 03</td>
</tr>
<tr>
<td>Y</td>
<td>A full numeric representation of a year, 4 digits</td>
<td>1999 or 2003</td>
</tr>
<tr>
<td>Z</td>
<td>ISO Date format</td>
<td>2017-03-04T01:23:43.000Z</td>
</tr>
</tbody>
</table>

## Time Formatting Tokens

<table>
<thead>
<tr>
<th>Character</th>
<th>Description</th>
<th>Example</th>
</tr>
</thead>
<tbody>
<tr>
<td>H</td>
<td>Hours (24 hours)</td>
<td>00 to 23</td>
</tr>
<tr>
<td>h</td>
<td>Hours</td>
<td>1 to 12</td>
</tr>
<tr>
<td>i</td>
<td>Minutes</td>
<td>00 to 59</td>
</tr>
<tr>
<td>S</td>
<td>Seconds, 2 digits</td>
<td>00 to 59</td>
</tr>
<tr>
<td>s</td>
<td>Seconds</td>
<td>0, 1 to 59</td>
</tr>
<tr>
<td>K</td>
<td>AM/PM</td>
<td>AM or PM</td>
</tr>
</tbody>
</table>

## Escaping Formatting Tokens

You may escape formatting tokens using `\\`.

```js
{
    dateFormat: "Y-m-d\\Z", // Displays: 2017-01-22Z
}
```
