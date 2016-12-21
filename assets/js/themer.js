const theme_sel = document.getElementById("themes"),
	stylesheet = document.getElementById("cal_style"),
	themes = [
		"dark",
		"material_blue", "material_red", "material_orange", "material_green",
		"airbnb",
		"confetti"
	];

//theme_sel.href = "dist/flatpickr" + themes[Math.floor(Math.random()*themes.length)] + ".min.css";

for(let i = 0; i < themes.length; i++){
	const opt = document.createElement("option");
	opt.className=themes[i];
	opt.value = themes[i];
	opt.innerText = themes[i].replace(/_/g," ");

	theme_sel.appendChild(opt);
}

theme_sel.addEventListener("change", function(e){
	theme_sel.blur();

	if (!e.target.value || e.target.value === "default")
		return (stylesheet.href="bower_components/flatpickr/dist/flatpickr.css");

	stylesheet.href="bower_components/flatpickr/dist/themes/" + e.target.value +".css";

});

