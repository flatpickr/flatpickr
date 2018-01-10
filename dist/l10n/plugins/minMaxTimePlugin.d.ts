import { Instance } from "../types/instance";
export interface MinMaxTime {
  minTime?: string;
  maxTime?: string;
}
export interface Config {
  table?: Record<string, MinMaxTime>;
  getTimeLimits?: (date: Date) => MinMaxTime;
  tableDateFormat?: string;
}
export interface State {
  formatDate: (date: Date, f: string) => string;
  tableDateFormat: string;
  defaults: MinMaxTime;
}
declare function minMaxTimePlugin(
  config?: Config
): (
  fp: Instance
) => {
  onReady(this: Instance): void;
  onChange(this: Instance): void;
};
export default minMaxTimePlugin;
