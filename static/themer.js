if (window.navigator.userAgent.indexOf('MSIE') > -1){
	var iestyle = document.createElement("link");
	iestyle.setAttribute("href", "https://cdn.jsdelivr.net/npm/flatpickr/dist/ie.css");
	iestyle.setAttribute("rel", "stylesheet");
	iestyle.setAttribute("type", "text/css");
	document.head.appendChild(iestyle);
}


function themer() {
	var theme_sel = document.getElementById("themes"),
		stylesheet = document.head.querySelector(
			"link[href='https://cdn.jsdelivr.net/npm/flatpickr@latest/dist/flatpickr.css']"
		),
		themes = [
			"dark",
			"material_blue", "material_green", "material_red", "material_orange",
			"airbnb",
			"confetti"
		];

	if (!theme_sel)
		return;

	for(var i = 0; i < themes.length; i++){
		var opt = document.createElement("option");
		opt.className=themes[i];
		opt.value = themes[i];
		opt.textContent = themes[i];

		theme_sel.appendChild(opt);
	}

	theme_sel.addEventListener("change", function(e){
		theme_sel.blur();

		if (!e.target.value || e.target.value === "default")
			return (stylesheet.href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.css");

		stylesheet.href="https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/" + e.target.value +".css";
	});
};

themer();
