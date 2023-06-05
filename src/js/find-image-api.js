// https://pixabay.com/

const axios = require('axios').default;
// import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class ApiPixabay {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalHits;
    this.hitsPerPage;
  }

  async getImages() {
    const mainUrlApi = 'https://pixabay.com/api/';
    const API_KEY = '36923827-7e58aafe5e36d67095a3a9316';
    const options = {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    };
    this.hitsPerPage = options.per_page;
    const URL = `${mainUrlApi}?key=${API_KEY}&q=${this.searchQuery}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}&page=${this.page}&per_page=${options.per_page}`;

    const response = await axios.get(URL);
    console.log(response);
    return response;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  increasePage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}

// export async function getImages(q, page = 1) {
//   // try {
//   const mainUrlApi = 'https://pixabay.com/api/';
//   const API_KEY = '36923827-7e58aafe5e36d67095a3a9316';
//   const options = {
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     page: page,
//     per_page: 40,
//   };
//   const URL = `${mainUrlApi}?key=${API_KEY}&q=${q}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}&page=${options.page}&per_page=${options.per_page}`;
//   const response = await axios.get(URL);
//   // if (!response.data.hits.length) {
//   //   onEmptyArrayOfData();
//   //   throw new Error(
//   //     console.log(
//   //       'Sorry, there are no images matching your search query. Please try again.'
//   //     )
//   //   );
//   // }
//   // alertFoundTotalHits(response);
//   return response;
//   // } catch (error) {
//   //   console.error(error);
//   // }
// }

// console.log();
// console.log(getImages());

// function onEmptyArrayOfData() {
//   Notify.failure(
//     'Sorry, there are no images matching your search query. Please try again.',
//     {
//       width: '350px',
//       position: 'center-top',
//       fontSize: '16px',
//     }
//   );
// }

// function alertFoundTotalHits(response) {
//   const totalHits = response.data.totalHits;
//   Notify.success(`Hooray! We found ${totalHits} images.`, {
//     width: '350px',
//     position: 'center-top',
//     fontSize: '16px',
//   });
// }
