import {createmarkup} from './news-card';
import {publishedDateFormatter} from './publishedDateFormatter';
import { pagRefs } from '../index';

export class PaginationLogicCategory {
  constructor() {
    // эта страница для уже загруженных новостей
    this.page = 0;
    this.resultsArr = [];
    // это приходит из функции пагинации!!!!!!!!!!!!!!!!!!!!!!!!!!
    this.newsPerPage = 7;
    this.markupAll = '<div class="weatherWidget"></div>';
    this.total = 0;
  }

  getResultForPage() {
    return this.resultsArr.slice(
      this.newsPerPage * this.page,
      this.newsPerPage * this.page + this.newsPerPage
    );
  }

  // перебор массива  части статтей  и рендеринг их с погодой
  getMarkupAll() {
    this.markupAll = '<div class="weatherWidget"></div>';
    if (this.getResultForPage().length < this.newsPerPage) {
      pagRefs.next.classList.add("hide");
    }
    this.getResultForPage().forEach(
      ({
        abstract,
        published_date,
        section,
        title,
        multimedia,
        url,
        slug_name,
      }) => {
        const articleId = slug_name;
        const publishedDate = publishedDateFormatter(published_date);
        const sectionName = section;
        const articleTitle = title;
        const shortDescription = abstract;
        const urlOriginalArticle = url;
        let imgUrl = '';

        try {
          imgUrl = multimedia[2].url;
          //   якщо треба інший розмір картинки
          // console.log(media[0]['media-metadata']);
        } catch (error) {
          imgUrl =
            'https://t4.ftcdn.net/jpg/00/89/55/15/240_F_89551596_LdHAZRwz3i4EM4J0NHNHy2hEUYDfXc0j.jpg';
        }

        this.markupAll += createmarkup({
          publishedDate,
          sectionName,
          articleTitle,
          shortDescription,
          urlOriginalArticle,
          imgUrl,
          articleId,
        });
      }
    );
    return this.markupAll;
  }

  resetPage() {
   return this.page = 0;
  }
}
