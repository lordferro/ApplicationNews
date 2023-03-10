//===добавляет избранное в локальное хранилище ==========
export function setReadInLocalStor({
  resultsArr,
  clickedArticleId,
  evt,
}) {
  const STORAGE_READ_KEY = 'read';
  resultsArr.forEach(article => {
    if (
      article.id == clickedArticleId ||
      article.slug_name == clickedArticleId ||
      article._id == clickedArticleId
    ) {
      let savedData = localStorage.getItem(STORAGE_READ_KEY);
      
      // проверка или есть уже обьект
      savedData = savedData ? JSON.parse(savedData) : {};

      article.dateOfReading = getTime();   
        savedData[clickedArticleId] = article;
        
        localStorage.setItem(STORAGE_READ_KEY, JSON.stringify(savedData));
        
    }
  });
}

function getTime(){
  const date = new Date().getDate();
  const month = (new Date().getMonth() + 1);
  const year = new Date().getFullYear();
  let DateOfRead = (`${date}/${month}/${year}`)
  return DateOfRead;
}
//== добавляет избранное в локальное хранилище. конец ==========
