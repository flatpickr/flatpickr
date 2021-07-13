/* Rhaeto-Romance locals for flatpickr */
import { CustomLocale } from "../types/locale";
import { FlatpickrFn } from "../types/instance";

const fp =
    typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : ({
          l10ns: {},
        } as FlatpickrFn);

export const RhaetoRomance = {
  weekdays: {
    shorthand: ['Du', 'Gli', 'Ma', 'Me', 'Gie', 'Ve', 'So'],
    longhand: [
      'Dumengia',
      'Glindesdis',
      'Mardi',
      'Mesemna',
      'Gievgia',
      'Venderdi',
      'Sonda'
    ]
  },

  months: {
    shorthand: [
      'Schan',
      'Favr',
      'Mars',
      'Avr',
      'Matg',
      'Zercl',
      'Fan',
      'Avust',
      'Sett',
      'Oct',
      'Nov',
      'Dec'
    ],
    longhand: [
      'Schaner',
      'Favrer',
      'Mars',
      'Avrigl',
      'Matg',
      'Zercladur',
      'Fanadur',
      'Avust',
      'Settember',
      'October',
      'November',
      'December'
    ]
  },

  firstDayOfWeek: 1,
  weekAbbreviation: 'Emna',
  rangeSeparator: ' fin ',
  scrollTitle: 'Per modifitgar scrollar',
  toggleTitle: 'Per midar cliccar',
  time_24hr: true,
};

fp.l10ns.rm = RhaetoRomance;

export default fp.l10ns;
