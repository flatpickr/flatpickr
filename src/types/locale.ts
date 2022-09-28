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
  yearAriaLabel: string;
  monthAriaLabel: string;
  hourAriaLabel: string;
  minuteAriaLabel: string;
  time_24hr: boolean;
  localeYearAdjustment: number;
};

export type CustomLocale = {
  ordinal?: Locale["ordinal"];
  daysInMonth?: Locale["daysInMonth"];
  firstDayOfWeek?: Locale["firstDayOfWeek"];
  rangeSeparator?: Locale["rangeSeparator"];
  weekAbbreviation?: Locale["weekAbbreviation"];
  toggleTitle?: Locale["toggleTitle"];
  scrollTitle?: Locale["scrollTitle"];
  yearAriaLabel?: string;
  monthAriaLabel?: string;
  hourAriaLabel?: string;
  minuteAriaLabel?: string;
  amPM?: Locale["amPM"];
  time_24hr?: Locale["time_24hr"];
  localeYearAdjustment?: Locale["localeYearAdjustment"];
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
  | "ca"
  | "cat"
  | "ckb"
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
  | "hy"
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
  | "nn"
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
  | "uz"
  | "uz_latn"
  | "zh_tw";
