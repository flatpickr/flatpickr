function labelPlugin() {
	return function (fp) {
		return {
			onReady: function onReady() {
				var id = fp.input.id;
				if (fp.config.altInput && id) {
					fp.input.removeAttribute("id");
					fp.altInput.id = id;
				}
			}
		};
	};
}

if (typeof module !== "undefined") module.exports = labelPlugin;