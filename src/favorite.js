
import {createmarkup} from './js/news-card';
import {onSearchClick} from './js/header';
import { ThemeSwitcher } from './js/themeSwitcher';
import {publishedDateFormatter} from './js/publishedDateFormatter';
import {setFavoritesInLocalStor} from './js/setFavoritesInLocalStore';
import {setReadInLocalStor} from './js/setReadInLocalStore';
const newsContainerRef = document.querySelector('.news_container');
const body = document.querySelector('body');
const searchInput = document.querySelector('.search_form');
const withoutNewsContainer = document.querySelector('.without-news_container');
const STORAGE_FAVORITES_KEY = 'favorites';
let markupAll = '';

searchInput.addEventListener('submit', onSearchInputClickAtFavorites);

function onSearchInputClickAtFavorites(evt) {
  evt.preventDefault()
  const query = evt.target.elements.searchQuery.value
  localStorage.setItem("searchQueryFromFavorites", query)
window.open('index.html', '_self')
}


//============= перемикач теми початок ==========

const themeSwitcherEl = document.querySelector('.switch_input');
const mobileSwitcherEl = document.querySelector('.switch_input--mobile');

const themeSwitcher = new ThemeSwitcher(themeSwitcherEl, mobileSwitcherEl);

mobileSwitcherEl.addEventListener('change', themeSwitcher.onThemeToggle);
themeSwitcherEl.addEventListener('change', themeSwitcher.onThemeToggle);

themeSwitcher.renderTheme();
//============= перемикач теми кінець ============

body.addEventListener('click', onAddToFavoritesClick);
body.addEventListener('click', onAddToReadClick);
let favoritesArrFedor = [];

function addFavorite() {
  const favorites = localStorage.getItem(STORAGE_FAVORITES_KEY);
  
  if (!favorites || Object.entries(JSON.parse(favorites)).length === 0) {
    withoutNewsContainer.style.display = 'block';
  } else {
    const parsedFavorites = JSON.parse(favorites);
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
      
      markupAll += createmarkup({
        publishedDate,
        sectionName,
        articleTitle,
        shortDescription,
        urlOriginalArticle,
        imgUrl,
        articleId,
      });
    }
    newsContainerRef.innerHTML = markupAll;
  }
}

addFavorite();

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