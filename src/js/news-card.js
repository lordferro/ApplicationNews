const STORAGE_FAVORITES_KEY = 'favorites';

let favIconClass = "fav-icon-add";

export function createmarkup({
  publishedDate,
  sectionName,
  articleTitle,
  shortDescription,
  urlOriginalArticle,
  imgUrl,
  articleId,
}) {
  let textLength = shortDescription;
  if (shortDescription.length > 110) {
    const spaceIndex = shortDescription.indexOf(' ', 110);
    if (spaceIndex > 0) {
      textLength = shortDescription.slice(0, spaceIndex) + '...';
    }
  }
  let titleLength = articleTitle;
  if (articleTitle.length > 58) {
    const spaceIndex = articleTitle.indexOf(' ', 44);
    if (spaceIndex > 0) {
      titleLength = articleTitle.slice(0, spaceIndex) + '...';
    }
  }
  // проверка или новость есть в локальном избранное
  let favoritesBtnText = 'Add to favorites';
  const favorites = localStorage.getItem(STORAGE_FAVORITES_KEY);
  if (favorites) {
    const parsedFavorites = JSON.parse(favorites);
    const favoritesKeys = Object.keys(parsedFavorites);
    for (const favoriteKey of favoritesKeys) {
      const parsedFavorite = parsedFavorites[`${favoriteKey}`];
      const { id, _id, slug_name } = parsedFavorite;

      const articleIdInFavorites = id || _id || slug_name;
      if (articleId === articleIdInFavorites) {
        favoritesBtnText = 'Remove from favorites';
        favIconClass = "fav-icon-remove";
      } else {favIconClass = "fav-icon-add";}
    }
  }

 let favIcon =
    `<svg class="fav-icon ${favIconClass}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 3C4.239 3 2 5.216 2 7.95c0 2.207.875 7.445 9.488 12.74a.985.985 0 0 0 1.024 0C21.125 15.395 22 10.157 22 7.95C22 5.216 19.761 3 17 3s-5 3-5 3s-2.239-3-5-3Z"/></svg>`;
  return `
      <article class="card" id="${articleId}">

        <div class="card__img-container" >
          <div class="card__blur" id_card="${articleId}">
            <p class="card__already-read">
              Already read ✓
            </p>
            </div>
          <img class="card__img" src="${imgUrl}" alt="${articleTitle}">
          <p class="card__section-name">
            ${sectionName}
          </p>
          <button class="card__btn" type="button">
           ${favoritesBtnText}
          </button>
          ${favIcon}
        </div>
        <h2 class="card__title">
          ${titleLength}
        </h2>
        <p class="card__text">${textLength}</p>
        <div class="card__bottom">
          <span class="card__date">
            ${publishedDate}
          </span>
          <a class="card__read-more-search"
            href="${urlOriginalArticle}" target="_blank"
          >
            Read more
          </a>
        </div>
      </article>
    `;
}
