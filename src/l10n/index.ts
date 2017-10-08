import { key, CustomLocale } from "types/locale";

import { Arabic as ar } from "./ar";
import { Bulgarian as bg } from "./bg";
import { Bangla as bn } from "./bn";
import { Catalan as cat } from "./cat";
import { Czech as cs } from "./cs";
import { Welsh as cy } from "./cy";
import { Danish as da } from "./da";
import { German as de } from "./de";
import { english as en } from "./default";
import { Esperanto as eo } from "./eo";
import { Spanish as es } from "./es";
import { Estonian as et } from "./et";
import { Persian as fa } from "./fa";
import { Finnish as fi } from "./fi";
import { French as fr } from "./fr";
import { Greek as gr } from "./gr";
import { Hebrew as he } from "./he";
import { Hindi as hi } from "./hi";
import { Croatian as hr } from "./hr";
import { Hungarian as hu } from "./hu";
import { Indonesian as id } from "./id";
import { Italian as it } from "./it";
import { Japanese as ja } from "./ja";
import { Korean as ko } from "./ko";
import { Lithuanian as lt } from "./lt";
import { Latvian as lv } from "./lv";
import { Macedonian as mk } from "./mk";
import { Mongolian as mn } from "./mn";
import { Malaysian as ms } from "./ms";
import { Burmese as my } from "./my";
import { Dutch as nl } from "./nl";
import { Norwegian as no } from "./no";
import { Punjabi as pa } from "./pa";
import { Polish as pl } from "./pl";
import { Portuguese as pt } from "./pt";
import { Romanian as ro } from "./ro";
import { Russian as ru } from "./ru";
import { Sinhala as si } from "./si";
import { Slovak as sk } from "./sk";
import { Slovenian as sl } from "./sl";
import { Albanian as sq } from "./sq";
import { Serbian as sr } from "./sr";
import { Swedish as sv } from "./sv";
import { Thai as th } from "./th";
import { Turkish as tr } from "./tr";
import { Ukrainian as uk } from "./uk";
import { Vietnamese as vn } from "./vn";
import { Mandarin as zh } from "./zh";

const l10n: Record<key, CustomLocale> = {
  ar,
  bg,
  bn,
  cat,
  cs,
  cy,
  da,
  de,
  default: { ...en },
  en,
  eo,
  es,
  et,
  fa,
  fi,
  fr,
  gr,
  he,
  hi,
  hr,
  hu,
  id,
  it,
  ja,
  ko,
  lt,
  lv,
  mk,
  mn,
  ms,
  my,
  nl,
  no,
  pa,
  pl,
  pt,
  ro,
  ru,
  si,
  sk,
  sl,
  sq,
  sr,
  sv,
  th,
  tr,
  uk,
  vn,
  zh,
};

export default l10n;
