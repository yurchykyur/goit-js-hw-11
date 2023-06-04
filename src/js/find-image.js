// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// const lightbox = new SimpleLightbox('.gallery a', {
//   /* options */
// });

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { ApiPixabay } from './find-image-api';

import LoadMoreBtn from './load-more-btn';

const getImagesPixabay = new ApiPixabay();
const loadMoreBtn = new LoadMoreBtn('.load-more');

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

  if (getImagesPixabay.query !== e.currentTarget.elements.searchQuery.value) {
    getImagesPixabay.query = e.currentTarget.elements.searchQuery.value;
    loadMoreBtn.hide();
  } else if (!getImagesPixabay.query) {
    onEmptySearchQuery();
    return;
  } else {
    return;
  }

  getImagesPixabay.resetPage();
  refs.gallery.innerHTML = '';

  getImagesPixabay
    .getImages()
    .then(reviseEmptyData)
    .then(alertFoundTotalHits)
    .then(insertMarkupImages)
    .catch(error => {
      console.log(error);
      badRequest(error);
      console.error(error);
    });
}

function onLoadMore(e) {
  getImagesPixabay.increasePage();
  getImagesPixabay
    .getImages()
    .then(reviseEmptyData)
    .then(insertMarkupImages)
    .catch(error => {
      console.log(error);
      badRequest(error);
      console.error(error);
    });
}

function reviseEmptyData(response) {
  if (!response.data.hits.length && Array.isArray(response.data.hits)) {
    onEmptyArrayOfData();
    throw new Error(
      console.log(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
  }
  return response;
}

function onEmptyArrayOfData() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      width: '350px',
      position: 'center-top',
      fontSize: '16px',
    }
  );
}

function alertFoundTotalHits(response) {
  const totalHits = response.data.totalHits;
  Notify.success(`Hooray! We found ${totalHits} images.`, {
    width: '350px',
    position: 'center-top',
    fontSize: '16px',
  });
  return response;
}

function onEmptySearchQuery() {
  Notify.failure('Please, enter a search query.', {
    width: '300px',
    position: 'center-top',
    fontSize: '16px',
  });
}

function badRequest(error) {
  if (error.request) {
    Notify.failure('Bad request to external server, try again.', {
      width: '300px',
      position: 'center-top',
      fontSize: '16px',
    });
  }
}

function insertMarkupImages(data) {
  const arr = createArrayDataForMarkup(data);

  const str = createMarkupImages(arr);
  refs.gallery.insertAdjacentHTML('beforeend', str);
  loadMoreBtn.show();
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
