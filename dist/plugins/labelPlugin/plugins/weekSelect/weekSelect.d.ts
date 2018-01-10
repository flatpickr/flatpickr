import { Instance } from "../../types/instance";
export declare type InstancePlusWeeks = Instance & {
  weekStartDay: Date;
  weekEndDay: Date;
};
declare function weekSelectPlugin(): (
  fp: InstancePlusWeeks
) => {
  onValueUpdate: () => void;
  onMonthChange: () => void;
  onYearChange: () => void;
  onClose: () => void;
  onParseConfig: () => void;
  onReady: (() => void)[];
  onDestroy: () => void;
};
export default weekSelectPlugin;
