/* Gaelic Irish locale for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Irish: CustomLocale = {
  firstDayOfWeek: 1,

  weekdays: {
    shorthand: ["Dom", "Lua", "Mái", "Céa", "Déa", "Aoi", "Sat"],
    longhand: [
      "Dé Domhnaigh",
      "Dé Luain",
      "Dé Máirt",
      "Dé Céadaoin",
      "Déardaoin",
      "Dé hAoine",
      "Dé Sathairn",
    ],
  },

  months: {
    shorthand: [
      "Ean",
      "Fea",
      "Már",
      "Aib",
      "Bea",
      "Mei",
      "Iúi",
      "Lún",
      "MFo",
      "DFo",
      "Sam",
      "Nol",
    ],
    longhand: [
      "Eanáir",
      "Feabhra",
      "Márta",
      "Aibreán",
      "Bealtaine",
      "Meitheamh",
      "Iúil",
      "Lúnasa",
      "Meán Fómhair",
      "Deireadh Fómhair",
      "Samhain",
      "Nollaig",
    ],
  },
  time_24hr: true,
};

fp.l10ns.hr = Irish;

export default fp.l10ns;
