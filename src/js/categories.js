import { NewsFetchApi } from './newsApi';
import { onCategoryClick } from '../index';
import { debounce } from 'debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const newsFetchApi = new NewsFetchApi();

export const categRefs = {
  currentPage: document.querySelector('body').getAttribute('data-current-page'),
  categsBlockEL: document.querySelector('.categories__wrap'),
  categsListBtn: null,
  dropdownContent: null,
  sectionButtons: null,
  newsSection: '',
  buttonsQuantity: '0',
  listButtonName: 'Categories',
  dropdown: null,
};

if (categRefs.currentPage === 'index') {
  document.addEventListener('DOMContentLoaded', getSectionListData);

  window.onresize = debounce(onResize, 100, { trailing: false, leading: true });

  categRefs.categsBlockEL.addEventListener('click', activeBtnColorHandler);
  categRefs.categsBlockEL.addEventListener('click', onCategoryClick);
  categRefs.categsBlockEL.addEventListener('mouseenter', onDropdownItemClick);
}

export async function getSectionListData() {
  try {
    const response = await newsFetchApi.fetchSectionList();
    const {
      data: { results },
    } = response;

    const sectionName = results.map(({ section }) => section);
    const displayName = results.map(({ display_name }) => display_name);

    createSectionMarkup(sectionName, displayName);
  } catch (error) {
    Notify.failure("Server is busy at this moment")
  }
}

export function selectButtonsQuantity() {
  if (
    window.matchMedia('(min-width: 768px) and (max-width: 1279.98px)').matches
  ) {
    categRefs.buttonsQuantity = 4;
  } else if (window.matchMedia('(min-width: 1280px)').matches) {
    categRefs.buttonsQuantity = 6;
  } else {
    categRefs.buttonsQuantity = 0;
  }
  return categRefs.buttonsQuantity;
}

export function nameListButtonByClick(buttonText) {
  categRefs.categsListBtn.textContent = buttonText;
}

export function nameListButtonByMedia() {
  if (
    window.matchMedia('(min-width: 768px)').matches &&
    categRefs.buttonsQuantity != 0
  ) {
    categRefs.listButtonName = 'Other';
  }
}

export function createSectionMarkup(sectionName, displayName) {
  let sectionMarkup = '';
  selectButtonsQuantity();
  nameListButtonByMedia();

  // Create buttonsQuantity of buttons for first buttonsQuantity results
  for (let i = 0; i < categRefs.buttonsQuantity; i++) {
    sectionMarkup += `<button data-section="${sectionName[i]}" class="section-btn">${displayName[i]}</button>`;
  }
  // Create dropdown list for rest of results
  sectionMarkup += '<div class="dropdown-positioner">';
  sectionMarkup += '<div class="dropdown">';
  sectionMarkup += `<button class="other-btn">
  ${categRefs.listButtonName}
  </button>`;
  sectionMarkup += '<div class="dropdown-content">';

  for (let j = categRefs.buttonsQuantity; j < sectionName.length; j++) {
    sectionMarkup += `<button class ="dropdown-item" type='button' data-section="${sectionName[j]}">${displayName[j]}</button>`;
  }

  sectionMarkup += '</div>';
  sectionMarkup += '<div class="dropdown-ruler"></div>';
  sectionMarkup += '</div>';
  sectionMarkup += '</div>';
  renderSectionMarkup(sectionMarkup);
}

export function renderSectionMarkup(sectionMarkup) {
  categRefs.categsBlockEL.innerHTML = sectionMarkup;

  // Now markup built, we cand find this elements
  categRefs.categsListBtn = document.querySelector('.other-btn');
  categRefs.categsListBtn.addEventListener('mouseenter', onCategListOpen);
  categRefs.sectionButtons = document.querySelectorAll('.section-btn');
  categRefs.dropdownContent = document.querySelector('.dropdown-content');
  categRefs.dropdown = document.querySelector('.dropdown-content');
  categRefs.dropdown = document.querySelector('.dropdown');
}

// ---------відкриття і закриття меню---------
export function onCategListOpen() {
  categRefs.dropdownContent.classList.add('dropdown-content-open');
  categRefs.dropdownContent.classList.remove('dropdown-content-close');
  categRefs.dropdownContent.style.display = 'block';
  // categRefs.categsListBtn.style.fill = "#FFFFFF";

  categRefs.categsListBtn.removeEventListener('mouseenter', onCategListOpen);
  categRefs.dropdown.addEventListener('mouseleave', onCategListClose);
}

export function onCategListClose() {
  categRefs.dropdownContent.classList.add('dropdown-content-close');
  categRefs.dropdownContent.classList.remove('dropdown-content-open');
  // categRefs.categsListBtn.style.fill = "#4440F7";
  categRefs.dropdownContent.style.display = 'none';

  categRefs.dropdown.removeEventListener('mouseleave', onCategListClose);
  categRefs.categsListBtn.addEventListener('mouseenter', onCategListOpen);
}

export function activeBtnColorHandler(evt) {
  if (evt.target.matches('.section-btn, .other-btn')) {
    const buttons = document.querySelectorAll('.section-btn, .other-btn');
    buttons.forEach(button => {
      button.classList.remove('btn-active');
    });
    evt.target.classList.add('btn-active');
  }
}

export function onDropdownItemClick(evt) {
  categRefs.dropdownContent.classList.add('dropdown-content-open');
}

function onResize() {
getSectionListData();
}