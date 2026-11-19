document.addEventListener('DOMContentLoaded', () => {
  if (!requireLogin() || !requireRole('client')) return;

  const root = $('#checkout-content');
  const user = Store.currentUser();
  const cart = Store.cart();
  const books = Store.books();
  const items = cart.items
    .map(item => ({ item, book: books.find(book => book.id === item.bookId) }))
    .filter(line => line.book);

  if (!items.length) {
    root.innerHTML = `
      <div class="empty-state">
        <h2>Your bag is empty.</h2>
        <p>Add a book before checking out.</p>
        <a href="catalog.html" class="button button-dark">Browse books</a>
      </div>`;
    showAlert('Your cart is empty', 'Add a book before checking out.', 'info')
      .then(() => location.href = 'cart.html');
    return;
  }

  const getTotals = orderItems => {
    const subtotal = orderItems.reduce(
      (sum, { item, book }) => sum + bookPrice(book) * item.quantity,
      0
    );
    const tax = subtotal * 0.08;
    const shipping = subtotal >= 50 ? 0 : 4.95;
    return { subtotal, tax, shipping, total: subtotal + tax + shipping };
  };

  const totals = getTotals(items);
  const priceLabel = (book, quantity) => {
    const price = bookPrice(book);
    const amount = money(price * quantity);

    if (book.onSale && price < Number(book.price)) {
      return `<span class="checkout-price"><del class="old-price">${money(Number(book.price) * quantity)}</del><strong class="sale-price">${amount}</strong></span>`;
    }

    return amount;
  };

  root.innerHTML = `
    <form id="checkout-form" class="checkout-layout" novalidate>
      <section class="form-card">
        <h2>Delivery details</h2>
        <fieldset class="checkout-fields">
          <legend class="sr-only">Enter your delivery details</legend>
          <div class="form-grid">
            <label class="form-field"><span>Full name *</span><input name="name" autocomplete="name" required minlength="2" value="${escapeHtml(user.name || '')}"></label>
            <label class="form-field"><span>Email address *</span><input name="email" type="email" autocomplete="email" required value="${escapeHtml(user.email || '')}"></label>
            <label class="form-field"><span>Phone number *</span><input name="phone" type="tel" autocomplete="tel" required pattern="[0-9+() .-]{7,}" title="Enter a valid phone number" value="${escapeHtml(user.phone || '')}"></label>
            <label class="form-field full"><span>Delivery address *</span><textarea name="address" autocomplete="street-address" required minlength="8"></textarea></label>
          </div>
        </fieldset>
        <p class="required-note">* Required fields. This demo simulates checkout and does not collect payment.</p>
        <button class="button button-dark" type="submit">Place order · ${money(totals.total)} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
      </section>
      <aside class="summary-card">
        <h2>Your books</h2>
        ${items.map(({ item, book }) => `
          <div class="summary-line">
            <span>${escapeHtml(book.title)} × ${item.quantity}</span>
            <span>${priceLabel(book, item.quantity)}</span>
          </div>`).join('')}
        <div class="summary-line"><span>Subtotal</span><span>${money(totals.subtotal)}</span></div>
        <div class="summary-line"><span>Estimated tax</span><span>${money(totals.tax)}</span></div>
        <div class="summary-line"><span>Shipping</span><span>${totals.shipping ? money(totals.shipping) : 'Free'}</span></div>
        <div class="summary-line total"><span>Total</span><span>${money(totals.total)}</span></div>
      </aside>
    </form>`;

  $('#checkout-form').addEventListener('submit', async event => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      const invalidFields = [...form.querySelectorAll(':invalid')]
        .map(field => field.labels?.[0]?.innerText?.replace('*', '').trim() || field.name)
        .filter(Boolean);
      await showAlert(
        'Check the required fields',
        `Please correct: ${invalidFields.join(', ')}.`,
        'warning'
      );
      form.querySelector(':invalid')?.focus();
      return;
    }

    const currentBooks = Store.books();
    const currentCart = Store.cart();

    for (const line of currentCart.items) {
      const book = currentBooks.find(entry => entry.id === line.bookId);
      if (!book || book.stock < line.quantity) {
        await showAlert(
          'Not enough stock',
          `Only ${book?.stock || 0} ${book?.stock === 1 ? 'copy' : 'copies'} of ${book?.title || 'an item'} available. Please review your bag.`,
          'warning'
        );
        location.href = 'cart.html';
        return;
      }
    }

    const currentItems = currentCart.items.map(item => ({
      item,
      book: currentBooks.find(book => book.id === item.bookId)
    }));
    const currentTotals = getTotals(currentItems);
    const formData = Object.fromEntries(new FormData(form));
    const customer = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim()
    };
    const order = new Order({
      userId: user.id,
      items: currentCart.items.map(line => {
        const book = currentBooks.find(entry => entry.id === line.bookId);
        return { ...new OrderItem(book), quantity: line.quantity };
      }),
      total: currentTotals.total,
      customer
    });

    Store.saveBooks(currentBooks.map(book => {
      const line = currentCart.items.find(item => item.bookId === book.id);
      return line ? { ...book, stock: book.stock - line.quantity } : book;
    }));
    Store.saveOrders([order, ...Store.orders()]);
    Store.saveCart(new ShoppingCart());
    updateBadge();

    await showAlert(
      'Order placed',
      `Your order number is ${order.id}. Thank you for reading with us!`,
      'success'
    );
    location.href = 'orders.html';
  });
});
