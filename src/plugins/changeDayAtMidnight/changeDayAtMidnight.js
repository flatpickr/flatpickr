function changeDayAtMidnightPlugin() {

  function changeDateIfMidnight(date, ev, fp) {
    var newHours = date.getHours();

    // Clock has advanced past the end of the day - advance the date
    if (newHours == 0 && ev.oldHours == 23) {
      date.setDate(date.getDate() + 1);
      fp.setDate(date, false);
    }
    // Clock has gone back past the start of the day - take the date back
    else if (newHours == 23 && ev.oldHours == 0) {
      date.setDate(date.getDate() - 1);
      fp.setDate(date, false);
    }

  }

  return function(fp) {
    return {
      onTimeChange(dates, _, __, ev) {
        changeDateIfMidnight(dates[0], ev, fp);
      }
    }
  }
}

if (typeof module !== "undefined")
	module.exports = changeDayAtMidnightPlugin;
