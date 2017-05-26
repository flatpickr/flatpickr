function changeDayAtMidnightPlugin() {
  var lastSeenHour;

  function setLSH(date) {
    if (date !== undefined) {
      lastSeenHour = date.getHours();
    } else {
      lastSeenHour = undefined;
    }
  }

  function changeDateIfMidnight(date, fp) {
    var newHour = date.getHours();

    // Clock has advanced past the end of the day - advance the date
    if (newHour == 0 && lastSeenHour == 23) {
      date.setDate(date.getDate() + 1);
      fp.setDate(date, false);
    }
    // Clock has gone back past the start of the day - take the date back
    else if (newHour == 23 && lastSeenHour == 0) {
      date.setDate(date.getDate() - 1);
      fp.setDate(date, false);
    }

  }

  return function(fp) {
    return {
      onReady(dates) {
        setLSH(dates[0]);
      },
      onChange(dates) {
        changeDateIfMidnight(dates[0], fp);
        setLSH(dates[0]);
      }
    }
  }
}

if (typeof module !== "undefined")
	module.exports = changeDayAtMidnightPlugin;
