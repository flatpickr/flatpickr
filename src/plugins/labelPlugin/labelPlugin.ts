import { Instance } from "types/instance";

function labelPlugin() {
  return function(fp: Instance) {
    return {
      onReady() {
        const id = fp.input.id;
        if (fp.altInput && id) {
          fp.input.removeAttribute("id");
          fp.altInput.id = id;
        }
      },
    };
  };
}

export default labelPlugin;
