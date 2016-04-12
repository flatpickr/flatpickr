var table = document.querySelector(".c-r div"),
    list = table.querySelector(".c-r ol"),
    links = document.getElementsByClassName("example_wrapper"),
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
    link.innerText=links[i].getElementsByTagName("h3")[0].innerText||links[i].getElementsByTagName("h2")[0].innerText;
    item.appendChild(link);
    list.appendChild(item);

}
onScroll();
window.addEventListener("scroll", onScroll);