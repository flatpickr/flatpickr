import { Instance } from "../../types/instance";
declare function labelPlugin(): (
  fp: Instance
) => {
  onReady(): void;
};
export default labelPlugin;
