import { CustomLocale } from "../types/locale";
export declare const Hungarian: CustomLocale;
declare const _default: {
  ar?: CustomLocale | undefined;
  bg?: CustomLocale | undefined;
  bn?: CustomLocale | undefined;
  cat?: CustomLocale | undefined;
  cs?: CustomLocale | undefined;
  cy?: CustomLocale | undefined;
  da?: CustomLocale | undefined;
  de?: CustomLocale | undefined;
  default?: CustomLocale | undefined;
  en?: CustomLocale | undefined;
  eo?: CustomLocale | undefined;
  es?: CustomLocale | undefined;
  et?: CustomLocale | undefined;
  fa?: CustomLocale | undefined;
  fi?: CustomLocale | undefined;
  fr?: CustomLocale | undefined;
  gr?: CustomLocale | undefined;
  he?: CustomLocale | undefined;
  hi?: CustomLocale | undefined;
  hr?: CustomLocale | undefined;
  hu?: CustomLocale | undefined;
  id?: CustomLocale | undefined;
  it?: CustomLocale | undefined;
  ja?: CustomLocale | undefined;
  ko?: CustomLocale | undefined;
  lt?: CustomLocale | undefined;
  lv?: CustomLocale | undefined;
  mk?: CustomLocale | undefined;
  mn?: CustomLocale | undefined;
  ms?: CustomLocale | undefined;
  my?: CustomLocale | undefined;
  nl?: CustomLocale | undefined;
  no?: CustomLocale | undefined;
  pa?: CustomLocale | undefined;
  pl?: CustomLocale | undefined;
  pt?: CustomLocale | undefined;
  ro?: CustomLocale | undefined;
  ru?: CustomLocale | undefined;
  si?: CustomLocale | undefined;
  sk?: CustomLocale | undefined;
  sl?: CustomLocale | undefined;
  sq?: CustomLocale | undefined;
  sr?: CustomLocale | undefined;
  sv?: CustomLocale | undefined;
  th?: CustomLocale | undefined;
  tr?: CustomLocale | undefined;
  uk?: CustomLocale | undefined;
  vn?: CustomLocale | undefined;
  zh?: CustomLocale | undefined;
} & {
  default: {
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
  };
};
export default _default;
