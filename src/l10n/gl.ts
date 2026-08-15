/* Galician locale for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
  typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : ({
        l10ns: {},
      } as FlatpickrFn);

export const Galician: CustomLocale = {
  weekdays: {
    shorthand: ["Dom", "Lun", "Mar", "Mér", "Xov", "Ven", "Sáb"],
    longhand: [
      "Domingo",
      "Luns",
      "Martes",
      "Mércores",
      "Xoves",
      "Venres",
      "Sábado",
    ],
  },

  months: {
    shorthand: [
      "Xan",
      "Feb",
      "Mar",
      "Abr",
      "Mai",
      "Xuñ",
      "Xul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dec",
    ],
    longhand: [
      "Xaneiro",
      "Febreiro",
      "Marzo",
      "Abril",
      "Maio",
      "Xuño",
      "Xullo",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Decembro",
    ],
  },

  ordinal: () => "º",
  firstDayOfWeek: 1,
  rangeSeparator: " a ",
  weekAbbreviation: "Sem",
  scrollTitle: "Desprazar para incrementar",
  toggleTitle: "Premer para cambiar",
  yearAriaLabel: "Ano",
  monthAriaLabel: "Mes",
  hourAriaLabel: "Hora",
  minuteAriaLabel: "Minuto",
  time_24hr: true,
};

fp.l10ns.gl = Galician;

export default fp.l10ns;
