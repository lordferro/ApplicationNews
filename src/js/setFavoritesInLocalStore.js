export function setFavoritesInLocalStor({
  resultsArr,
  clickedArticleId,
  evt,
}) {
  const STORAGE_FAVORITES_KEY = 'favorites';
  resultsArr.forEach(article => {
    if (
      article.id == clickedArticleId ||
      article.slug_name == clickedArticleId ||
      article._id == clickedArticleId
    ) {
      let savedData = localStorage.getItem(STORAGE_FAVORITES_KEY);

      // проверка или есть уже обьект
      savedData = savedData ? JSON.parse(savedData) : {};

      if (savedData[clickedArticleId]) {
        delete savedData[`${clickedArticleId}`];

        const compareString = evt.target.textContent.trim()
        if ((compareString === 'Remove from favorites')) {
          evt.target.textContent = 'Add to favorites';
  

        }

        localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(savedData));
        return;
      } else {
        savedData[clickedArticleId] = article;

        localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(savedData));
      }
    }
  });
}