import { createmarkup } from './js/news-card';
import { NewsFetchApi } from './js/newsApi';
import { ThemeSwitcher } from './js/themeSwitcher';
import { createWidget } from './js/weatherApi';
import { calendar } from './js/calendar';
import { categRefs } from './js/categories';
import { PaginationLogicPopular } from './js/paginationLogicPopular';
import { PaginationLogicCategory } from './js/paginationLogicCategory';
import { PaginationLogicSearch } from './js/paginationLogicSearch';
import { onPaginationPopularNextClick } from './js/paginationPopular';
import { onPaginationPopularPrevClick } from './js/paginationPopular';
import { onPaginationCategoryPrevClick } from './js/paginationCategory';
import { onPaginationCategoryNextClick } from './js/paginationCategory';
import { onPaginationSearchPrevClick } from './js/paginationSearch';
import { onPaginationSearchNextClick } from './js/paginationSearch';
import { publishedDateFormatter } from './js/publishedDateFormatter';
import { onSearchClick } from './js/header';
import { setFavoritesInLocalStor } from './js/setFavoritesInLocalStore';
import { setReadInLocalStor } from './js/setReadInLocalStore';
import { changeSearchType } from './js/currentTypeOfSearch';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDPeYsfpe9V089GbtqhX70XcfdwNsSZDt8',
  authDomain: 'applicationnews-fedor.firebaseapp.com',
  projectId: 'applicationnews-fedor',
  storageBucket: 'applicationnews-fedor.appspot.com',
  messagingSenderId: '178016847755',
  appId: '1:178016847755:web:bb274798374f4d6d8c518e',
  measurementId: 'G-WSG1STJ0EF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document
  .getElementById('signin-form--mobile')
  .addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault()
  const email = evt.target.elements.signinEmail.value;
  const password = evt.target.elements.signinPassword.value;
  
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      // ..
    });
}





const btnSearch = document.querySelector('.search_mob_btn');

btnSearch.addEventListener('click', onSearchClick);
export const pagRefs = {
  prev: document.querySelector('.pag-arrow--prev'),
  next: document.querySelector('.pag-arrow--next'),
};

const newsContainerRef = document.querySelector('.news_container');
const body = document.querySelector('body');
const searchInput = document.querySelector('.search_form');

export const newsFetchApi = new NewsFetchApi();
export const popularNewsPagination = new PaginationLogicPopular();
export const categoryNewsPagination = new PaginationLogicCategory();
export const searchNewsPagination = new PaginationLogicSearch();

if (innerWidth < 768) {
  popularNewsPagination.newsPerPage = 4;
  categoryNewsPagination.newsPerPage = 4;
  searchNewsPagination.newsPerPage = 4;
} else if (innerWidth < 1280) {
  popularNewsPagination.newsPerPage = 7;
  categoryNewsPagination.newsPerPage = 7;
  searchNewsPagination.newsPerPage = 7;
} else {
  popularNewsPagination.newsPerPage = 8;
  categoryNewsPagination.newsPerPage = 8;
  searchNewsPagination.newsPerPage = 8;
}

// const STORAGE_FAVORITES_KEY = 'favorites';
let resultsArr = [];

// приносить список тем
function getSectionList(e) {
  e.preventDefault();
  newsFetchApi
    .fetchSectionList()
    .then(({ data: { results } }) => {
      results.forEach(({ section, display_name }) => {
        // деструктурував необхідні данні для розмітки.
        const sectionName = section;
        const displayName = display_name;
      });
    })
    .catch(() => Notify.failure('Server is busy at this moment'));
}

if (!localStorage.getItem('searchQueryFromFavorites')) {
  getPopularNews();
} else {
  onSearchInputClick();
}

// приносить дані популярних новин
export function getPopularNews() {
  popularNewsPagination.resultsArr = [];

  // текущий поиск - популярных новостей
  newsFetchApi
    .fetchPopularNews()
    .then(({ data }) => {
      //   загальна кількість знайдених новин
      const totalNews = data.num_results;
      // это нужно для избранного
      resultsArr = data.results;
      // проверка если нету новостей.
      if (resultsArr.length === 0) {
        newsContainerRef.innerHTML = '';
        document.querySelector('.without-news_container').style.display =
          'block';
      } else {
        pagRefs.prev.removeEventListener(
          'click',
          onPaginationCategoryPrevClick
        );
        pagRefs.next.removeEventListener(
          'click',
          onPaginationCategoryNextClick
        );
        pagRefs.prev.removeEventListener('click', onPaginationSearchPrevClick);
        pagRefs.next.removeEventListener('click', onPaginationSearchNextClick);
        pagRefs.prev.addEventListener('click', onPaginationPopularPrevClick);
        pagRefs.next.addEventListener('click', onPaginationPopularNextClick);
        // проверка или выбрана дата
        if (newsFetchApi.date) {
          resultsArr.forEach(el => {
            const publishedDate = publishedDateFormatter(el.published_date)
              .split('/')
              .reverse()
              .join('');
            // проверка даты новости совпадает с выбраной датой
            if (publishedDate === newsFetchApi.date) {
              popularNewsPagination.resultsArr.push(el);
            }
          });
        } else {
          popularNewsPagination.resultsArr = resultsArr;
        }
        // проверка или есть новости по выбранной дате
        if (popularNewsPagination.resultsArr.length === 0) {
          newsContainerRef.innerHTML = '';
          document.querySelector('.without-news_container').style.display =
            'block';
          pagRefs.next.classList.add('hide');
        } else {
          const markupAllPopular = popularNewsPagination.getMarkupAll();
          populateNews(markupAllPopular);
          pagRefs.next.classList.remove('hide');
        }
      }
    })
    .catch(error => {
      console.log(error);
      Notify.failure('Server is busy at this moment');
    });
}

// приносить дані новин по категоріям
export function onCategoryClick(evt) {
  searchInput.reset();
  document.querySelector('.without-news_container').style.display = 'none';
  // текущий поиск - по категориям
  changeSearchType('category');

  newsFetchApi.offset = 0;
  categoryNewsPagination.resetPage();

  // add by Volyanskiy start
  const target = evt.target;
  if (
    target.classList.contains('section-btn') ||
    target.classList.contains('dropdown-item')
  ) {
    categRefs.newsSection = target.dataset.section;

    newsFetchApi.searchSection = String(categRefs.newsSection);
  }
  // add by Volyanskiy end

  newsFetchApi
    .fetchBySection()
    .then(({ data }) => {
      pagRefs.prev.removeEventListener('click', onPaginationCategoryPrevClick);
      pagRefs.next.removeEventListener('click', onPaginationCategoryNextClick);
      //   загальна кількість знайдених новин, тут она врёт, на самом деле приходит меньше чем есть.
      const totalNews = data.num_results;
      // это нужно для избранного
      resultsArr = data.results;

      // проверка если нету новостей.
      if (data.results === null) {
        newsContainerRef.innerHTML = '';
        document.querySelector('.without-news_container').style.display =
          'block';
        pagRefs.next.classList.add('hide');
      } else {
        categoryNewsPagination.resultsArr = [];
        pagRefs.prev.removeEventListener('click', onPaginationPopularPrevClick);
        pagRefs.next.removeEventListener('click', onPaginationPopularNextClick);
        pagRefs.prev.removeEventListener('click', onPaginationSearchPrevClick);
        pagRefs.next.removeEventListener('click', onPaginationSearchNextClick);
        pagRefs.prev.addEventListener('click', onPaginationCategoryPrevClick);
        pagRefs.next.addEventListener('click', onPaginationCategoryNextClick);
        if (newsFetchApi.date) {
          resultsArr.forEach(el => {
            const publishedDate = publishedDateFormatter(el.published_date)
              .split('/')
              .reverse()
              .join('');
            if (publishedDate === newsFetchApi.date) {
              categoryNewsPagination.resultsArr.push(el);
            }
          });
        } else {
          categoryNewsPagination.resultsArr = resultsArr;
        }
        if (categoryNewsPagination.resultsArr.length === 0) {
          newsContainerRef.innerHTML = '';
          document.querySelector('.without-news_container').style.display =
            'block';
          pagRefs.next.classList.add('hide');
        } else {
          const markupAllCategory = categoryNewsPagination.getMarkupAll();
          populateNews(markupAllCategory);
          pagRefs.next.classList.remove('hide');
        }
      }
    })
    .catch(error => Notify.failure('Server is busy at this moment'));
}

searchInput.addEventListener('submit', onSearchInputClick);

// приносить дані за пошуковим запитом
export function onSearchInputClick(event) {
  // убираем выбранную категорию
  const buttons = document.querySelectorAll('.section-btn, .other-btn');
  buttons.forEach(button => {
    button.classList.remove('btn-active');
  });

  pagRefs.next.classList.add('hide');
  const evt = event;
  // текущий поиск - по ключевому слову
  changeSearchType('searchInput');
  document.querySelector('.without-news_container').style.display = 'none';
  if (localStorage.getItem('searchQueryFromFavorites') === null) {
    if (evt.target.className === 'search_form') {
      // если не нашли новостей, а потом ввели нормальный запрос, делаем заново  display none
      evt.preventDefault();
      //  значення пошукового запиту
      newsFetchApi.searchQuery = evt.target.elements.searchQuery.value;
    }
    searchNewsPagination.page = 0;
    newsFetchApi.resetPage();
    document.querySelector('.without-news_container').style.display = 'none';
    pagRefs.next.classList.add('hide');
    pagRefs.prev.classList.add('hide');
  } else {
    newsFetchApi.searchQuery = localStorage.getItem('searchQueryFromFavorites');
  }

  localStorage.removeItem('searchQueryFromFavorites');
  newsFetchApi
    .fetchBySearchQuery()
    .then(({ data: { response } }) => {
      pagRefs.prev.removeEventListener('click', onPaginationSearchPrevClick);
      pagRefs.next.removeEventListener('click', onPaginationSearchNextClick);

      //   загальна кількість знайдених новин
      const totalNews = response.meta.hits;
      // это нужно для избранного
      resultsArr = response.docs;

      // проверка если нету новостей.
      if (resultsArr.length === 0) {
        newsContainerRef.innerHTML = '';
        document.querySelector('.without-news_container').style.display =
          'block';
      } else {
        searchNewsPagination.resultsArr = [];
        pagRefs.prev.removeEventListener('click', onPaginationPopularPrevClick);
        pagRefs.next.removeEventListener('click', onPaginationPopularNextClick);
        pagRefs.prev.removeEventListener(
          'click',
          onPaginationCategoryPrevClick
        );
        pagRefs.next.removeEventListener(
          'click',
          onPaginationCategoryNextClick
        );
        pagRefs.prev.addEventListener('click', onPaginationSearchPrevClick);
        pagRefs.next.addEventListener('click', onPaginationSearchNextClick);

        searchNewsPagination.resultsArr = resultsArr;
        // ++++++++++++++++++++++
        // приходит по 10 новостей, проверяем если сразу пришло 11-19 для второй страницы
        if (
          searchNewsPagination.page ===
          Math.floor(
            searchNewsPagination.resultsArr.length /
              searchNewsPagination.newsPerPage
            // тут -1 - загружаем следующую страницу за 1 страницу раньше, на случай если догрузим не полный массив, что б отображалось по 7, а не 6, потом догрузили 7, и потом остаток
          ) -
            1
        ) {
          newsFetchApi.page += 1;

          newsFetchApi
            .fetchBySearchQuery()
            .then(({ data: { response } }) => {
              const extraResultsArr = response.docs;

              searchNewsPagination.resultsArr.push(...extraResultsArr);
            })
            .catch(error => console.log(error));
        }

        // ++++++++++++++++++++++
        const markupAllSearch = searchNewsPagination.getMarkupAll();
        populateNews(markupAllSearch);
        pagRefs.next.classList.remove('hide');
      }
    })
    .catch(error => Notify.failure('Server is busy at this moment'));
}

//============= перемикач теми початок ==========

const themeSwitcherEl = document.querySelector('.switch_input');
const mobileSwitcherEl = document.querySelector('.switch_input--mobile');

const themeSwitcher = new ThemeSwitcher(themeSwitcherEl, mobileSwitcherEl);

mobileSwitcherEl.addEventListener('change', themeSwitcher.onThemeToggle);
themeSwitcherEl.addEventListener('change', themeSwitcher.onThemeToggle);

themeSwitcher.renderTheme();
//============= перемикач теми кінець ============

// Начало. Проверка на клик по Добавить в избранное
function onAddToFavoritesClick(evt) {
  if (evt.target.className === 'card__btn') {
    const clickedArticleId =
      evt.target.closest('.card')?.id ||
      evt.target.closest('.card')?.slug_name ||
      evt.target.closest('.card')?._id;

    const compareString = evt.target.textContent.trim();

    if (compareString === 'Add to favorites') {
      evt.target.nextElementSibling.classList.remove('fav-icon-add');
      evt.target.nextElementSibling.classList.add('fav-icon-remove');
      evt.target.textContent = 'Remove from favorites';
    } else {
      evt.target.nextElementSibling.classList.remove('fav-icon-remove');
      evt.target.nextElementSibling.classList.add('fav-icon-add');
      evt.target.textContent = 'Add to favorites';
    }

    setFavoritesInLocalStor({
      resultsArr,
      clickedArticleId,
      evt,
    });
  }
}

// Конец. Проверка на клик по Добавить в избранное

//=== Подчеркивание активной ссылки на страницу -- начало

import './js/currentPage';

//=== Подчеркивание активной ссылки на страницу -- конец

// Рендеринг всех карточек на странице с календарём. начало
export function populateNews(markupAllPopular) {
  newsContainerRef.innerHTML = markupAllPopular;

  // Блок добавления погоды
  const weatherWidgetContainer = document.querySelector('.weatherWidget');

  createWidget(weatherWidgetContainer);

  // Слушатель на клик по Добавить в избранное
  body.addEventListener('click', onAddToFavoritesClick);
  body.addEventListener('click', onAddToReadClick);
}
// Рендеринг всех карточек на странице с календарём. конец

//READ

function onAddToReadClick(evt) {
  if (evt.target.className === 'card__read-more-search') {
    const clickedArticleId =
      evt.target.closest('.card')?.id ||
      evt.target.closest('.card')?.slug_name ||
      evt.target.closest('.card')?._id;
    const readCard = document.querySelector(`[id_card="${clickedArticleId}"]`);
    readCard.style.display = 'block';

    setReadInLocalStor({
      resultsArr,
      clickedArticleId,
      evt,
    });
  }
}
