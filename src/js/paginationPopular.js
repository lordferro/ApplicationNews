import { popularNewsPagination } from '../index';
import { populateNews } from '../index';
import { pagRefs } from '../index';

//=== пагинация популярных новостей -- начало
export function onPaginationPopularPrevClick() {
  popularNewsPagination.page -= 1;
    pagRefs.next.classList.remove("hide");
  popularNewsPagination.markupAll = '<div class="weatherWidget"></div>';
  const markupAll = popularNewsPagination.getMarkupAll();
  populateNews(markupAll);
  if (popularNewsPagination.page === 0) {
    pagRefs.prev.classList.add("hide");
  } 
  pagRefs.next.classList.remove("hide");
}
export function onPaginationPopularNextClick() {
  popularNewsPagination.page += 1;
  popularNewsPagination.markupAll = '<div class="weatherWidget"></div>';
  const markupAll = popularNewsPagination.getMarkupAll();
  populateNews(markupAll);
  pagRefs.prev.classList.remove("hide");
  if (popularNewsPagination.total / popularNewsPagination.newsPerPage < popularNewsPagination.page +1) {
  
  }
}
//=== пагинация популярных новостей -- конец
