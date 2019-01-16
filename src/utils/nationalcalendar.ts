const ONE_DAY = 86400000;
const civilMonth12Length = [
  354,
  355,
  354,
  354,
  355,
  354,
  355,
  354,
  354,
  355,
  354,
  354,
  355,
  354,
  354,
  355,
  354,
  355,
  354,
  354,
  355,
  354,
  354,
  355,
  354,
  355,
  354,
  354,
  355,
  354,
];
const DAYS_IN_GR_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const gFirstRefForUAQ = new Date(1882, 10, 12, 0, 0, 0, 0);
const gLastRefForUAQ = new Date(2174, 10, 25, 23, 59, 59, 999);
const UAQ_MONTH_LENGTH = [
  "101010101010",
  "110101010100",
  "111011001001",
  "011011010100",
  "011011101010",
  "001101101100",
  "101010101101",
  "010101010101",
  "011010101001",
  "011110010010",
  "101110101001",
  "010111010100",
  "101011011010",
  "010101011100",
  "110100101101",
  "011010010101",
  "011101001010",
  "101101010100",
  "101101101010",
  "010110101101",
  "010010101110",
  "101001001111",
  "010100010111",
  "011010001011",
  "011010100101",
  "101011010101",
  "001011010110",
  "100101011011",
  "010010011101",
  "101001001101",
  "110100100110",
  "110110010101",
  "010110101100",
  "100110110110",
  "001010111010",
  "101001011011",
  "010100101011",
  "101010010101",
  "011011001010",
  "101011101001",
  "001011110100",
  "100101110110",
  "001010110110",
  "100101010110",
  "101011001010",
  "101110100100",
  "101111010010",
  "010111011001",
  "001011011100",
  "100101101101",
  "010101001101",
  "101010100101",
  "101101010010",
  "101110100101",
  "010110110100",
  "100110110110",
  "010101010111",
  "001010010111",
  "010101001011",
  "011010100011",
  "011101010010",
  "101101100101",
  "010101101010",
  "101010101011",
  "010100101011",
  "110010010101",
  "110101001010",
  "110110100101",
  "010111001010",
  "101011010110",
  "100101010111",
  "010010101011",
  "100101001011",
  "101010100101",
  "101101010010",
  "101101101010",
  "010101110101",
  "001001110110",
  "100010110111",
  "010001011011",
  "010101010101",
  "010110101001",
  "010110110100",
  "100111011010",
  "010011011101",
  "001001101110",
  "100100110110",
  "101010101010",
  "110101010100",
  "110110110010",
  "010111010101",
  "001011011010",
  "100101011011",
  "010010101011",
  "101001010101",
  "101101001001",
  "101101100100",
  "101101110001",
  "010110110100",
  "101010110101",
  "101001010101",
  "110100100101",
  "111010010010",
  "111011001001",
  "011011010100",
  "101011101001",
  "100101101011",
  "010010101011",
  "101010010011",
  "110101001001",
  "110110100100",
  "110110110010",
  "101010111001",
  "010010111010",
  "101001011011",
  "010100101011",
  "101010010101",
  "101100101010",
  "101101010101",
  "010101011100",
  "010010111101",
  "001000111101",
  "100100011101",
  "101010010101",
  "101101001010",
  "101101011010",
  "010101101101",
  "001010110110",
  "100100111011",
  "010010011011",
  "011001010101",
  "011010101001",
  "011101010100",
  "101101101010",
  "010101101100",
  "101010101101",
  "010101010101",
  "101100101001",
  "101110010010",
  "101110101001",
  "010111010100",
  "101011011010",
  "010101011010",
  "101010101011",
  "010110010101",
  "011101001001",
  "011101100100",
  "101110101010",
  "010110110101",
  "001010110110",
  "101001010110",
  "111001001101",
  "101100100101",
  "101101010010",
  "101101101010",
  "010110101101",
  "001010101110",
  "100100101111",
  "010010010111",
  "011001001011",
  "011010100101",
  "011010101100",
  "101011010110",
  "010101011101",
  "010010011101",
  "101001001101",
  "110100010110",
  "110110010101",
  "010110101010",
  "010110110101",
  "001011011010",
  "100101011011",
  "010010101101",
  "010110010101",
  "011011001010",
  "011011100100",
  "101011101010",
  "010011110101",
  "001010110110",
  "100101010110",
  "101010101010",
  "101101010100",
  "101111010010",
  "010111011001",
  "001011101010",
  "100101101101",
  "010010101101",
  "101010010101",
  "101101001010",
  "101110100101",
  "010110110010",
  "100110110101",
  "010011010110",
  "101010010111",
  "010101000111",
  "011010010011",
  "011101001001",
  "101101010101",
  "010101101010",
  "101001101011",
  "010100101011",
  "101010001011",
  "110101000110",
  "110110100011",
  "010111001010",
  "101011010110",
  "010011011011",
  "001001101011",
  "100101001011",
  "101010100101",
  "101101010010",
  "101101101001",
  "010101110101",
  "000101110110",
  "100010110111",
  "001001011011",
  "010100101011",
  "010101100101",
  "010110110100",
  "100111011010",
  "010011101101",
  "000101101101",
  "100010110110",
  "101010100110",
  "110101010010",
  "110110101001",
  "010111010100",
  "101011011010",
  "100101011011",
  "010010101011",
  "011001010011",
  "011100101001",
  "011101100010",
  "101110101001",
  "010110110010",
  "101010110101",
  "010101010101",
  "101100100101",
  "110110010010",
  "111011001001",
  "011011010010",
  "101011101001",
  "010101101011",
  "010010101011",
  "101001010101",
  "110100101001",
  "110101010100",
  "110110101010",
  "100110110101",
  "010010111010",
  "101000111011",
  "010010011011",
  "101001001101",
  "101010101010",
  "101011010101",
  "001011011010",
  "100101011101",
  "010001011110",
  "101000101110",
  "110010011010",
  "110101010101",
  "011010110010",
  "011010111001",
  "010010111010",
  "101001011101",
  "010100101101",
  "101010010101",
  "101101010010",
  "101110101000",
  "101110110100",
  "010110111001",
  "001011011010",
  "100101011010",
  "101101001010",
  "110110100100",
  "111011010001",
  "011011101000",
  "101101101010",
  "010101101101",
  "010100110101",
  "011010010101",
  "110101001010",
  "110110101000",
  "110111010100",
  "011011011010",
  "010101011011",
  "001010011101",
  "011000101011",
  "101100010101",
  "101101001010",
  "101110010101",
  "010110101010",
  "101010101110",
  "100100101110",
  "110010001111",
  "010100100111",
  "011010010101",
  "011010101010",
  "101011010110",
  "010101011101",
  "001010011101",
];

export function convertToNational(gDate: Date, type: string) {
  if (type === "none" || gDate === undefined) {
    return gDate;
  }

  const CIVIL_EPOC = 1948439.5,
    ASTRONOMICAL_EPOC = 1948438.5,
    GREGORIAN_EPOCH = 1721425.5;
  const year = gDate.getFullYear(),
    month = gDate.getMonth(),
    day = gDate.getDate();
  var nYear, nMonth, nDay, julianDay, days;
  //for civil/tabular
  var isLeapYear = function(gYear) {
    return (gYear % 4 === 0 && gYear % 100 !== 0) || gYear % 400 === 0;
  };
  var startYear = function(gYear) {
    return (gYear - 1) * 354 + Math.floor((3 + 11 * gYear) / 30.0);
  };
  var startMonth = function(gYear, gMonth) {
    return (
      Math.ceil(29.5 * gMonth) +
      (gYear - 1) * 354 +
      Math.floor((3 + 11 * gYear) / 30.0)
    );
  };
  //for uaq
  var checkDiapason = function(date) {
    if (
      date.getTime() < gFirstRefForUAQ.getTime() ||
      date.getTime() > gLastRefForUAQ.getTime()
    ) {
      console.log(
        "You operate with the dates not suitable for current implementation of 'Umm al-Qura' calendar.\nCalendar is switched to 'Civil'"
      );
      return false;
    }
    return true;
  };
  var getDiff = function(gDate) {
    var i;
    var days2 = 50;
    for (i = 1883; i < gDate.getFullYear(); i++) {
      days2 += isLeapYear(i) ? 366 : 365;
    }
    for (i = 0; i < gDate.getMonth(); i++) {
      days2 += DAYS_IN_GR_MONTH[i];
      if (i == 1 && isLeapYear(gDate.getFullYear())) {
        days2++;
      }
    }
    days2 += gDate.getDate();
    return days2;
  };

  if (type === "civil" || type === "tabular") {
    julianDay =
      Math.floor(
        GREGORIAN_EPOCH -
          1 +
          365 * (year - 1) +
          Math.floor((year - 1) / 4) +
          -Math.floor((year - 1) / 100) +
          Math.floor((year - 1) / 400) +
          Math.floor(
            (367 * (month + 1) - 362) / 12 +
              (month + 1 <= 2 ? 0 : isLeapYear(year) ? -1 : -2) +
              day
          )
      ) + 0.5;
    if (type === "tabular") {
      days = julianDay - ASTRONOMICAL_EPOC;
    } else {
      days = julianDay - CIVIL_EPOC;
    }

    nYear = Math.floor((30 * days + 10646) / 10631.0);
    nMonth = Math.ceil((days - 29 - startYear(nYear)) / 29.5);
    nMonth = Math.min(nMonth, 11);
    nDay = Math.ceil(days - startMonth(nYear, nMonth) + 1);
  } else if (type === "Umm al-Qura") {
    if (!checkDiapason(gDate)) {
      return convertToNational(gDate, "civil");
    }

    //var diff = Math.round(Math.abs(gDate.getTime() - gFirstRefForUAQ.getTime()) / ONE_DAY);
    var diff = getDiff(gDate);
    nYear = 1300;
    nDay = 0;
    nMonth = 0;
    var stop = false;
    for (var i = 0; i < UAQ_MONTH_LENGTH.length; i++, nYear++) {
      for (var j = 0; j < 12; j++) {
        days = parseInt(UAQ_MONTH_LENGTH[i][j]) + 29;
        if (diff <= days) {
          nDay = diff /*+ 1*/;

          if (nDay > days) {
            nDay = 1;
            j++;
          }
          if (j > 11) {
            j = 0;
            nYear++;
          }

          nMonth = j;
          stop = true;
          break;
        }
        diff -= days;
      }
      if (stop) {
        break;
      }
    }
  }

  var nDate = new Date(0);
  nDate.setTime(gDate.getTime());
  nDate = saveNationalDate(nDate, nYear, nMonth, nDay);
  return nDate;
}

export function getDaysInNationalMonth(
  month: number,
  year: number,
  type: string
) {
  if (type === "none") {
    return month === 1 &&
      year % 4 === 0 &&
      (year % 100 !== 0 || year % 400 === 0)
      ? 29
      : DAYS_IN_GR_MONTH[month];
  } else if (type === "Umm al-Qura") {
    return 29 + parseInt(UAQ_MONTH_LENGTH[year - 1300][month]);
  }
  if (month % 2 === 0) {
    //civil/tabular
    return 30;
  } else if (month === 11) {
    if (civilMonth12Length[(year - 1) % 30] === 355) {
      return 30;
    } else {
      return 29;
    }
  } else {
    return 29;
  }
}

export function convertToGregorian(
  nYear: number,
  nMonth: number,
  nDay: number,
  type: string
) {
  var date = new Date();
  var nDate = convertToNational(date, type);
  if (type === "none") {
    date.setFullYear(nYear, nMonth, nDay);
    return date;
  }
  var i;
  var days = 0;
  var past =
    nYear < nDate.nYear ||
    (nYear === nDate.nYear && nMonth < nDate.nMonth) ||
    (nYear === nDate.nYear && nMonth === nDate.nMonth && nDay < nDate.nDay);
  if (Math.abs(nDate.nYear - nYear) > 1) {
    for (
      var y = Math.min(nDate.nYear, nYear) + 1;
      y < Math.max(nDate.nYear, nYear);
      y++
    ) {
      if (type === "civil" || type === "tabular") {
        days += civilMonth12Length[(y - 1) % 30];
      } else {
        for (i = 0; i < 12; i++) {
          days += 29 + parseInt(UAQ_MONTH_LENGTH[y - 1300][i]);
        }
      }
    }
  }
  if (nYear !== nDate.nYear || nMonth !== nDate.nMonth) {
    if (!past) {
      days +=
        nDay +
        getDaysInNationalMonth(nDate.nMonth, nDate.nYear, type) -
        nDate.nDay;
    } else {
      days += nDate.nDay + getDaysInNationalMonth(nMonth, nYear, type) - nDay;
    }
  } else {
    days += Math.abs(nDay - nDate.nDay);
  }
  if (nDate.nYear != nYear) {
    if (past) {
      for (i = 0; i < nDate.nMonth; i++) {
        days += getDaysInNationalMonth(i, nDate.nYear, type);
      }
      for (i = 11; i > nMonth; i--) {
        days += getDaysInNationalMonth(i, nYear, type);
      }
    } else {
      for (i = nDate.nMonth + 1; i < 12; i++) {
        days += getDaysInNationalMonth(i, nDate.nYear, type);
      }
      for (i = 0; i < nMonth; i++) {
        days += getDaysInNationalMonth(i, nYear, type);
      }
    }
  } else if (nDate.nMonth != nMonth) {
    if (past) {
      for (i = nMonth + 1; i < nDate.nMonth; i++) {
        days += getDaysInNationalMonth(i, nDate.nYear, type);
      }
    } else {
      for (i = nDate.nMonth + 1; i < nMonth; i++) {
        days += getDaysInNationalMonth(i, nDate.nYear, type);
      }
    }
  }
  var direction = past ? -1 : 1;
  date.setTime(date.getTime() + days * ONE_DAY * direction);
  return date;
}

function saveNationalDate(
  date: Date,
  year: number,
  month: number,
  day: number
) {
  var gDate = new Date(0);
  gDate.setTime(date.getTime());
  return {
    date: gDate,
    nYear: year,
    nMonth: month,
    nDay: day,
  };
}
