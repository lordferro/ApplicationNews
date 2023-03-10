//=== Подчеркивание активной ссылки на страницу

let currentPage = document.querySelector('body').getAttribute('data-current-page'); 

if (currentPage === "index") {
  document.querySelector('.nav_link[data-href="index"]').classList.add('nav_link--current');  
} else if (currentPage === "favorite") {
  document.querySelector('.nav_link[data-href="favorite"]').classList.add('nav_link--current');  
} else if (currentPage === "read") {
  document.querySelector('.nav_link[data-href="read"]').classList.add('nav_link--current');  
}
