import { Instance } from "../types/instance";
export interface Config {
  input?: string | HTMLInputElement;
}
declare global {
  interface Window {
    rangePlugin: (config?: Config) => void;
  }
}
declare function rangePlugin(
  config?: Config
): (
  fp: Instance
) => {
  onParseConfig(): void;
  onReady(): void;
  onPreCalendarPosition(): void;
  onChange(): void;
  onDestroy(): void;
  onValueUpdate(selDates: Date[]): void;
};
export default rangePlugin;
