function autofocusPlugin() {
	return function(fp) {
		return {
			onReady (){
				const autofocus = fp.input.autofocus;
				if (fp.config.altInput && autofocus) {
					fp.input.removeAttribute("autofocus");
					fp.altInput.autofocus = autofocus;
					fp.altInput.focus();
				}
			}
		}
	}
}

if (typeof module !== "undefined")
	module.exports = autofocusPlugin;