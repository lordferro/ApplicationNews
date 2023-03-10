import {createmarkup} from './js/news-card';
import {onSearchClick} from './js/header';
import { ThemeSwitcher } from './js/themeSwitcher';
import {publishedDateFormatter} from './js/publishedDateFormatter';
import {setFavoritesInLocalStor} from './js/setFavoritesInLocalStore';
import {setReadInLocalStor} from './js/setReadInLocalStore';


const newsContainerRef = document.querySelector('.news_container');
const body = document.querySelector('body');
const bodyRead = document.querySelector('.body');
const searchInput = document.querySelector('.search_form');
const withoutNewsContainer = document.querySelector('.without-news_container')



let markupAll = '';
let resultsArr = '';
let arrArticlesFromLocStor = []
let arrDateOfRead = [];
let arrUniqueDateOfRead = [];
let arrArticlesPerDate = [];
let favoritesArrFedor = [];
let createArrFedor = [];
let read=""
let fullMarkup = '';
let sectionMarkup = '';
let startSectionMarkup = '';
let blockMarkup = '';
const endSectionMarkup = '</ul></label> </section>';
const STORAGE_READ_KEY = 'read';


getReadArticlesFromLocStor();
//===отримання масиву статей з local storage ==========
function getReadArticlesFromLocStor() {
  read = localStorage.getItem(STORAGE_READ_KEY);
  if (!read) {
    withoutNewsContainer.style.display = 'block';
  } else {
   let arrArticlesFromLocStor = JSON.parse(read);
    getUniqeDateOfRead(arrArticlesFromLocStor);

  }
}

//===отримання масиву дат для створення секцій із даних local storage ==========
//добавити перевірку на пустий масив
function getUniqeDateOfRead(arr) {
  const parsedFavorites = arr;
  const favoritesKeys = Object.keys(parsedFavorites);
  
  for (const favoriteKey of favoritesKeys) {
    const parsedFavorite = parsedFavorites[`${favoriteKey}`];
    favoritesArrFedor.push(parsedFavorite);
    const {
      abstract,
      published_date,
      pub_date,
      section,
      section_name,
      title,
      headline,
      media,
      multimedia,
      url,
      web_url,
      id,
      _id,
      slug_name,
      dateOfReading,
    } = parsedFavorite;
    
    favoritesArrFedor.forEach(article => {
      
     arrDateOfRead.push(article.dateOfReading);
    });
    arrUniqueDateOfRead = arrDateOfRead.filter(getOnlyUniqueArray);

   
  }
} 
renderPage(arrUniqueDateOfRead)
 
//=== створення масиву статей по даті для блоку секції ==========

//добавити перевірку на пустий масив
function renderPage(arrUniqueDateOfRead) {
  if (!read) {
    withoutNewsContainer.style.display = 'block';
  }
  fullMarkup = '';
  arrUniqueDateOfRead.forEach(date => {
  
    createSectionMarkup(date);
    getArticlesPerDate(date);
  
    createBlockMarkup(arrArticlesPerDate);
    sectionMarkup = startSectionMarkup + blockMarkup + endSectionMarkup;
    fullMarkup = fullMarkup + sectionMarkup;
    blockMarkup= '';
    return fullMarkup;
  });
  
}

function createSectionMarkup(date) {
  
  startSectionMarkup = `
    <section class = "section_read container"
    <div class = "section-title container">
    
    <label class="checkbox-btn checkbox">
  <input type="checkbox">
  <span class="btn-label">${date} <svg class=" date-list__btn-icon" width="14" height="9" aria-hidden="true" style="position: absolute;>
  <symbol id="icon-vector-2-1"="" viewBox="0 0 50 32">
  <path d="M5.867 0l-5.867 6.080 24.889 25.92 24.889-25.92-5.831-6.080-19.058 19.769-19.058-19.769z"></path>
  </svg></button></span>
  <div class="under_line"></div>

    <div class = "news_container popup">`;
  return startSectionMarkup;
}

function getArticlesPerDate(date) {
  arrArticlesPerDate = favoritesArrFedor.filter(
    article => article.dateOfReading == date
  );
}

function createBlockMarkup(arr) {
  const parsedFavorites = arr;
  const favoritesKeys = Object.keys(parsedFavorites);
  for (const favoriteKey of favoritesKeys) {
    const parsedFavorite = parsedFavorites[`${favoriteKey}`];
    const createArr = [];
    createArr.push(parsedFavorite);
    
    const {
      abstract,
      published_date,
      pub_date,
      section,
      section_name,
      title,
      headline,
      media,
      multimedia,
      url,
      web_url,
      id,
      _id,
      slug_name,
      dateOfReading,
    } = parsedFavorite;

    const articleId = id || _id || slug_name;
    const publishedDate = publishedDateFormatter(published_date || pub_date);
    const sectionName = section || section_name;
    const articleTitle = title || headline.main;
    const shortDescription = abstract;
    const urlOriginalArticle = url || web_url;
    let imgUrl = '';

    //   перевіряемо чи є зображення, де помилка там є відео
    try {
      if (articleId === id) {
        imgUrl = media[0]['media-metadata'][2].url;
      }
      if (articleId === slug_name) {
        imgUrl = multimedia[2].url;
      }
      if (articleId === _id) {
        imgUrl = 'https://www.nytimes.com/' + multimedia[0].url;
      }

      //   якщо треба інший розмір картинки
     
    } catch (error) {
      imgUrl =
        'https://t4.ftcdn.net/jpg/00/89/55/15/240_F_89551596_LdHAZRwz3i4EM4J0NHNHy2hEUYDfXc0j.jpg';
    }
    
    blockMarkup += createmarkup({
      publishedDate,
      sectionName,
      articleTitle,
      shortDescription,
      urlOriginalArticle,
      imgUrl,
      articleId,
    });
    blockMarkup;

  }
}

//===функція фільтрації для function getUniqeDateOfRead(arr) ==========
function getOnlyUniqueArray(value, index, self) {
  return self.indexOf(value) === index;
}



body.insertAdjacentHTML('beforeend', fullMarkup);



//============= перемикач теми початок ==========

const themeSwitcherEl = document.querySelector('.switch_input');
const mobileSwitcherEl = document.querySelector('.switch_input--mobile');

const themeSwitcher = new ThemeSwitcher(themeSwitcherEl, mobileSwitcherEl);

mobileSwitcherEl.addEventListener('change', themeSwitcher.onThemeToggle);
themeSwitcherEl.addEventListener('change', themeSwitcher.onThemeToggle);

themeSwitcher.renderTheme();
//============= перемикач теми кінець ============

// Начало. Проверка на клик по Добавить в избранное
body.addEventListener('click', onAddToFavoritesClick);
body.addEventListener('click', onAddToReadClick);

function onAddToFavoritesClick(evt) {
  if (evt.target.className === 'card__btn') {
    const clickedArticleId =
      evt.target.closest('.card')?.id ||
      evt.target.closest('.card')?.slug_name ||
      evt.target.closest('.card')?._id;

      const compareString = evt.target.textContent.trim()

      if ((compareString === 'Add to favorites')) {
        evt.target.nextElementSibling.classList.remove('fav-icon-add')
        evt.target.nextElementSibling.classList.add('fav-icon-remove')
        evt.target.textContent = 'Remove from favorites';
    } else { evt.target.nextElementSibling.classList.remove('fav-icon-remove')
    evt.target.nextElementSibling.classList.add('fav-icon-add')
    evt.target.textContent = 'Add to favorites'}
    const resultsArr = favoritesArrFedor;
    setFavoritesInLocalStor({
      resultsArr,
      clickedArticleId,
      evt,
    });
  }
}


function onAddToReadClick(evt) {
  if (evt.target.className === 'card__read-more-search') {
    const clickedArticleId =
      evt.target.closest('.card')?.id ||
      evt.target.closest('.card')?.slug_name ||
      evt.target.closest('.card')?._id;
    const resultsArr = favoritesArrFedor;
  const readCard = document.querySelector(`[id_card="${clickedArticleId}"]`);
  readCard.style.display = 'block';
    setReadInLocalStor({
      resultsArr,
      clickedArticleId,
      evt,
    });
  }
}