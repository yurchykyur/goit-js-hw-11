import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ApiPixabay } from './find-image-api';
import LoadMoreBtn from './load-more-btn';

const lightboxObj = {};

const getImagesPixabay = new ApiPixabay();
const loadMoreBtn = new LoadMoreBtn('.load-more');

const refs = {
  searchForm: document.querySelector('.search-form'),
  // submitBtn: document.querySelector('.search-form__btn'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  if (!e.currentTarget.elements.searchQuery.value) {
    onEmptySearchQuery();
    return;
  }

  if (getImagesPixabay.query !== e.currentTarget.elements.searchQuery.value) {
    getImagesPixabay.query = e.currentTarget.elements.searchQuery.value;
    loadMoreBtn.hide();
  } else {
    return;
  }

  getImagesPixabay.resetPage();
  refs.gallery.innerHTML = '';

  getImagesPixabay
    .getImages()
    .then(reviseEmptyData)
    .then(alertFoundTotalHits)
    .then(resp => {
      loadMoreBtn.show();
      reviseTheEndTotalHits();
      insertMarkupImages(resp);
      smoothScrollForImages(0.25);
      const lightbox = new SimpleLightbox('.gallery a', {});
      lightboxObj.init = lightbox;
    })
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
    .then(resp => {
      reviseTheEndTotalHits();
      insertMarkupImages(resp);
      smoothScrollForImages(1.35);
      lightboxObj.init.refresh();
    })
    .catch(error => {
      console.log(error);
      badRequest(error);
      console.error(error);
    });
}

function reviseTheEndTotalHits() {
  const hitsOnShow = getImagesPixabay.page * getImagesPixabay.hitsPerPage;
  if (getImagesPixabay.totalHits <= hitsOnShow) {
    Notify.info("We're sorry, but you've reached the end of search results.", {
      width: '350px',
      position: 'center-top',
      fontSize: '16px',
    });
    console.log(loadMoreBtn.refs.button);
    loadMoreBtn.refs.button.classList.add('is-hidden');
    loadMoreBtn.hide();
  }
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
  getImagesPixabay.totalHits = totalHits;
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
        <a
          class="gallery__large-image"
          href="${largeImageURL}"
        >
        <div class="photo-card__image-wrapper">
          <img
            src="${webformatURL}"
            alt="${tags}"
            loading="lazy"
           
          />
          </div>
          <div class="info">
            <p class="info-item">
              <b>Likes</b><span class="info-item__counter">${likes}</span>
            </p>
            <p class="info-item">
              <b>Views</b><span class="info-item__counter">${views}</span>
            </p>
            <p class="info-item">
              <b>Comments</b><span class="info-item__counter">${comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads</b><span class="info-item__counter">${downloads}</span>
            </p>
          </div>
          </a>
        </div>`;
      }
    )
    .join('');
}

function smoothScrollForImages(multiplier) {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * multiplier,
    behavior: 'smooth',
  });
}
