const btnSearch = document.querySelector(".search_mob_btn");
const formSearch = document.querySelector(".search_form");
const inputSearch = document.querySelector(".search_input");
const btn = document.querySelector(".search_btn");

export function onSearchClick() {
    btnSearch.style.display = "none";
    formSearch.style.display = "block";
    inputSearch.style.display = "block";
    btn.style.display = "block";
    
}