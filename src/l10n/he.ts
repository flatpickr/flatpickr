/* Hebrew locals for flatpickr */
import { CustomLocale } from "types/locale"
import { FlatpickrFn } from "types/instance"

const fp: FlatpickrFn = ((window as any).flatpickr as FlatpickrFn) || { l10ns: {}}

export const Hebrew: CustomLocale = {
  weekdays: {
  	shorthand: ["א", "ב", "ג", "ד", "ה", "ו", "ז"],
  	longhand: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
  },


  months: {
  	shorthand: ["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני", "יולי", "אוג׳", "ספט׳", "אוק׳", "נוב׳", "דצמ׳"],
  	longhand: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
  },
}

fp.l10ns.he = Hebrew;

export default fp.l10ns

