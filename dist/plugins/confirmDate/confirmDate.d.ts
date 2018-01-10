import { Instance } from "../../types/instance";
export interface Config {
  confirmIcon?: string;
  confirmText?: string;
  showAlways?: boolean;
  theme?: string;
}
declare function confirmDatePlugin(
  pluginConfig: Config
): (
  fp: Instance
) => {
  onKeyDown(_: Date[], __: string, ___: Instance, e: KeyboardEvent): void;
  onReady(): void;
};
export default confirmDatePlugin;
