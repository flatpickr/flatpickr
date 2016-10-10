var theme_sel = document.getElementById("themes"),
	stylesheet = document.getElementById("cal_style"),
	themes = [
		"material_blue", "material_red", "material_orange", "material_green",
		"dark",
		"airbnb",
		"confetti",
		"base16_flat"
	];

theme_sel.href = "dist/flatpickr" + themes[Math.floor(Math.random()*themes.length)] + ".min.css";

for(var i = 0; i < themes.length; i++){
	var opt = document.createElement("option");
	opt.value = "." + themes[i];
	opt.innerText = themes[i].replace(/_/g," ");

	if (stylesheet.href.indexOf(opt.value +".min.css") > -1)
		opt.setAttribute("selected", "");

	theme_sel.appendChild(opt);
}

theme_sel.addEventListener("change", function(e){
	stylesheet.href="dist/flatpickr" + e.target.value +".min.css";
	theme_sel.blur();
});

