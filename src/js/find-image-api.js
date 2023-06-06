// https://pixabay.com/

const axios = require('axios').default;

export class ApiPixabay {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalHits = 0;
    this.hitsPerPage = 0;
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
