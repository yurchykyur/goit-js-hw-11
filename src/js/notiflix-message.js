import { Notify } from 'notiflix/build/notiflix-notify-aio';

const options = {
  width: '350px',
  position: 'center-top',
  fontSize: '16px',
};

export function writeNewSearchQuery() {
  Notify.info(
    'Sorry, the search is complete, to change the search query, enter a new search query.',
    options
  );
}

export function onEmptyArrayOfData() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    options
  );
}

export function onEmptySearchQuery() {
  Notify.failure('Please, enter a search query.', options);
}

export function alertMessageFoundTotalHits(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`, options);
}

export function badRequestMessage() {
  Notify.failure('Bad request to external server, try again.', options);
}

export function theEndTotalhitsMessage() {
  Notify.info(
    "We're sorry, but you've reached the end of search results.",
    options
  );
}
