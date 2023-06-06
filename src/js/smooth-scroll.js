/**
 * a function that shifts the viewport to the beginning of the display of found elements
 * @param {Number} multiplier
 */
export default function smoothScrollForImages(multiplier) {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * multiplier,
    behavior: 'smooth',
  });
}
