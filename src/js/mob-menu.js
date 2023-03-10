// Ниже три кнопки(ссылки)
const oneLi = document.querySelector(".one") // Home
const twoLi = document.querySelector(".two") // Favorite
const treeLi = document.querySelector(".tree") // Read
// Ниже кнопки у которых будет добавлять бордер
const oneBorder = document.querySelector(".item-one") // Svg Home
const twoBorder = document.querySelector(".item-two") // Svg Favorite
const treeBorder = document.querySelector(".item-tree") // Svg Read

const rigthSvgOne = document.querySelector(".rigth-one") // SVG " > "
const rigthSvgTwo = document.querySelector(".rigth-two") // SVG " > "
const rigthSvgTree = document.querySelector(".rigth-tree") // SVG " > "

// Тут мы добавляем бордер этому svg
const svgItem = document.querySelector(".svg-item")




// Ссылка Home
oneLi.addEventListener("click", checkOne)
twoLi.addEventListener("click", checkTwo)
treeLi.addEventListener("click", checkTree)

// Ссылка Home
function checkOne(){
        // Проверка на что нажал пользователь
        // Код ниже заменяет классы добавляя где нужно и где не нужно удаляет
        oneLi.classList.add("bg-color-active", "mob-link--color-active")
        twoLi.classList.remove("bg-color-active", "mob-link--color-active")
        treeLi.classList.remove("bg-color-active", "mob-link--color-active")
        //Добавляет бордер на Svg
        oneBorder.classList.add("wrapper__link-use")
        twoBorder.classList.remove("wrapper__link-use")
        treeBorder.classList.remove("wrapper__link-use")
        // Plus Svg " > "
        rigthSvgOne.style.display = "inherit"
        rigthSvgTwo.style.display = "none"
        rigthSvgTree.style.display = "none"

    }
// Ссылка Favorite
function checkTwo(){
        // Проверка на что нажал пользователь
        // Код ниже заменяет классы добавляя где нужно и где не нужно удаляет
        oneLi.classList.remove("bg-color-active", "mob-link--color-active")
        twoLi.classList.add("bg-color-active", "mob-link--color-active")
        treeLi.classList.remove("bg-color-active", "mob-link--color-active")
        //Добавляет бордер на Svg
        oneBorder.classList.remove("wrapper__link-use")
        twoBorder.classList.add("wrapper__link-use")
        treeBorder.classList.remove("wrapper__link-use")
        // Plus Svg " > "
        rigthSvgOne.style.display = "none"
        rigthSvgTwo.style.display = "inherit"
        rigthSvgTree.style.display = "none"
    }


// Ссылка Read
function checkTree() {
        // Проверка на что нажал пользователь
        // Код ниже заменяет классы добавляя где нужно и где не нужно удаляет
        oneLi.classList.remove("bg-color-active", "mob-link--color-active")
        twoLi.classList.remove("bg-color-active", "mob-link--color-active")
        treeLi.classList.add("bg-color-active", "mob-link--color-active")
        //Добавляет бордер на Svg
        oneBorder.classList.remove("wrapper__link-use")
        twoBorder.classList.remove("wrapper__link-use")
        treeBorder.classList.add("wrapper__link-use")
        // Plus Svg " > "
        rigthSvgOne.style.display = "none"
        rigthSvgTwo.style.display = "none"
        rigthSvgTree.style.display = "inherit"

}
//--------------Closed modal----------------
// Тут думаю понятно, просто закрывает модалку
const closeModal = document.querySelector(".close")
const backdrop = document.querySelector(".backdrop")

closeModal.addEventListener("click", e => {
    backdrop.classList.add("is-hidden")
    document.body.style.overflow = 'auto';
})
// Open modal
const modal = document.querySelector(".menu_mob_btn")

modal.addEventListener("click", e => {
    backdrop.classList.remove("is-hidden")
    document.body.style.overflow = 'hidden';
})

function checkUrl() {
    if (window.location.href === "http://localhost:1234/index.html") {
        checkOne()
    }
    else if (window.location.href  === "http://localhost:1234/favorite.html") {

        checkTwo()
    }
    else if (window.location.href === "http://localhost:1234/read.html") {

        checkTree()
    }
    else {
        return
    }
}
checkUrl()
