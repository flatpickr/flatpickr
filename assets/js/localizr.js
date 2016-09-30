
var locale_select = document.getElementById("locales"),
    locale_script = document.getElementById("locale_script"),
    locales = ["ar", "bg", "bn", "cat", "cs", "da", "de", "es", "fa", "fi", "fr", "he", "hi", "id", "ja", "ko", "my", "nl", "no", "pa", "pl", "pt", "ru", "si", "sq", "tr", "zh"];

for(var i = 0; i < locales.length; i++){
    var opt = document.createElement("option");
    opt.value = locales[i];
    opt.textContent = locales[i];
    locale_select.appendChild(opt);
}

locale_select.addEventListener("change", function(e){
    locale_script.removeEventListener("load", onLocaleChange);
    locale_script.parentNode.removeChild(locale_script);
    if (e.target.value !== "") {
        locale_script = document.createElement("script");
        locale_script.src = "src/flatpickr.l10n." + e.target.value +".js";
        locale_script.addEventListener("load", onLocaleChange);

        document.body.appendChild(locale_script);
    }

    else {
        Flatpickr.l10n = defaultLocale;
        document.getElementById("demo_calendar")._flatpickr.redraw();
    }
});

function onLocaleChange(){
    document.getElementById("demo_calendar")._flatpickr.redraw();
}

