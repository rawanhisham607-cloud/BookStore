const SEARCH_DEBOUNCE_MS = 300;

function normalizeBookSearch(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي');
}

document.addEventListener('DOMContentLoaded', () => {
  const books = Store.books();
  const params = new URLSearchParams(location.search);
  const category = $('#filter-category');
  const search = $('#catalog-search');
  const sort = $('#sort-books');
  const price = $('#filter-price');
  const stock = $('#filter-stock');
  const language = $('#filter-language');

  [...new Set(books.map(book => book.category))]
    .sort((first, second) => first.localeCompare(second, 'ar'))
    .forEach(value => {
      category.insertAdjacentHTML(
        'beforeend',
        `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`
      );
    });

  if (params.get('category')) category.value = params.get('category');
  if (params.get('q')) search.value = params.get('q');
  if (params.get('sort')) sort.value = params.get('sort');
  if (params.get('language')) language.value = params.get('language');

  let searchTimer;

  const render = () => {
    const query = normalizeBookSearch(search.value);
    const maxPrice = Number(price.value);
    $('#price-label').textContent = money(maxPrice);

    const list = Store.books().filter(book => {
      const searchableText = normalizeBookSearch(`${book.title} ${book.author}`);
      return (!query || searchableText.includes(query))
        && (!category.value || book.category === category.value)
        && (!language.value || book.language === language.value)
        && bookPrice(book) <= maxPrice
        && (!stock.checked || book.stock > 0);
    });

    switch (sort.value) {
      case 'price-asc':
        list.sort((first, second) => bookPrice(first) - bookPrice(second));
        break;
      case 'price-desc':
        list.sort((first, second) => bookPrice(second) - bookPrice(first));
        break;
      case 'title':
        list.sort((first, second) => first.title.localeCompare(second.title, 'ar'));
        break;
      case 'rating':
        list.sort((first, second) => second.rating - first.rating);
        break;
    }

    $('#result-count').textContent = `${list.length} ${list.length === 1 ? 'book' : 'books'} to explore`;
    $('#catalog-grid').innerHTML = list.map(bookCard).join('');
    $('#no-results').classList.toggle('hidden', list.length > 0);
  };

  search.addEventListener('input', () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(render, SEARCH_DEBOUNCE_MS);
  });

  [category, sort, price, stock, language].forEach(element => {
    element.addEventListener('change', render);
  });

  $('#clear-filters').addEventListener('click', () => {
    category.value = '';
    search.value = '';
    sort.value = 'featured';
    price.value = 60;
    stock.checked = false;
    language.value = '';
    render();
  });

  render();
});
