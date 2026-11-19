document.addEventListener('DOMContentLoaded', () => {
  const bookId = new URLSearchParams(location.search).get('id');
  const book = Store.books().find(item => item.id === bookId);
  const root = $('#book-detail');

  if (!book) {
    root.innerHTML = `
      <div class="empty-state">
        <h1>We couldn’t find that book.</h1>
        <a class="button button-dark" href="catalog.html">Browse the collection</a>
      </div>`;
    return;
  }

  document.title = `${book.title} — Chapter & Co.`;

  const isArabic = book.language === 'ar';
  const languageAttributes = isArabic ? ' lang="ar" dir="rtl"' : '';
  const stars = Array.from({ length: 5 }, (_, index) => {
    const style = index < Math.round(book.rating) ? 'solid' : 'regular';
    return `<i class="fa-${style} fa-star" aria-hidden="true"></i>`;
  }).join('');
  const badgeText = book.onSale
    ? 'On Sale'
    : book.bestSeller
      ? 'Best Seller'
      : book.isNew
        ? 'New'
        : '';
  const badgeClass = book.onSale
    ? 'badge-sale'
    : book.bestSeller
      ? 'badge-bestseller'
      : book.isNew
        ? 'badge-new'
        : '';
  const canShop = Store.currentUser()?.role !== 'admin';
  const stockStatus = book.stock
    ? `In Stock · ${book.stock} available`
    : 'Out of Stock';
  const priceMarkup = book.onSale && bookPrice(book) < Number(book.price)
    ? `<div class="detail-price sale-prices"><del class="old-price">${money(book.price)}</del><strong class="sale-price">${money(bookPrice(book))}</strong></div>`
    : `<div class="detail-price">${money(book.price)}</div>`;
  const purchaseControls = canShop
    ? `
      <div class="detail-actions">
        <label class="sr-only" for="detail-qty">Quantity</label>
        <input class="quantity-input" id="detail-qty" type="number" min="1" max="${book.stock}" value="1" ${book.stock ? '' : 'disabled'}>
        <button class="button button-dark" id="detail-add" ${book.stock ? '' : 'disabled'}>
          <i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Add to Cart
        </button>
      </div>`
    : '';

  root.innerHTML = `
    <p class="crumb">
      <a href="index.html">Home</a> /
      <a href="catalog.html">Browse</a> /
      <span${languageAttributes}>${escapeHtml(book.title)}</span>
    </p>
    <article class="detail-layout${isArabic ? ' arabic-detail' : ''}"${isArabic ? ' lang="ar" dir="rtl"' : ''}>
      <figure class="detail-cover-panel">
        ${badgeText ? `<span class="badge ${badgeClass}">${badgeText}</span>` : ''}
        <img class="detail-cover" src="${escapeHtml(book.cover)}" alt="Cover of ${escapeHtml(book.title)}" loading="lazy">
        <figcaption class="sr-only">${escapeHtml(book.title)} by ${escapeHtml(book.author)}</figcaption>
      </figure>
      <section class="detail-info">
        <span class="eyebrow">${escapeHtml(book.category)}</span>
        <h1${languageAttributes}>${escapeHtml(book.title)}</h1>
        <p class="book-author"${languageAttributes}>${escapeHtml(book.author)}</p>
        <div class="detail-rating" aria-label="Rated ${book.rating} out of 5">
          ${stars}<span>${book.rating.toFixed(1)} / 5 reader rating</span>
        </div>
        <p class="detail-description"${languageAttributes}>${escapeHtml(book.description)}</p>
        ${priceMarkup}
        <p class="stock-status ${book.stock ? '' : 'out'}">${stockStatus}</p>
        ${purchaseControls}
        <p class="required-note detail-note">Free shipping on orders over $50. Thoughtfully packed with care.</p>
      </section>
    </article>`;

  $('#detail-add')?.addEventListener('click', () => {
    const quantity = Number($('#detail-qty').value) || 1;
    addToCart(book.id, quantity);
  });
});
