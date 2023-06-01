// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// const lightbox = new SimpleLightbox('.gallery a', {
//   /* options */
// });

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { getImages } from './find-image-api';

const refs = {
  searchForm: document.querySelector('.search-form'),
  submitBtn: document.querySelector('.search-form__btn'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

// console.log();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  const search = e.currentTarget.elements.searchQuery.value;
  if (!search) {
    onEmptySearchQuery();
    return;
  }
  getImages(search).then(insertMarkupImages);
}

function onLoadMore(e) {
  //   getImages(search).then(insertMarkupImages);
}

function onEmptySearchQuery() {
  Notify.failure('Please, enter a search query.', {
    width: '300px',
    position: 'center-top',
    fontSize: '16px',
  });
}

function insertMarkupImages(data) {
  const arr = createArrayDataForMarkup(data);

  const str = createMarkupImages(arr);
  refs.gallery.insertAdjacentHTML('beforeend', str);
}

function createArrayDataForMarkup(obj) {
  return obj.data.hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      };
    }
  );
}

function createMarkupImages(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
          <img
            src="${webformatURL}"
            alt="${tags}"
            loading="lazy"
            width="300"
          />
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
            </p>
            <p class="info-item">
              <b>Views</b>
            </p>
            <p class="info-item">
              <b>Comments</b>
            </p>
            <p class="info-item">
              <b>Downloads</b>
            </p>
          </div>
        </div>`;
      }
    )
    .join('');
}
