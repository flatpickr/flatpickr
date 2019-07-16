export type Locale = {
  weekdays: {
    shorthand: [string, string, string, string, string, string, string];
    longhand: [string, string, string, string, string, string, string];
  };
  months: {
    shorthand: [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string
    ];
    longhand: [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string
    ];
  };
  daysInMonth: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
  firstDayOfWeek: number;
  ordinal: (nth: number) => string;
  rangeSeparator: string;
  weekAbbreviation: string;
  scrollTitle: string;
  toggleTitle: string;
  amPM: [string, string];
  ariaLabels: {
    year: string;
    hour: string;
    minute: string;
    nextMonthNav: string;
    previousMonthNav: string;
  };
  time_24hr: boolean;
};

export type CustomLocale = {
  ordinal?: Locale["ordinal"];
  daysInMonth?: Locale["daysInMonth"];
  firstDayOfWeek?: Locale["firstDayOfWeek"];
  rangeSeparator?: Locale["rangeSeparator"];
  weekAbbreviation?: Locale["weekAbbreviation"];
  toggleTitle?: Locale["toggleTitle"];
  scrollTitle?: Locale["scrollTitle"];
  ariaLabels?: {
    year?: Locale["ariaLabels"]["year"];
    hour?: Locale["ariaLabels"]["hour"];
    minute?: Locale["ariaLabels"]["minute"];
    nextMonthNav?: Locale["ariaLabels"]["nextMonthNav"];
    previousMonthNav?: Locale["ariaLabels"]["previousMonthNav"];
  };
  amPM?: Locale["amPM"];
  time_24hr?: Locale["time_24hr"];
  weekdays: {
    shorthand: [string, string, string, string, string, string, string];
    longhand: [string, string, string, string, string, string, string];
  };
  months: {
    shorthand: [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string
    ];
    longhand: [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string
    ];
  };
};

export type key =
  | "ar"
  | "at"
  | "az"
  | "be"
  | "bg"
  | "bn"
  | "bs"
  | "cat"
  | "cs"
  | "cy"
  | "da"
  | "de"
  | "default"
  | "en"
  | "eo"
  | "es"
  | "et"
  | "fa"
  | "fi"
  | "fo"
  | "fr"
  | "gr"
  | "he"
  | "hi"
  | "hr"
  | "hu"
  | "id"
  | "is"
  | "it"
  | "ja"
  | "ka"
  | "ko"
  | "km"
  | "kz"
  | "lt"
  | "lv"
  | "mk"
  | "mn"
  | "ms"
  | "my"
  | "nl"
  | "no"
  | "pa"
  | "pl"
  | "pt"
  | "ro"
  | "ru"
  | "si"
  | "sk"
  | "sl"
  | "sq"
  | "sr"
  | "sv"
  | "th"
  | "tr"
  | "uk"
  | "vn"
  | "zh"
  | "zh_tw";
