document.addEventListener('DOMContentLoaded',
  ()=>{
    if(!requireLogin()||!requireRole('client'))return;
    const root=$('#orders-content'),
    user=Store.user(),
    render=()=>{
      let orders=Store.orders().filter(order=>order.userId===user.id);
      if(!orders.length){
        root.innerHTML=`<div class="empty-state"><h2>No orders just yet.</h2><p>Your next great read is only a few pages away.</p><a class="button button-dark" href="catalog.html">Browse the collection</a></div>`;
        return
      }
      root.innerHTML=`<section class="admin-card"><div class="table-wrap"><table class="data-table orders-table"><thead><tr><th>Order</th><th>Books</th><th>Placed</th><th>Total</th><th>Status</th><th>Action</th></tr></thead><tbody>${orders.map(order=>`<tr><td data-label="Order">${
        escapeHtml(order.id)
      }</td><td data-label="Books"><div class="order-books">${
        order.items.map(item=>`<img src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)}" title="${escapeHtml(item.title)}">`).join('')
      }<span>${
        order.items.reduce((n,
            i)=>n+i.quantity,
          0)
      } book(s)</span></div></td><td data-label="Placed">${
        new Date(order.date).toLocaleDateString(undefined,
          {
            year:'numeric',
            month:'short',
            day:'numeric'
          })
      }</td><td data-label="Total">${
        money(order.total)
      }</td><td data-label="Status"><span class="status-pill ${order.status.toLowerCase()}">${
        escapeHtml(order.status)
      }</span></td><td data-label="Action">${
        order.status==='Pending'?`<button class="text-link cancel-order" data-cancel="${escapeHtml(order.id)}">Cancel order</button>`:'—'
      }</td></tr>`).join('')}</tbody></table></div></section>`
    };
    root.addEventListener('click',
      async e=>{
        const button=e.target.closest('[data-cancel]');
        if(!button)return;
        const id=button.dataset.cancel,
        order=Store.orders().find(o=>o.id===id);
        if(!order||order.status!=='Pending')return;
        if(await confirmAction('Cancel this order?',
            `Order ${order.id} will be cancelled and its books returned to inventory.`,
            'Cancel order')){
          const orders=Store.orders().map(o=>o.id===id?{
              ...o,
              status:'Cancelled'
            }:o);
          Store.saveOrders(orders);
          const stockById=new Map();
          order.items.forEach(i=>stockById.set(i.bookId,
              (stockById.get(i.bookId)||0)+i.quantity));
          Store.saveBooks(Store.books().map(book=>stockById.has(book.id)?{
                ...book,
                stock:book.stock+stockById.get(book.id)
              }:book));
          showToast('Order cancelled.');
          render()
        }
      });
    render()
  });
