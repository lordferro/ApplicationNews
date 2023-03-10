import { searchNewsPagination } from '../index';
import { populateNews } from '../index';
import { newsFetchApi } from '../index';
import { pagRefs } from '../index';

//=== пагинация по категориям новостей -- начало
export function onPaginationSearchPrevClick() {
  searchNewsPagination.page -= 1;

  searchNewsPagination.markupAll = '<div class="weatherWidget"></div>';
  const markupAll = searchNewsPagination.getMarkupAll();
  populateNews(markupAll);
  if (searchNewsPagination.page === 0) {
    pagRefs.prev.classList.add("hide");
  }
  // pagRefs.next.classList.remove("hide");
}

export function onPaginationSearchNextClick() {
  searchNewsPagination.page += 1;
   pagRefs.prev.classList.remove("hide");


  // так как сервер отдаёт по 20 новостей, а мы отображаем меньше, проверяем или нужно еще догружать
  if (
    searchNewsPagination.page ===
    Math.floor(
      searchNewsPagination.resultsArr.length / searchNewsPagination.newsPerPage
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

  searchNewsPagination.markupAll = '<div class="weatherWidget"></div>';
  const markupAll = searchNewsPagination.getMarkupAll();
  populateNews(markupAll);

  // if (searchNewsPagination.total / searchNewsPagination.newsPerPage < searchNewsPagination.page + 1) {
  //   pagRefs.next.classList.add("hide");
  // }
  // pagRefs.prev.classList.remove("hide");
}
//=== пагинация по категориям новостей -- конец
