/* Ukrainian locals for flatpickr */
import { CustomLocale } from "types/locale"
import { FlatpickrFn } from "types/instance"

const fp: FlatpickrFn = ((window as any).flatpickr as FlatpickrFn) || { l10ns: {}}

export const Ukrainian: CustomLocale = {

firstDayOfWeek: 1,

weekdays: {
	shorthand: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
	longhand: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"]
},

months: {
	shorthand: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
	longhand: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"]
},
}

fp.l10ns.uk = Ukrainian;

export default fp.l10ns
