document.addEventListener('DOMContentLoaded',
  ()=>{
  if(!requireRole('admin'))return;
  const root=$('#admin-content');
  let tab='dashboard',
    editing=null;

  const render=()=>{
    const books=Store.books();
    const users=Store.users();
    const clients=users.filter(user=>user.role==='client');
    const allOrders=Store.orders();
    const activeOrders=allOrders.filter(order=>['Pending',
        'Shipped'].includes(order.status));
    const pending=activeOrders.filter(order=>order.status==='Pending').length;
    const shipped=activeOrders.filter(order=>order.status==='Shipped').length;
    root.innerHTML=`
      <nav class="admin-tabs" aria-label="Dashboard sections">
        <button class="tab-btn ${tab==='dashboard'?'active':''}" data-tab="dashboard">Overview</button>
        <button class="tab-btn ${tab==='books'?'active':''}" data-tab="books">Books & inventory (${books.length})</button>
        <button class="tab-btn ${tab==='orders'?'active':''}" data-tab="orders">Active orders (${activeOrders.length})</button>
        <button class="tab-btn ${tab==='add'?'active':''}" data-tab="add">${editing?'Edit book':'Add a book'}</button>
      </nav>
      ${tab==='dashboard'?dashboardView(books,clients.length,activeOrders,pending,shipped):tab==='books'?booksView(books):tab==='orders'?ordersView(activeOrders,pending,shipped):formView(editing?books.find(book=>book.id===editing):null)}
      <div class="reset-zone"><span>Reset the demo catalog, accounts, carts, and orders on this browser.</span><button class="button button-outline" id="reset-demo">Reset demo data</button></div>`;
    bindAdmin();
    };

  function dashboardView(books,
      clientCount,
      orders,
      pending,
      shipped){
    return `<section class="dashboard-stats" aria-label="Store summary">
      <article class="stat-card"><span>Books in catalog</span><strong>${books.length}</strong><i class="fa-solid fa-book-open" aria-hidden="true"></i></article>
      <article class="stat-card"><span>Client accounts</span><strong>${clientCount}</strong><i class="fa-solid fa-users" aria-hidden="true"></i></article>
      <article class="stat-card"><span>Pending orders</span><strong>${pending}</strong><i class="fa-solid fa-box" aria-hidden="true"></i></article>
      <article class="stat-card"><span>Shipped orders</span><strong>${shipped}</strong><i class="fa-solid fa-truck" aria-hidden="true"></i></article>
    </section>
    <div class="dashboard-content">
      <section class="admin-card"><div class="admin-toolbar"><div><span class="eyebrow">Catalog</span><h2>Books and inventory</h2><p class="required-note">${books.length} books currently available in the store catalog.</p></div><div class="admin-form-actions"><button class="button button-outline" data-tab="books">Manage books</button><button class="button button-dark" data-tab="add"><i class="fa-solid fa-plus" aria-hidden="true"></i> Add book</button></div></div>${dashboardBooksTable(books.slice(0,5))}</section>
      ${ordersView(orders,pending,shipped,'Recent client orders')}
    </div>`;
    }

  function dashboardBooksTable(books){
    return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Book</th><th>Language</th><th>Category</th><th>Stock</th></tr></thead><tbody>${books.map(book=>`<tr><td data-label="Book"><div class="table-book"><img src="${escapeHtml(book.cover)}" alt="Cover of ${escapeHtml(book.title)}"><span${
        book.language==='ar'?' lang="ar" dir="rtl"':''
      }>${
        escapeHtml(book.title)
      }<br><span class="required-note">${
        escapeHtml(book.author)
      }</span></span></div></td><td data-label="Language">${
        book.language==='ar'?'عربي':'English'
      }</td><td data-label="Category">${
        escapeHtml(book.category)
      }</td><td data-label="Stock">${
        book.stock
      }</td></tr>`).join('')}</tbody></table></div>`;
    }

  function booksView(books){
    return `<section class="admin-card"><div class="admin-toolbar"><h2>Books & inventory</h2><button class="button button-dark" data-tab="add"><i class="fa-solid fa-plus" aria-hidden="true"></i> Add book</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Book</th><th>Language</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>${books.map(book=>`<tr><td data-label="Book"><div class="table-book"><img src="${escapeHtml(book.cover)}" alt="Cover of ${escapeHtml(book.title)}"><span${
        book.language==='ar'?' lang="ar" dir="rtl"':''
      } title="${escapeHtml(book.title)}">${
        escapeHtml(book.title)
      }<br><span class="required-note">${
        escapeHtml(book.author)
      }</span></span></div></td><td data-label="Language">${
        book.language==='ar'?'عربي':'English'
      }</td><td data-label="Category">${
        escapeHtml(book.category)
      }</td><td data-label="Price">${
        money(book.price)
      }</td><td data-label="Stock"><input class="inline-stock" type="number" min="0" value="${book.stock}" data-stock="${book.id}" aria-label="Stock for ${escapeHtml(book.title)}"></td><td data-label="Actions"><div class="table-actions"><button aria-label="Edit ${escapeHtml(book.title)}" data-edit="${book.id}"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i></button><button class="danger" aria-label="Delete ${escapeHtml(book.title)}" data-delete="${book.id}"><i class="fa-solid fa-trash" aria-hidden="true"></i></button></div></td></tr>`).join('')}</tbody></table></div></section>`;
    }

  function ordersView(orders,
      pending,
      shipped,
      heading='Customer orders'){
    return `<section class="admin-card"><div class="admin-toolbar"><h2>${heading}</h2><div class="order-counts"><span>Pending <strong>${pending}</strong></span><span>Shipped <strong>${shipped}</strong></span></div></div>${orders.length?`<div class="table-wrap"><table class="data-table admin-orders-table"><thead><tr><th>Order number</th><th>Customer</th><th>Email</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead><tbody>${
        orders.map(order=>`<tr><td data-label="Order">${escapeHtml(order.id)}</td><td data-label="Customer">${escapeHtml(order.customerName||order.customer?.name||'')}</td><td data-label="Email">${escapeHtml(order.customerEmail||order.customer?.email||'')}</td><td data-label="Date">${new Date(order.date).toLocaleDateString()}</td><td data-label="Items">${order.items.map(item=>`${
            escapeHtml(item.title)
          } × ${
            item.quantity
          }`).join('<br>')}</td><td data-label="Total">${money(order.total)}</td><td data-label="Status">${escapeHtml(order.status)}</td><td data-label="Action"><label class="sr-only" for="status-${escapeHtml(order.id)}">Change status for ${escapeHtml(order.id)}</label><select id="status-${escapeHtml(order.id)}" class="inline-status" data-status="${escapeHtml(order.id)}" data-current="${escapeHtml(order.status)}">${order.status==='Pending'?'<option value="Pending" selected>Pending</option>':''}<option value="Shipped" ${order.status==='Shipped'?'selected':''}>Shipped</option>${order.status==='Shipped'?'<option value="Delivered">Delivered</option>':''}</select></td></tr>`).join('')
      }</tbody></table></div>`:`<p class="empty-state">There are no pending or shipped orders.</p>`}</section>`;
    }

  function formView(book) {
    const defaultCover = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80';

    return `
      <section class="admin-card admin-form">
        <h2>${book ? 'Edit book details' : 'Add a book to the shelves'}</h2>
        <form id="book-form">
          <fieldset>
            <legend class="sr-only">Book information</legend>
            <div class="form-grid">
              <label class="form-field"><span>Title *</span><input name="title" required value="${escapeHtml(book?.title || '')}" ${book?.language === 'ar' ? 'lang="ar" dir="rtl"' : ''}></label>
              <label class="form-field"><span>Author *</span><input name="author" required value="${escapeHtml(book?.author || '')}" ${book?.language === 'ar' ? 'lang="ar" dir="rtl"' : ''}></label>
              <label class="form-field"><span>Category *</span><input name="category" required value="${escapeHtml(book?.category || '')}"></label>
              <label class="form-field"><span>Language *</span><select name="language" required><option value="en" ${book?.language !== 'ar' ? 'selected' : ''}>English</option><option value="ar" ${book?.language === 'ar' ? 'selected' : ''}>عربي</option></select></label>
              <label class="form-field"><span>Regular price *</span><input name="price" type="number" min="0.01" step="0.01" required value="${book?.price ?? ''}"></label>
              <label class="form-field"><span>Sale price</span><input name="salePrice" type="number" min="0.01" step="0.01" value="${book?.salePrice ?? ''}"><small>Optional; defaults to 20% off when On sale is selected.</small></label>
              <label class="form-field"><span>Stock *</span><input name="stock" type="number" min="0" step="1" required value="${book?.stock ?? 0}"></label>
              <label class="form-field"><span>Rating</span><input name="rating" type="number" min="0" max="5" step="0.1" value="${book?.rating ?? 4.5}"></label>
              <label class="form-field full"><span>Cover image URL *</span><input name="cover" type="url" required value="${escapeHtml(book?.cover || defaultCover)}"></label>
              <label class="form-field full"><span>Description *</span><textarea name="description" required ${book?.language === 'ar' ? 'lang="ar" dir="rtl"' : ''}>${escapeHtml(book?.description || '')}</textarea></label>
              <label class="check-label"><input name="bestSeller" type="checkbox" ${book?.bestSeller ? 'checked' : ''}> Best seller</label>
              <label class="check-label"><input name="onSale" type="checkbox" ${book?.onSale ? 'checked' : ''}> On sale</label>
              <label class="check-label"><input name="isNew" type="checkbox" ${book?.isNew ? 'checked' : ''}> New arrival</label>
            </div>
          </fieldset>
          <div class="admin-form-actions">
            <button class="button button-dark">${book ? 'Save changes' : 'Add book'}</button>
            <button class="button button-outline" type="button" data-tab="books">Cancel</button>
          </div>
        </form>
      </section>`;
  }
  function bindAdmin(){
    root.onclick=async event=>{
      const tabButton=event.target.closest('[data-tab]');
      if(tabButton){
          tab=tabButton.dataset.tab;
          if(tab!=='add')editing=null;
          render();
          return
        }
      const edit=event.target.closest('[data-edit]');
      if(edit){
          editing=edit.dataset.edit;
          tab='add';
          render();
          return
        }
      const del=event.target.closest('[data-delete]');
      if(del){
          const book=Store.books().find(item=>item.id===del.dataset.delete);
          if(await confirmAction('Delete this book?',
              `“${book.title}” will be removed from the catalog.`,
              'Delete')){
            Store.saveBooks(Store.books().filter(item=>item.id!==book.id));
            for(let i=localStorage.length-1;i>=0;i--){
              const key=localStorage.key(i);
              if(key?.startsWith('cart_')){
                const cart=new ShoppingCart(JSON.parse(localStorage.getItem(key)||'[]'));
                cart.remove(book.id);
                localStorage.setItem(key,
                  JSON.stringify(cart.items))
              }
            }
            showToast('Book deleted.');
            render()
          }
          return
        }
      if(event.target.closest('#reset-demo')&&await confirmAction('Reset demo data?',
            'Sample books, accounts, carts, and orders will be cleared.',
            'Reset data'))Store.reset();
      };
    root.onchange=async event=>{
      const target=event.target;
      if(target.matches('[data-stock]')){
          Store.saveBooks(Store.books().map(book=>book.id===target.dataset.stock?{
                ...book,
                stock:Math.max(0,
                  Number(target.value)||0)
              }:book));
          showToast('Inventory updated.')
        }
      if(target.matches('[data-status]')){
          const id=target.dataset.status,
          previous=target.dataset.current,
          orders=Store.orders();
          if(target.value==='Delivered'){
            if(previous!=='Shipped'){
              await showAlert('Ship order first',
                'Move this order to Shipped before marking it Delivered.',
                'warning');
              render();
              return
            }
            if(!await confirmAction('Mark as delivered?',
                `Order #${id} will be marked delivered and removed from the active orders list.`,
                'Mark delivered')){
              render();
              return
            }
            Store.saveOrders(orders.map(order=>order.id===id?{
                  ...order,
                  status:'Delivered'
                }:order));
            showToast(`Order #${id} marked as delivered`);
            render();
            return
          }
          if(target.value==='Shipped'&&previous==='Pending'){
            Store.saveOrders(orders.map(order=>order.id===id?{
                  ...order,
                  status:'Shipped'
                }:order));
            showToast(`Order #${id} marked as shipped`)
          }
          render()
        }
      };
    const form=$('#book-form');
    if(form)form.addEventListener('submit',
        event=>{
          event.preventDefault();
          if(!form.reportValidity())return;
          const data=Object.fromEntries(new FormData(form)),
          language=data.language||'en',
          price=Number(data.price),
          onSale=form.elements.onSale.checked,
          salePrice=Number(data.salePrice)||Number((price*.8).toFixed(2));
          if(onSale&&(salePrice<=0||salePrice>=price)){
            showAlert('Invalid sale price',
              'The sale price must be lower than the regular price.',
              'warning');
            return
          }
          const next={
            id:editing||`book-${Date.now()}`,
            title:data.title.trim(),
            author:data.author.trim(),
            category:data.category.trim(),
            price,
            salePrice:onSale?salePrice:null,
            stock:Number(data.stock),
            rating:Number(data.rating)||4.5,
            cover:data.cover.trim(),
            description:data.description.trim(),
            bestSeller:form.elements.bestSeller.checked,
            onSale,
            isNew:form.elements.isNew.checked,
            language
          },
          books=Store.books(),
          index=books.findIndex(book=>book.id===editing);
          if(index>=0)books[index]=next;
          else books.unshift(next);
          Store.saveBooks(books);
          editing=null;
          tab='books';
          showToast(index>=0?'Book updated.':'Book added to the catalog.');
          render()
        });
    }
  render();
});
