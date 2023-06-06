export default class Spinner {
  constructor(selector) {
    this.refs = this.getRefs(selector);
  }

  getRefs(selector) {
    const refs = {};
    refs.spinner = document.querySelector('.loader');
    return refs;
  }

  show() {
    this.refs.spinner.classList.remove('is-hidden');
  }

  hide() {
    this.refs.spinner.classList.add('is-hidden');
  }
}
