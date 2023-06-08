import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { ApiPixabay } from './find-image-api';
import LoadMoreBtn from './load-more-btn';
import { NotiflixNotify } from './notiflix-message';
import smoothScrollForImages from './smooth-scroll';
import Spinner from './spinner';
import throttle from 'lodash.throttle';

let lightbox;

const getImagesPixabay = new ApiPixabay();
const loadMoreBtn = new LoadMoreBtn('.load-more');
const notiflixNotify = new NotiflixNotify();
const spinner = new Spinner('.loader');

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

let addControllerForInfiniteScroll = true;

refs.searchForm.addEventListener('submit', onSearch);
// refs.loadMoreBtn.addEventListener('click', onLoadMore);

/**
 *a function that, after clicking on the send search query button, 
 performs search query checks, transmits the search query, 
 creates markup and displays it in html
 * @param {Event} e click on button
 * @returns nothing return, used for stop function
 */
function onSearch(e) {
  e.preventDefault();
  if (!e.currentTarget.elements.searchQuery.value) {
    notiflixNotify.onEmptySearchQuery();
    return;
  }

  const searchQuery = e.currentTarget.elements.searchQuery.value;

  if (getImagesPixabay.query !== searchQuery) {
    getImagesPixabay.query = searchQuery;
    loadMoreBtn.hide();
  } else {
    notiflixNotify.writeNewSearchQuery();

    return;
  }

  spinner.show();
  getImagesPixabay.resetPage();
  refs.gallery.innerHTML = '';

  getImagesPixabay
    .getImages()
    .then(reviseEmptyData)
    .then(alertFoundTotalHits)
    .then(resp => {
      // loadMoreBtn.show();
      reviseTheEndTotalHits();
      insertMarkupImages(resp);
      smoothScrollForImages(0.25);
      lightbox = new SimpleLightbox('.gallery a', {});
    })
    .catch(error => {
      console.log(error);
      badRequest(error);
      console.error(error);
    })
    .finally(_ => {
      spinner.hide();
      window.addEventListener('scroll', throttle(infiniteScroll, 500));
    });
}

/**
 * a function that follows the view position until the end of the picture block,
 * sends a search query, performs search query checks, transmits the search query,
 * creates a markup and displays it in html
 */
function infiniteScroll() {
  const documentRect = refs.gallery.getBoundingClientRect();

  console.log('documentRect.top', documentRect.top);

  console.log('documentRect.bottom', documentRect.bottom);
  console.log(
    'document.documentElement.clientHeight',
    document.documentElement.clientHeight
  );
  console.log('refs.gallery.clientHeight', refs.gallery.clientHeight);

  if (
    documentRect.bottom < document.documentElement.clientHeight + 150 &&
    addControllerForInfiniteScroll
  ) {
    addControllerForInfiniteScroll = false;
    spinner.show();
    getImagesPixabay.increasePage();
    getImagesPixabay
      .getImages()
      .then(reviseEmptyData)
      .then(resp => {
        reviseTheEndTotalHits();
        insertMarkupImages(resp);
        lightbox.refresh();
      })
      .catch(error => {
        console.log('infiniteScroll', error);
        badRequest(error);
        console.error(error);
      })
      .finally(_ => {
        spinner.hide();
      });
  }
}

/**
 * a function that, after clicking on the Load more button,
 * sends a search query, performs search query checks, transmits the search query,
 * creates a markup and displays it in html
 * @param {Event} e click on button
 */
// function onLoadMore(e) {
//   spinner.show();
//   getImagesPixabay.increasePage();
//   getImagesPixabay
//     .getImages()
//     .then(reviseEmptyData)
//     .then(resp => {
//       reviseTheEndTotalHits();
//       insertMarkupImages(resp);
//       smoothScrollForImages(1.35);
//       lightbox.refresh();
//     })
//     .catch(error => {
//       console.log(error);
//       badRequest(error);
//       console.error(error);
//     })
//     .finally(_ => {
//       spinner.hide();
//     });
// }

/**
 * a function that checks whether all search elements have already been displayed
 */
function reviseTheEndTotalHits() {
  const hitsOnShow = getImagesPixabay.page * getImagesPixabay.hitsPerPage;
  addControllerForInfiniteScroll = true;
  if (getImagesPixabay.totalHits <= hitsOnShow) {
    addControllerForInfiniteScroll = false;
    loadMoreBtn.hide();

    if (getImagesPixabay.totalHits > getImagesPixabay.hitsPerPage) {
      notiflixNotify.theEndTotalhitsMessage();
    }
  }
}

/**
 * function that checks if we have received data for our search query
 * @param {Promise} response
 * @returns promise
 */
function reviseEmptyData(response) {
  if (!response.data.hits.length && Array.isArray(response.data.hits)) {
    notiflixNotify.onEmptyArrayOfData();
    throw new Error(
      console.log(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
  }
  return response;
}

/**
 * a function that checks how many items we have found for the user's search query and notifies him
 * @param {Promise} response
 * @returns promise
 */
function alertFoundTotalHits(response) {
  const totalHits = response.data.totalHits;
  getImagesPixabay.totalHits = totalHits;
  notiflixNotify.alertMessageFoundTotalHits(totalHits);

  return response;
}

/**
 * a function that checks whether a request to a remote server has failed or not
 * and notifies the user about it
 * @param {Error} error
 */
function badRequest(error) {
  if (error.request) {
    notiflixNotify.badRequestMessage();
  }
}

/**
 * a function that adds html markup to get a string. The function includes additional
 * functions for processing data and converting them into a string.
 * @param {Object} data
 */
function insertMarkupImages(data) {
  refs.gallery.insertAdjacentHTML('beforeend', createMarkupImages(data));
}

/**
 * a function that converts an object into a string for markup
 * @param {Object} arr
 * @returns string of markup
 */
function createMarkupImages(obj) {
  return obj.data.hits
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
