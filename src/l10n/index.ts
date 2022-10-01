import { key, CustomLocale } from "../types/locale";

import { Arabic as ar } from "./ar";
import { Austria as at } from "./at";
import { Azerbaijan as az } from "./az";
import { Belarusian as be } from "./be";
import { Bosnian as bs } from "./bs";
import { Bulgarian as bg } from "./bg";
import { Bangla as bn } from "./bn";
import { Catalan as cat } from "./cat";
import { Kurdish as ckb } from "./ckb";
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
import { Faroese as fo } from "./fo";
import { French as fr } from "./fr";
import { Greek as gr } from "./gr";
import { Hebrew as he } from "./he";
import { Hindi as hi } from "./hi";
import { Croatian as hr } from "./hr";
import { Hungarian as hu } from "./hu";
import { Armenian as hy } from "./hy";
import { Indonesian as id } from "./id";
import { Icelandic as is } from "./is";
import { Italian as it } from "./it";
import { Japanese as ja } from "./ja";
import { Georgian as ka } from "./ka";
import { Korean as ko } from "./ko";
import { Khmer as km } from "./km";
import { Kazakh as kz } from "./kz";
import { Lithuanian as lt } from "./lt";
import { Latvian as lv } from "./lv";
import { Macedonian as mk } from "./mk";
import { Mongolian as mn } from "./mn";
import { Malaysian as ms } from "./ms";
import { Burmese as my } from "./my";
import { Dutch as nl } from "./nl";
import { NorwegianNynorsk as nn } from "./nn";
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
import { Turkmen as tm } from "./tm";
import { Ukrainian as uk } from "./uk";
import { Uzbek as uz } from "./uz";
import { UzbekLatin as uzLatn } from "./uz_latn";
import { Vietnamese as vn } from "./vn";
import { Mandarin as zh } from "./zh";
import { MandarinTraditional as zhTw } from "./zh_tw";

const l10n: Record<key, CustomLocale> = {
  ar,
  at,
  az,
  be,
  bg,
  bn,
  bs,
  ca: cat,
  ckb,
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
  fo,
  fr,
  gr,
  he,
  hi,
  hr,
  hu,
  hy,
  id,
  is,
  it,
  ja,
  ka,
  ko,
  km,
  kz,
  lt,
  lv,
  mk,
  mn,
  ms,
  my,
  nl,
  nn,
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
  tm,
  tr,
  uk,
  vn,
  zh,
  zh_tw: zhTw,
  uz,
  uz_latn: uzLatn,
};

export default l10n;
