document.addEventListener('DOMContentLoaded',
  ()=>{
    const books=Store.books();
    $('#best-sellers').innerHTML=books.filter(b=>b.bestSeller).slice(0,
      4).map(bookCard).join('');
    $('#arabic-books').innerHTML=books.filter(b=>b.language==='ar').slice(0,
      4).map(bookCard).join('');
    $('#new-arrivals').innerHTML=books.filter(b=>b.isNew).slice(0,
      4).map(bookCard).join('');
    const categories=[...new Set(books.map(b=>b.category))].slice(0,
      4);
    $('#featured-categories').innerHTML=categories.map(c=>`<a class="category-tile" href="catalog.html?category=${encodeURIComponent(c)}"><b>${escapeHtml(c)}</b><span>Explore the shelf <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span></a>`).join('')
  });
