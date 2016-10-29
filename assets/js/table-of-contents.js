var nav = document.getElementById("nav"),
	links = document.querySelectorAll("#nav a");

function highlightActive() {
	var currentActive = document.getElementsByClassName("current")[0];
	if (currentActive) {
		currentActive.className = ""
	}

	for (let i = links.length - 1; i >=0 ; i--) {
		if (window.pageYOffset + 50 >= 5 * Math.round(document.querySelector(links[i].getAttribute("href")).offsetTop / 5)) {
			links[i].classList.add("current");
			break;
		}
	}
}


function init() {
	highlightActive();
	window.addEventListener("wheel", debounce(highlightActive, 300), {passive: true});

	nav.addEventListener("click", function(e){
		if (e.target.nodeName !== "A")
			return;

		var currentActive = document.getElementsByClassName("current")[0];
		if (currentActive) {
			currentActive.className = "";
		}

		e.target.className = "current";
	});
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
	init();



