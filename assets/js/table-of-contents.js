document.addEventListener("DOMContentLoaded", processTOC, false);
function processTOC(){

	var table = document.querySelector(".c-r div"),
		list = table.querySelector(".c-r ol"),
		examples = document.getElementsByClassName("example"),
		header_height = document.querySelector(".hero").clientHeight,
		table_of_contents, table_of_scrolls = [];

	function onScroll (e){
		if (window.pageYOffset > header_height - (e ? e.deltaY||16 : 16))
			table.classList.add("fixed");
		else
			table.classList.remove("fixed");

		highlightActive(e);
	}

	function highlightActive(e) {
		var currentActive = document.getElementsByClassName("current")[0];
		if (currentActive) {
			currentActive.className = ""
		}

		for (var i = table_of_scrolls.length - 1; i >=0; --i) {
			if (window.pageYOffset >= table_of_scrolls[i]) {
				table_of_contents[i].classList.add("current");
				break;
			}
		}
	}


	function init() {
		for (var i = 0; i < examples.length; ++i) {
			var item = document.createElement("li"),
				link = document.createElement("a");

			item.innerHTML = "<span>"+ (i+1 + ". ") + "</span>";
			link.href="#"+examples[i].id;
			link.innerText=examples[i].getElementsByTagName("h3")[0].innerText||examples[i].getElementsByTagName("h2")[0].innerText;
			item.appendChild(link);
			list.appendChild(item);
			table_of_scrolls.push(5 * Math.round(examples[i].offsetTop / 5));
		}

		table_of_contents = list.querySelectorAll("li");

		onScroll();
		window.addEventListener("wheel", onScroll, {passive: true});
		list.addEventListener("click", function(e){
			var currentActive = document.getElementsByClassName("current")[0];
			if (currentActive) {
				currentActive.className = "";
			}

			e.target.parentNode.className = "current";
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
}


