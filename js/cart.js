document.addEventListener('DOMContentLoaded', () => {
  if (!requireLogin() || !requireRole('client')) return;

  const root = $('#cart-content');

  const render = () => {
    const cart = Store.cart();
    const books = Store.books();
    const rows = cart.items
      .map(item => ({ item, book: books.find(book => book.id === item.bookId) }))
      .filter(row => row.book);

    if (!rows.length) {
      root.innerHTML = `
        <div class="empty-state">
          <div class="empty-cart-icon" aria-hidden="true"><i class="fa-solid fa-cart-shopping"></i></div>
          <h2>Your next favorite is waiting.</h2>
          <p>Your bag is empty. Let’s find something wonderful.</p>
          <a class="button button-dark" href="catalog.html">Browse books</a>
        </div>`;
      return;
    }

    const subtotal = cart.subtotal(books);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    root.innerHTML = `
      <div class="cart-layout">
        <section class="cart-list" aria-label="Cart items">
          <div class="admin-toolbar">
            <h2>Your books</h2>
            <button class="text-link" id="clear-cart">Clear cart</button>
          </div>
          <div class="table-wrap">
            <table class="data-table cart-table">
              <thead>
                <tr><th>Book</th><th>Price</th><th>Quantity</th><th>Total</th><th><span class="sr-only">Remove</span></th></tr>
              </thead>
              <tbody>
                ${rows.map(({ item, book }) => {
                  const currentPrice = bookPrice(book);
                  const price = book.onSale && currentPrice < Number(book.price)
                    ? `<span class="sale-prices"><del class="old-price">${money(book.price)}</del><strong class="sale-price">${money(currentPrice)}</strong></span>`
                    : money(currentPrice);

                  return `
                    <tr>
                      <td data-label="Book">
                        <div class="table-book">
                          <a href="book-details.html?id=${encodeURIComponent(book.id)}"><img src="${escapeHtml(book.cover)}" alt="Cover of ${escapeHtml(book.title)}" loading="lazy"></a>
                          <span><a href="book-details.html?id=${encodeURIComponent(book.id)}" title="${escapeHtml(book.title)}">${escapeHtml(book.title)}</a><br><span class="required-note">${escapeHtml(book.author)}</span></span>
                        </div>
                      </td>
                      <td data-label="Price">${price}</td>
                      <td data-label="Quantity">
                        <div class="qty-control">
                          <button data-qty="${book.id}" data-delta="-1" aria-label="Decrease quantity"><i class="fa-solid fa-minus" aria-hidden="true"></i></button>
                          <span>${item.quantity}</span>
                          <button data-qty="${book.id}" data-delta="1" aria-label="Increase quantity"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>
                        </div>
                      </td>
                      <td data-label="Total"><strong>${money(currentPrice * item.quantity)}</strong></td>
                      <td data-label="Action"><button class="remove-btn" data-remove="${book.id}" aria-label="Remove ${escapeHtml(book.title)}"><i class="fa-solid fa-trash" aria-hidden="true"></i></button></td>
                    </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </section>
        <aside class="summary-card">
          <h2>Order summary</h2>
          <div class="summary-line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
          <div class="summary-line"><span>Estimated tax (8%)</span><span>${money(tax)}</span></div>
          <div class="summary-line"><span>Shipping</span><span>${subtotal >= 50 ? 'Free' : 'Calculated at checkout'}</span></div>
          <div class="summary-line total"><span>Total</span><span>${money(total + (subtotal >= 50 ? 0 : 4.95))}</span></div>
          <a class="button button-dark" href="checkout.html">Continue to checkout <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
          <p class="summary-note">Taxes and shipping are estimates. Payment is not collected in this demo.</p>
        </aside>
      </div>`;
  };

  root.addEventListener('click', async event => {
    if (event.target.closest('#clear-cart')) {
      const confirmed = await confirmAction(
        'Clear your bag?',
        'All items will be removed from your cart.',
        'Clear cart'
      );

      if (confirmed) {
        Store.saveCart(new ShoppingCart());
        showToast('Your cart is clear.');
        render();
      }
      return;
    }

    const quantityButton = event.target.closest('[data-qty]');
    if (quantityButton) {
      const bookId = quantityButton.dataset.qty;
      const delta = Number(quantityButton.dataset.delta);
      const cart = Store.cart();
      const item = cart.items.find(line => line.bookId === bookId);
      const book = Store.books().find(entry => entry.id === bookId);
      const nextQuantity = item.quantity + delta;

      if (delta > 0 && nextQuantity > book.stock) {
        showAlert(
          'Not enough stock',
          `Only ${book.stock} ${book.stock === 1 ? 'copy' : 'copies'} available.`,
          'warning'
        );
        return;
      }

      if (nextQuantity === 0) {
        const confirmed = await confirmAction(
          'Remove this book?',
          'It will be removed from your cart.',
          'Remove'
        );
        if (!confirmed) return;
      }

      cart.setQuantity(bookId, nextQuantity);
      Store.saveCart(cart);
      showToast(nextQuantity === 0 ? 'Book removed from your cart.' : 'Quantity updated.');
      render();
      return;
    }

    const removeButton = event.target.closest('[data-remove]');
    if (removeButton) {
      const confirmed = await confirmAction(
        'Remove this book?',
        'It will be removed from your cart.',
        'Remove'
      );
      if (!confirmed) return;

      const cart = Store.cart();
      cart.remove(removeButton.dataset.remove);
      Store.saveCart(cart);
      showToast('Book removed from your cart.');
      render();
    }
  });

  render();
});
