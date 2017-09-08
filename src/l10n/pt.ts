/* Portuguese locals for flatpickr */
import { CustomLocale } from "types/locale"
import { FlatpickrFn } from "types/instance"

const fp: FlatpickrFn = ((window as any).flatpickr as FlatpickrFn) || { l10ns: {}}

export const Portuguese: CustomLocale = {

weekdays: {
	shorthand: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
	longhand: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
},

months: {
	shorthand: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
	longhand: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
},

rangeSeparator: " até ",
}

fp.l10ns.pt = Portuguese;

export default fp.l10ns

