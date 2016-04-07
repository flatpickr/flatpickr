var table = document.querySelector(".c-r div"),
    list = table.querySelector(".c-r ol"),
    links = document.querySelectorAll("[data-desc]"),
    header_height = document.querySelector(".hero").offsetHeight,
    onScroll = function(){

        if (document.body.scrollTop > header_height || document.documentElement.scrollTop > header_height)
            table.classList.add("fixed");
        else
            table.classList.remove("fixed");


    };

for (i = 0; i < links.length; ++i) {

    var item = document.createElement("li"),
        link = document.createElement("a");

    item.innerHTML = "<span>"+ (i+1 + ". ") + "</span>";
    link.href="#"+links[i].id;
    link.innerText=links[i].dataset.desc;
    item.appendChild(link);
    list.appendChild(item);

}
onScroll();
window.addEventListener("scroll", onScroll);