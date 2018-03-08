import { Plugin } from "../../types/options";

function labelPlugin(): Plugin {
  return function(fp) {
    return {
      onReady() {
        const id = fp.input.id;

        if (!id) {
          return;
        }

        if (fp.mobileInput) {
          fp.input.removeAttribute("id");
          fp.mobileInput.id = id;
        } else if (fp.altInput) {
          fp.input.removeAttribute("id");
          fp.altInput.id = id;
        }
      },
    };
  };
}

export default labelPlugin;
