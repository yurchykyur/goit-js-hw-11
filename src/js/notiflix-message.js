import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class NotiflixNotify {
  constructor() {
    this.options = {
      width: '350px',
      position: 'center-top',
      fontSize: '16px',
    };
  }

  writeNewSearchQuery() {
    Notify.info(
      'Sorry, the search is complete, to change the search query, enter a new search query.',
      this.options
    );
  }

  onEmptyArrayOfData() {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      this.options
    );
  }

  onEmptySearchQuery() {
    Notify.failure('Please, enter a search query.', this.options);
  }

  alertMessageFoundTotalHits(totalHits) {
    Notify.success(`Hooray! We found ${totalHits} images.`, this.options);
  }

  badRequestMessage() {
    Notify.failure('Bad request to external server, try again.', this.options);
  }

  theEndTotalhitsMessage() {
    Notify.info(
      "We're sorry, but you've reached the end of search results.",
      this.options
    );
  }
}
