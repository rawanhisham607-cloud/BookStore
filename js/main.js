const $=(selector,
  root=document)=>root.querySelector(selector);
const $$=(selector,
  root=document)=>[...root.querySelectorAll(selector)];
const money=n=>`$${Number(n||0).toFixed(2)}`;
function alertColor(){
  return getComputedStyle(document.documentElement).getPropertyValue('--forest').trim()||'#173c35'
}
function showToast(message,
  icon='success'){
  if(typeof Swal==='undefined'){
    console.info(message);
    return
  }
  Swal.mixin({
      toast:true,
      position:'top-end',
      showConfirmButton:false,
      timer:2000,
      timerProgressBar:true,
      customClass:{
        popup:'bookstore-swal'
      }
    }).fire({
      icon,
      title:message,
      confirmButtonColor:alertColor()
    })
}
function showAlert(title,
  text='',
  icon='info'){
  if(typeof Swal==='undefined'){
    console.warn(`${title}${text?`: ${
        text
      }`:''}`);
    return Promise.resolve()
  }
  return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText:'OK',
      confirmButtonColor:alertColor(),
      customClass:{
        popup:'bookstore-swal'
      }
    })
}
async function confirmAction(title,
  text,
  confirmText='Yes'){
  if(typeof Swal==='undefined'){
    console.warn(`${title}${text?`: ${
        text
      }`:''}`);
    return false
  }
  const result=await Swal.fire({
      title,
      text,
      icon:'warning',
      showCancelButton:true,
      confirmButtonText:confirmText,
      cancelButtonText:'Cancel',
      confirmButtonColor:alertColor(),
      cancelButtonColor:'#78817c',
      customClass:{
        popup:'bookstore-swal'
      }
    });
  return result.isConfirmed
}
function requireLogin(){
  if(Store.currentUser())return true;
  showAlert('Login required',
    'Please log in to continue.',
    'info').then(()=>location.href='auth.html');
  return false
}
function requireRole(role){
  const user=Store.currentUser();
  if(user?.role===role)return true;
  showAlert('Access denied',
    `This page is available to ${role==='admin'?'administrators':'clients'} only.`,
    'error').then(()=>location.href='index.html');
  return false
}
function updateBadge(){
  const badge=$('.cart-count'),
  user=Store.currentUser();
  if(badge)badge.textContent=user?.role==='client'?Store.cart().count():0
}
function addToCart(bookId,
  quantity=1){
  if(!requireLogin())return false;
  const user=Store.currentUser();
  if(user.role!=='client'){
    showAlert('Access denied',
      'Administrator accounts manage the store and do not use the shopping cart.',
      'warning');
    return false
  }
  const book=Store.books().find(b=>b.id===String(bookId));
  if(!book){
    showAlert('Book unavailable',
      'This book is no longer available.',
      'error');
    return false
  }
  const amount=Number(quantity);
  if(!Number.isInteger(amount)||amount<1){
    showAlert('Check quantity',
      'Choose a quantity of at least one.',
      'warning');
    return false
  }
  const cart=Store.cart(),
  existing=cart.items.find(i=>i.bookId===book.id),
  wanted=(existing?.quantity||0)+amount;
  if(wanted>book.stock){
    showAlert('Not enough stock',
      `Only ${book.stock} ${book.stock===1?'copy':'copies'} available.`,
      'warning');
    return false
  }
  cart.add(book,
    amount);
  Store.saveCart(cart);
  updateBadge();
  showToast(`${book.title} added to cart`);
  return true
}
function bookCard(book){
  const user=Store.currentUser(),
  rtl=book.language==='ar',
  textAttributes=rtl?' lang="ar" dir="rtl"':'';
  const badge=book.onSale?'On Sale':book.bestSeller?'Best Seller':book.isNew?'New':book.stock===0?'Sold Out':'';
  const badgeClass=book.onSale?'badge-sale':book.bestSeller?'badge-bestseller':book.isNew?'badge-new':'';
  const priceMarkup=book.onSale&&bookPrice(book)<Number(book.price)
    ?`<span class="sale-prices"><del class="old-price">${money(book.price)}</del><strong class="sale-price">${money(bookPrice(book))}</strong></span>`
    :`<span class="price">${money(book.price)}</span>`;
  const addButton=user?.role==='admin'?'':`<button class="card-add" data-add="${book.id}" ${book.stock?'':'disabled'}>${book.stock?'<i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Add to Cart':'Out of stock'}</button>`;
  return `<article class="book-card"${rtl?' lang="ar" dir="rtl"':''}>${badge?`<span class="badge ${badgeClass}">${
    badge
  }</span>`:''}<div class="book-cover-wrap"><a href="book-details.html?id=${encodeURIComponent(book.id)}" aria-label="View ${escapeHtml(book.title)}"><figure><img class="book-cover" loading="lazy" src="${escapeHtml(book.cover)}" alt="Cover of ${escapeHtml(book.title)}"><figcaption class="sr-only">${escapeHtml(book.title)} by ${escapeHtml(book.author)}</figcaption></figure></a></div><div class="book-meta"><h3 class="book-title" title="${escapeHtml(book.title)}"${textAttributes}><a title="${escapeHtml(book.title)}" href="book-details.html?id=${encodeURIComponent(book.id)}">${escapeHtml(book.title)}</a></h3><p class="book-author" title="${escapeHtml(book.author)}"${textAttributes}>${escapeHtml(book.author)}</p><div class="book-bottom">${priceMarkup}<span class="rating" aria-label="Rated ${book.rating} out of 5"><i class="fa-solid fa-star" aria-hidden="true"></i> ${book.rating.toFixed(1)}</span></div>${addButton}</div></article>`
}
function escapeHtml(value=''){
  return String(value).replace(/[&<>"']/g,
    c=>({
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":'&#39;'
      }[c]))
}
function bindBookActions(root=document){
  root.addEventListener('click',
    e=>{
      const add=e.target.closest('[data-add]');
      if(add)addToCart(add.dataset.add);
    })
}
function renderShell(){
  const header=$('#site-header'),
  footer=$('#site-footer'),
  user=Store.currentUser();
  if(header){
    const links=[['index.html',
    'fa-house',
    'Home'],
    ['catalog.html',
    'fa-book-open',
    'Browse books']];
    if(user?.role==='client')links.push(['orders.html',
      'fa-box',
      'My orders']);
    if(user?.role==='admin')links.push(['admin.html',
      'fa-gear',
      'Studio']);
    header.className='site-header';
    header.innerHTML=`<nav class="nav-shell" aria-label="Main navigation"><a class="brand" href="index.html"><span class="brand-mark"><i class="fa-solid fa-book-open" aria-hidden="true"></i></span> chapter & co.</a><button class="menu-btn" aria-label="Toggle navigation" aria-expanded="false"><i class="fa-solid fa-bars" aria-hidden="true"></i></button><ul class="nav-links">${links.map(([href,icon,label])=>`<li><a href="${href}"><i class="fa-solid ${icon}" aria-hidden="true"></i> ${
      label
    }</a></li>`).join('')}</ul><form class="nav-search" role="search"><label class="sr-only" for="global-search">Search books</label><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><input id="global-search" type="search" placeholder="Find a good read…"></form><div class="nav-actions">${user?`<div class="user-chip"><i class="fa-solid fa-user" aria-hidden="true"></i><span class="user-name">${
      escapeHtml(user.name)
    }</span><span class="role-badge">${
      user.role==='admin'?'Admin':'Client'
    }</span></div><button class="account-btn" id="logout-button" aria-label="Log out"><i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i><span>Logout</span></button>${
      user.role==='client'?'<a class="icon-link" href="cart.html" aria-label="Shopping cart"><i class="fa-solid fa-cart-shopping" aria-hidden="true"></i><span class="cart-count" aria-label="Items in cart">0</span></a>':''
    }`:'<a class="account-btn auth-link" id="auth-link" href="auth.html"><i class="fa-solid fa-user" aria-hidden="true"></i><span>Login / Sign Up</span></a>'}</div></nav>`;
    $('.menu-btn',
      header).addEventListener('click',
      e=>{
        const nav=$('.nav-links',
          header),
        open=nav.classList.toggle('open');
        e.currentTarget.setAttribute('aria-expanded',
          open)
      });
    $('.nav-search',
      header).addEventListener('submit',
      e=>{
        e.preventDefault();
        location.href=`catalog.html?q=${encodeURIComponent($('#global-search').value)}`
      });
    $('#logout-button',
      header)?.addEventListener('click',
      async()=>{
        if(await confirmAction('Log out?',
            'Your cart will stay saved to your account.',
            'Log out')){
          Store.saveUser(null);
          location.href='index.html'
        }
      });
    updateBadge()
  }
if(footer){
    const footerLinks=[['catalog.html',
    'Browse books']];
    if(user?.role==='client')footerLinks.push(['orders.html',
      'My orders']);
    if(user?.role==='admin')footerLinks.push(['admin.html',
      'Studio dashboard']);
    if(!user)footerLinks.push(['auth.html',
      'Login / Sign Up']);
    footer.className='site-footer';
    footer.innerHTML=`<div class="footer-inner"><div><a class="footer-brand" href="index.html">chapter & co.</a><p class="footer-copy">Good books. Better days.</p><div class="social-links" aria-label="Social media"><a href="https://facebook.com" aria-label="Facebook"><i class="fa-brands fa-facebook" aria-hidden="true"></i></a><a href="https://instagram.com" aria-label="Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a><a href="https://x.com" aria-label="X"><i class="fa-brands fa-x-twitter" aria-hidden="true"></i></a></div></div><nav class="footer-links" aria-label="Footer navigation"><ul>${footerLinks.map(([href,label])=>`<li><a href="${href}">${
      label
    }</a></li>`).join('')}<li><a href="mailto:hello@chapterandco.example">Contact</a></li></ul></nav></div><div class="footer-bottom">© 2025 Chapter & Co. Made for the love of a good story.</div>`
  }
}
document.addEventListener('error',
  e=>{
    if(e.target instanceof HTMLImageElement&&e.target.dataset.fallback!=='true'){
      e.target.dataset.fallback='true';
      e.target.src=makeCover(e.target.alt.replace(/^Cover of /,
          ''),
        'Chapter & Co.',
        'en',
        0)
    }
  },
  true);
document.addEventListener('DOMContentLoaded',
  ()=>{
    renderShell();
    bindBookActions();
    const form=$('#newsletter-form');
    if(form)form.addEventListener('submit',
      e=>{
        e.preventDefault();
        showToast('You’re on the list. Happy reading!');
        form.reset()
      })
  });
window.addEventListener('store:update',
  e=>{
    if(e.detail.key==='cart'||e.detail.key==='currentUser')updateBadge()
  });
