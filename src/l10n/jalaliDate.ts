class Jalalidate extends Date {
  jalaliToGregorian(j_y: number|string, j_m: number|string, j_d: number|string): number[] {
    var self: any = this;
	  
    var jy = parseInt(String(j_y), 10) - 979;
    var jm = parseInt(String(j_m), 10) - 1;
    var jd = parseInt(String(j_d), 10) - 1;

    var j_day_no = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor((jy % 33 + 3) / 4);
    for (var i = 0; i < jm; ++i) j_day_no += self.j_days_in_month[i];

    j_day_no += jd;

    var g_day_no = j_day_no + 79;

    var gy = 1600 + 400 * Math.floor(g_day_no / 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
    g_day_no = g_day_no % 146097;

    var leap = true;
    if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */ {
          g_day_no--;
          gy += 100 * Math.floor(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
          g_day_no = g_day_no % 36524;

          if (g_day_no >= 365)
              g_day_no++;
          else
              leap = false;
    }

    gy += 4 * Math.floor(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
    g_day_no %= 1461;

    if (g_day_no >= 366) {
      leap = false;

      g_day_no--;
      gy += Math.floor(g_day_no / 365);
      g_day_no = g_day_no % 365;
    }

    for (var i = 0; g_day_no >= self.g_days_in_month[i] + ((i == 1 && leap) ? 1 : 0) ; i++)
      g_day_no -= self.g_days_in_month[i] + ((i == 1 && leap) ? 1 : 0);
    var gm = i + 1;
    var gd = g_day_no + 1;

    return [gy, gm, gd];
  }

  checkDate(j_y: number, j_m: number, j_d: number): boolean {
    var self: any = this;
    return !(j_y < 0 || j_y > 32767 || j_m < 1 || j_m > 12 || j_d < 1 || j_d >
      (self.j_days_in_month[j_m - 1] + ((j_m == 12 && !((j_y - 979) % 33 % 4)) ? 1 : 0)));
  }
  
  gregorianToJalali(g_y: number|string, g_m: number|string, g_d: number|string): number[] {
    var self: any = this;
	  
    var gy = parseInt(String(g_y), 10) - 1600;
    var gm = parseInt(String(g_m), 10) - 1;
    var gd = parseInt(String(g_d), 10) - 1;

    var g_day_no = 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400);

    for (var i = 0; i < gm; ++i)
      g_day_no += self.g_days_in_month[i];
    if (gm > 1 && ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0)))
      /* leap and after Feb */
      ++g_day_no;
    g_day_no += gd;

    var j_day_no = g_day_no - 79;

    var j_np = Math.floor(j_day_no / 12053);
    j_day_no %= 12053;

    var jy = 979 + 33 * j_np + 4 * Math.floor(j_day_no / 1461);

    j_day_no %= 1461;

    if (j_day_no >= 366) {
      jy += Math.floor((j_day_no - 1) / 365);
      j_day_no = (j_day_no - 1) % 365;
    }

    for (var i = 0; i < 11 && j_day_no >= self.j_days_in_month[i]; ++i) {
      j_day_no -= self.j_days_in_month[i];
    }
    var jm = i + 1;
    var jd = j_day_no + 1;

    return [jy, jm, jd];
  }
  
  setJalali(): void {
    var self: any = this;
    self.jalalidate = self.gregorianToJalali(self.gregoriandate.getFullYear(), self.gregoriandate.getMonth() + 1, self.gregoriandate.getDate());
    self.jalalidate[1]--;
  }
  
  getDate(): number {
    return (this as any).jalalidate[2];
  }
  
  getDay(): number {
    return (this as any).gregoriandate.getDay();
  }
  
  getFullYear(): number {
    return (this as any).jalalidate[0];
  }

  getHours(): number {
    return (this as any).gregoriandate.getHours();
  }

  getMilliseconds(): number {
    return (this as any).gregoriandate.getMilliseconds();
  }

  getMinutes(): number {
    return (this as any).gregoriandate.getMinutes();
  }
  
  getMonth(): number {
    return (this as any).jalalidate[1];
  }

  getSeconds(): number {
    return (this as any).gregoriandate.getSeconds();
  }
  
  getTime(): number {
    return (this as any).gregoriandate.getTime();
  }

  getTimezoneOffset(): number {
    return (this as any).gregoriandate.getTimezoneOffset();
  }
  
  getUTCDate(): number {
    return (this as any).gregoriandate.getUTCDate();
  }

  getUTCDay(): number {
    return (this as any).gregoriandate.getUTCDay();
  }

  getUTCFullYear(): number {
    return (this as any).gregoriandate.getUTCFullYear();
  }

  getUTCHours(): number {
    return (this as any).gregoriandate.getUTCHours();
  }

  getUTCMilliseconds(): number {
    return (this as any).gregoriandate.getUTCMilliseconds();
  }
  
  getUTCMinutes(): number {
    return (this as any).gregoriandate.getUTCMinutes();
  }

  getUTCMonth(): number {
    return (this as any).gregoriandate.getUTCMonth();
  }
  
  getUTCSeconds(): number {
    return (this as any).gregoriandate.getUTCSeconds();
  }

  getYear(): number {
    return (this as any).gregoriandate.getFullYear() - 1900;
  }

  setDate(day: number): number {
    var self: any = this;
    var diff = -1 * (self.jalalidate[2] - day);
    var g = self.gregoriandate.setDate(self.gregoriandate.getDate() + diff);
    this.setJalali();
    return g;
  }

  setFullYear(year: number, month?: number|undefined, date?: number|undefined): number {
    var self: any = this;
    var m = 0
    var d = 1;
    if (self.jalalidate !== undefined) {
      m = self.jalalidate[1];
      d = self.jalalidate[2];
    }

    if (month !== undefined) m = month;
    var negativeMonth = m < 0;
    if (negativeMonth) m = 0;
    else if (m == 12) {
      year++;
      m = 0;
    }
	  
    if (date !== undefined) d = date;
    var negativeDate = d < 1;
    if (negativeDate) d = 1;

    var gDate = self.jalaliToGregorian(year, m + 1, d);
    var retval = self.gregoriandate.setFullYear(gDate[0], gDate[1] - 1, gDate[2]);
    if (negativeMonth || negativeDate) {
      if (negativeMonth)
        retval = self.gregoriandate.setMonth(self.gregoriandate.getMonth() + month);

      if (negativeDate)
        retval = self.gregoriandate.setDate(self.gregoriandate.getDate() + date - 1);

      this.setJalali();
    }
    else
      self.jalalidate = [year, m, d];

    return retval;
  }

  setHours(hour: number, min: number, sec: number, millisec: number): number {
    var self: any = this;
    var retval;
    if (min == undefined)
      retval = self.gregoriandate.setHours(hour);
    else if (sec == undefined)
      retval = self.gregoriandate.setHours(hour, min);
    else if (millisec == undefined)
      retval = self.gregoriandate.setHours(hour, min, sec);
    else
      retval = self.gregoriandate.setHours(hour, min, sec, millisec);

    this.setJalali();
    return retval;
  }

  setMilliseconds(m: number): number {
    var retval = (this as any).gregoriandate.setMilliseconds(m);
    this.setJalali();
    return retval;
  }

  setMinutes(m: number): number {
    var retval = (this as any).gregoriandate.setMinutes(m);
    this.setJalali();
    return retval;
  }

  setMonth(month: number, date?: number|undefined): number {
    var self: any = this;
    var y = self.jalalidate[0];
    var m = parseInt(String(month), 10);
    var d = self.jalalidate[2];

    if (date !== undefined) {
      var dTemp = parseInt(String(date), 10);
      if (!isNaN(dTemp)) d = dTemp;
    }

    return this.setFullYear(y, m, d);
  }

  setSeconds(s: number, m: number): number {
    var retval = m != undefined ? (this as any).gregoriandate.setSeconds(s, m) : (this as any).gregoriandate.setSeconds(s);
    this.setJalali();
    return retval;
  }

  setTime(m: number): number {
    var retval = (this as any).gregoriandate.setTime(m);
    this.setJalali();
    return retval;
  }

  setUTCDate(d: number): number {
    return (this as any).gregoriandate.setUTCDate(d);
  }

  setUTCFullYear(y: number, m: number, d: number): number {
    return (this as any).gregoriandate.setUTCFullYear(y, m, d);
  }

  setUTCHours(h: number, m: number, s: number, mi: number): number {
    return (this as any).gregoriandate.setUTCHours(h, m, s, mi);
  }

  setUTCMilliseconds(m: number): number {
    return (this as any).gregoriandate.setUTCMilliseconds(m);
  }

  setUTCMinutes(m: number, s: number, mi: number): number {
    return (this as any).gregoriandate.setUTCMinutes(m, s, mi);
  }

  setUTCMonth(m: number, d: number): number {
    return (this as any).gregoriandate.setUTCMonth(m, d);
  }

  setUTCSeconds(s: number, m: number): number {
    return (this as any).gregoriandate.setUTCSeconds(s, m);
  }

  toDateString(): string {
    var self: any = this;
    return self.jalalidate[0] + "/" + self.jalalidate[1] + "/" + self.jalalidate[2];
  }

  toISOString(): string {
    return (this as any).gregoriandate.toISOString();
  }

  toJSON(): string {
    return this.toDateString();
  }

  toLocaleDateString(): string {
    return this.toDateString();
  }

  toLocaleTimeString(): string {
    return (this as any).gregoriandate.toLocaleTimeString();
  }

  toLocaleString(): string {
    return this.toDateString() + " " + this.toLocaleTimeString();
  }

  toString(): string {
    return this.toLocaleString();
  }

  toTimeString(): string {
    return this.toLocaleTimeString();
  }

  toUTCString(): string {
    return (this as any).gregoriandate.toUTCString();
  }

  valueOf(): number {
    return (this as any).gregoriandate.valueOf();
  }

  static UTC(y: number, m: number, d: number, h: number, mi: number, s: number, ml: number): number {
    return Date.UTC(y, m, d, h, mi, s, ml);
  }
  
  static parse(datestring: string): number {
    try {
      if (datestring.indexOf("Date(") > -1) {
        var date = new Date(parseInt(datestring.replace(/^\/Date\((.*?)\)\/$/, "$1"), 10));
        var y = new Jalalidate(date).getFullYear(),
            m = new Jalalidate(date).getMonth(),
            d = new Jalalidate(date).getDate();
        return new Jalalidate(y, m, d).getTime();
      }
      else {
        var y = parseInt(datestring.substring(0, 4)),
            m = parseInt(datestring.substring(5, 7)),
            d = parseInt(datestring.substring(8, 10));
        return new Jalalidate(y, m - 1, d).getTime();
      }
    } catch (e) {
      return new Jalalidate(1300, 1, 1).getTime();
    }
  }
  
  constructor(year?: number|string|Date|undefined, month?: number|undefined, day?: number|undefined, hours?: number|undefined, minutes?: number|undefined, seconds?: number|undefined, miliseconds?: number|undefined) {
    super();
	  
    // Set the prototype explicitly.
    var self: any = {};
    Object.setPrototypeOf(self, Jalalidate.prototype);
	  
    self.g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    self.j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    self.gregoriandate = new Date();
    self.jalalidate = [];
	  
    if (year !== undefined) {
      switch(typeof (year)) {
        case "string":
          self.gregoriandate = new Date(year);
          break;
        case "object":
          if (year instanceof Jalalidate)
            self.gregoriandate = new Date((year as any).gregoriandate.getTime());
          else if (year instanceof Date)
            self.gregoriandate = new Date(year.getTime());
          break;
        case "number":
          if (month === undefined) {
            self.gregoriandate.setTime(year);
          }
          else {
            if (day === undefined) day = 1;
            if (year == 1900 || year == 2099)
              self.gregoriandate.setFullYear(year, month, day);
            else
              self.setFullYear(year, month, day);

            if (hours === undefined) hours = 0;
            if (minutes === undefined) minutes = 0;
            if (seconds === undefined) seconds = 0;
            if (miliseconds === undefined) miliseconds = 0;
            self.setHours(hours, minutes, seconds, miliseconds);
          }
          break;
      }
    }

    self.setJalali();  
    return self;
  }
}

export default Jalalidate;
