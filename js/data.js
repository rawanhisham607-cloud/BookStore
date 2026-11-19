/* Sample catalog, models, and browser storage for the local bookstore demo. */
const ADMIN_SECRET_CODE='BOOKSTORE-ADMIN-2025';
const COVER_IDS=['photo-1544947950-fa07a98d237f',
'photo-1512820790803-83ca734da794',
'photo-1543002588-bfa74002ed7e',
'photo-1519682337058-a94d519337bc',
'photo-1532012197267-da84d127e765',
'photo-1516979187457-637abb4f9353'];
function escapeCoverText(value=''){
  return String(value).replace(/[&<>"']/g,
    c=>({
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":'&apos;'
      }[c]))
}
function makeCover(title='Book cover',
  author='Chapter & Co.',
  language='en',
  index=0){
  const colors=['#31584d',
  '#bd7658',
  '#c9a052',
  '#5d705f',
  '#536783',
  '#a65f5a'];
  const color=colors[index%colors.length],
  dir=language==='ar'?'rtl':'ltr',
  shortTitle=String(title).length>27?`${String(title).slice(0,26)}…`:title,
  svg=`<svg xmlns="http://www.w3.org/2000/svg" width="500" height="700" viewBox="0 0 500 700"><rect width="500" height="700" fill="${color}"/><rect x="24" y="24" width="452" height="652" fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width="2"/><text x="250" y="118" text-anchor="middle" fill="#f8f3e8" font-family="Georgia,serif" font-size="19" letter-spacing="4">CHAPTER &amp; CO.</text><path d="M115 165h270" stroke="#f8f3e8" stroke-opacity=".65"/><text x="250" y="340" text-anchor="middle" direction="${dir}" fill="#fffaf0" font-family="Georgia,serif" font-weight="bold" font-size="38" textLength="410" lengthAdjust="spacingAndGlyphs">${escapeCoverText(shortTitle)}</text><text x="250" y="590" text-anchor="middle" fill="#f8f3e8" font-family="Arial,sans-serif" font-size="17">${escapeCoverText(author)}</text></svg>`;
  return`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
const seedBooks=[
['The Midnight Library',
'Matt Haig',
'Fiction',
18.50,
4.8,
14,
true,
false,
'Between life and death there is a library, and within that library, the shelves go on forever. A moving novel about all the choices that go into a life well lived.'],
['The Creative Act',
'Rick Rubin',
'Creativity',
24,
4.9,
9,
true,
false,
'A generous course of study that illuminates the path of the artist as a road we can all follow.'],
['Lessons in Chemistry',
'Bonnie Garmus',
'Fiction',
17.25,
4.7,
0,
true,
false,
'Chemist Elizabeth Zott is not your average woman. A witty, heartfelt story of ambition, resilience, and unexpected family.'],
['Tomorrow, and Tomorrow, and Tomorrow',
'Gabrielle Zevin',
'Fiction',
19.75,
4.8,
12,
true,
false,
'A dazzling novel about two friends who find an escape, and an understanding of each other, in the world of video game design.'],
['Braiding Sweetgrass',
'Robin Wall Kimmerer',
'Nature',
20,
4.9,
8,
true,
false,
'Drawing on Indigenous wisdom and scientific knowledge, this book is a braid of stories about the reciprocity between people and the living world.'],
['Atomic Habits',
'James Clear',
'Personal Growth',
16.99,
4.7,
22,
true,
false,
'A proven framework for getting 1 percent better every day and building lasting habits.'],
['The House in the Cerulean Sea',
'TJ Klune',
'Fantasy',
18,
4.6,
7,
true,
false,
'A quiet case worker is sent to inspect an orphanage full of magical children and finds a family where he least expects it.'],
['Crying in H Mart',
'Michelle Zauner',
'Memoir',
17,
4.7,
5,
true,
false,
'A powerful memoir about growing up Korean American, losing her mother, and forging her own identity.'],
['Piranesi',
'Susanna Clarke',
'Fantasy',
15.5,
4.6,
11,
false,
true,
'A man lives in a mysterious House, an endless labyrinth of halls and statues. A strange and luminous puzzle of a novel.'],
['Yellowface',
'R. F. Kuang',
'Fiction',
18.75,
4.4,
6,
false,
true,
'A sly, sharp novel about ambition, authorship, and the stories we tell ourselves.'],
['The Wager',
'David Grann',
'History',
21,
4.7,
4,
false,
true,
'A gripping tale of shipwreck, survival, and a court martial that reveals the frailty of human nature.'],
['A Psalm for the Wild-Built',
'Becky Chambers',
'Science Fiction',
14,
4.8,
10,
false,
true,
'A tea monk and a robot take a journey through a gentle, hopeful future and ask what people need.'],
['The Very Secret Society of Irregular Witches',
'Sangu Mandanna',
'Fantasy',
16.5,
4.5,
13,
false,
false,
'An isolated witch finds an unexpected home in a cozy, magical tale of found family.'],
['The Song of Achilles',
'Madeline Miller',
'Fiction',
16,
4.7,
3,
false,
false,
'A timeless story of gods, kings, immortal fame, and the human heart.'],
['Project Hail Mary',
'Andy Weir',
'Science Fiction',
19.5,
4.8,
9,
false,
false,
'An astronaut wakes up alone, light-years from home, with no memory of how he got there.'],
['The Body Keeps the Score',
'Bessel van der Kolk',
'Wellness',
22,
4.6,
2,
false,
false,
'A landmark work on how trauma reshapes both body and brain, and paths toward healing.'],
['The Little Prince',
'Antoine de Saint-Exupéry',
'Classics',
12,
4.8,
18,
false,
false,
'A poetic tale of a young prince who travels the universe, learning the meaning of love and loss.'],
['Demon Copperhead',
'Barbara Kingsolver',
'Fiction',
20.5,
4.7,
5,
false,
false,
'An unforgettable modern retelling of David Copperfield set in the mountains of southern Appalachia.'],
['Four Thousand Weeks',
'Oliver Burkeman',
'Personal Growth',
17.5,
4.5,
7,
false,
false,
'A refreshing guide to time management that begins with the fact that we will never get everything done.'],
['The Backyard Bird Chronicles',
'Amy Tan',
'Nature',
28,
4.8,
6,
false,
true,
'A delightful illustrated journal of birds, wonder, and the practice of paying attention.']
].map((b,
    i)=>({
      id:String(i+1),
      title:b[0],
      author:b[1],
      category:b[2],
      price:b[3],
      rating:b[4],
      stock:b[5],
      bestSeller:b[6],
      isNew:b[7],
      onSale:i===1,
      salePrice:i===1?Number((b[3]*.8).toFixed(2)):null,
      cover:`https://images.unsplash.com/${COVER_IDS[i%COVER_IDS.length]}?auto=format&fit=crop&w=500&q=80`,
      description:b[8],
      language:'en'
    }));
const arabicSeed=[
['أولاد حارتنا',
'نجيب محفوظ',
'روايات',
19,
4.8,
12,
true,
false,
'رواية رمزية ترصد حكاية أهل حارة مصرية عبر أجيال متعاقبة، وتطرح أسئلة عن العدل والمعرفة ومصير الإنسان.'],
['يوتوبيا',
'أحمد خالد توفيق',
'روايات',
15,
4.6,
18,
true,
false,
'رواية تستشرف مجتمعاً منقسماً بين طبقة ثرية تعيش في عزلة وفقراء يكافحون خارج أسوارها.'],
['ساق البامبو',
'سعود السنعوسي',
'روايات',
18,
4.7,
10,
true,
false,
'حكاية عيسى الذي يبحث عن هويته بين ثقافتين، في رواية إنسانية عن الانتماء والعائلة.'],
['عزازيل',
'يوسف زيدان',
'روايات',
21,
4.5,
8,
true,
false,
'مخطوط متخيل يروي رحلة راهب في القرن الخامس وأسئلته عن الإيمان والحب والتحولات التاريخية.'],
['رجال في الشمس',
'غسان كنفاني',
'روايات',
12,
4.7,
15,
true,
false,
'رواية قصيرة مؤثرة عن ثلاثة فلسطينيين يبحثون عن حياة أفضل وسط قسوة اللجوء والحدود.'],
['الأسود يليق بك',
'أحلام مستغانمي',
'روايات',
20,
4.4,
9,
true,
false,
'قصة فنانة جزائرية تختار الأسود رمزاً للحداد والقوة، وتخوض علاقة معقدة مع رجل أعمال.'],
['حديث الصباح والمساء',
'نجيب محفوظ',
'روايات',
22,
4.6,
6,
false,
true,
'تتشابك حكايات أجيال متعددة في سجل روائي يرسم تحولات المجتمع المصري عبر الزمن.'],
['اللص والكلاب',
'نجيب محفوظ',
'روايات',
16,
4.5,
7,
false,
false,
'رحلة سعيد مهران بعد خروجه من السجن، في رواية عن الخيانة والانتقام والبحث عن العدالة.'],
['مقدمة ابن خلدون',
'ابن خلدون',
'تاريخ',
26,
4.8,
8,
true,
false,
'كتاب تأسيسي في فهم العمران البشري والدولة والاقتصاد وأسباب نشوء الحضارات وتراجعها.'],
['البداية والنهاية',
'ابن كثير',
'تاريخ',
30,
4.7,
5,
true,
false,
'موسوعة تاريخية واسعة تعرض أخبار الأمم والأنبياء وأحداث التاريخ الإسلامي.'],
['قصة الحضارة',
'ول ديورانت',
'تاريخ',
34,
4.8,
4,
false,
true,
'عرض موسوعي لمسيرة الحضارات الإنسانية وأفكارها وفنونها وشخصياتها المؤثرة.'],
['الأيام',
'طه حسين',
'تاريخ',
14,
4.7,
13,
false,
true,
'سيرة أدبية بديعة لطفولة طه حسين وشبابه ورحلته في طلب العلم رغم تحديات الحياة.'],
['رياض الصالحين',
'يحيى النووي',
'دين وإسلاميات',
18,
4.9,
14,
true,
false,
'مجموعة من الأحاديث النبوية في أبواب الأخلاق والعبادات والمعاملات، مرتبة لتيسير القراءة.'],
['حصن المسلم',
'سعيد القحطاني',
'دين وإسلاميات',
8,
4.8,
20,
true,
false,
'كتاب صغير يجمع أذكار المسلم وأدعيته في أحوال اليوم والليلة والمناسبات المختلفة.'],
['فقه السنة',
'سيد سابق',
'دين وإسلاميات',
24,
4.6,
7,
false,
true,
'عرض مبسط لأحكام العبادات والمعاملات مستند إلى الأدلة والمصادر الفقهية.'],
['تفسير ابن كثير',
'إسماعيل بن كثير',
'دين وإسلاميات',
32,
4.8,
6,
false,
false,
'تفسير جامع للقرآن الكريم يعتمد على الرواية ويشرح الآيات في سياقها ومعانيها.'],
['موجز تاريخ الزمن',
'ستيفن هوكينغ',
'علوم',
20,
4.6,
9,
true,
false,
'رحلة مبسطة إلى أسئلة الكون والثقوب السوداء ونشأة الزمن وأحدث أفكار الفيزياء.'],
['قصة العلم',
'جون جريبين',
'علوم',
23,
4.5,
6,
false,
true,
'حكاية تطور المعرفة العلمية وأفكار العلماء التي غيرت فهمنا للعالم والطبيعة.'],
['الكون',
'كارل ساغان',
'علوم',
25,
4.8,
8,
true,
false,
'استكشاف واسع للكون ومكان الإنسان فيه، بأسلوب يجمع المعرفة العلمية بدهشة الاكتشاف.'],
['حي بن يقظان',
'ابن طفيل',
'فلسفة وفكر',
16,
4.6,
7,
false,
true,
'حكاية فلسفية عن إنسان ينشأ وحيداً في جزيرة، ويصل بالتأمل والتجربة إلى أسئلة المعرفة والوجود.'],
['تهافت الفلاسفة',
'أبو حامد الغزالي',
'فلسفة وفكر',
22,
4.5,
5,
false,
false,
'كتاب يناقش قضايا الفلسفة والمنطق والميتافيزيقا في حوار فكري عميق من التراث الإسلامي.'],
['كليلة ودمنة',
'ابن المقفع',
'أدب وشعر',
13,
4.7,
12,
false,
false,
'حكايات رمزية على ألسنة الحيوانات تحمل معاني الحكمة والسياسة والأخلاق.'],
['ديوان المتنبي',
'المتنبي',
'أدب وشعر',
19,
4.9,
10,
true,
false,
'مختارات من شعر المتنبي الذي يجمع قوة التعبير وعمق الحكمة وروعة اللغة العربية.'],
['فن اللامبالاة',
'مارك مانسون',
'تطوير الذات',
17,
4.3,
11,
false,
true,
'كتاب يدعو إلى اختيار ما يستحق الاهتمام بوعي، والتعامل بواقعية مع حدود الحياة.']
].map((b,
    i)=>({
      id:`ar-${i+1}`,
      title:b[0],
      author:b[1],
      category:b[2],
      price:b[3],
      rating:b[4],
      stock:b[5],
      bestSeller:b[6],
      isNew:b[7],
      onSale:false,
      salePrice:null,
      cover:makeCover(b[0],
        b[1],
        'ar',
        i),
      description:b[8],
      language:'ar'
    }));
class Book{
  constructor(data){
    Object.assign(this,
      data)
  }
  isAvailable(){
    return Number(this.stock)>0
  }
}
function bookPrice(book){
  const salePrice=Number(book?.salePrice);
  return book?.onSale&&salePrice>0&&salePrice<Number(book.price)
    ?salePrice
    :Number(book?.price)||0
}
class User{
  constructor({
      id=`user-${Date.now()}-${Math.random().toString(16).slice(2,7)}`,
      name,
      email,
      phone='',
      passwordHash='',
      role='client'
    }){
    this.id=id;
    this.name=name;
    this.email=String(email||'').trim().toLowerCase();
    this.phone=phone;
    this.passwordHash=passwordHash;
    this.role=role
  }
}
class Customer extends User{
  constructor(data){
    super({
        ...data,
        role:'client'
      })
  }
}
class Administrator extends User{
  constructor(data){
    super({
        ...data,
        role:'admin'
      })
  }
}
class CartItem{
  constructor(bookId,
    quantity=1){
    this.bookId=String(bookId);
    this.quantity=Number(quantity)
  }
}
class ShoppingCart{
  constructor(items=[]){
    this.items=items.map(i=>new CartItem(i.bookId,
        i.quantity))
  }
  add(book,
    qty=1){
    const item=this.items.find(i=>i.bookId===String(book.id));
    if(item)item.quantity+=qty;
    else this.items.push(new CartItem(book.id,
        qty))
  }
  setQuantity(id,
    qty){
    const item=this.items.find(i=>i.bookId===String(id));
    if(item)item.quantity=qty;
    this.items=this.items.filter(i=>i.quantity>0)
  }
  remove(id){
    this.items=this.items.filter(i=>i.bookId!==String(id))
  }
  count(){
    return this.items.reduce((n,
        i)=>n+i.quantity,
      0)
  }
  subtotal(books){
    return this.items.reduce((sum,
        i)=>sum+bookPrice(books.find(b=>b.id===i.bookId))*i.quantity,
      0)
  }
}
class OrderItem{
  constructor(book){
    this.bookId=book.id;
    this.title=book.title;
    this.author=book.author;
    this.price=bookPrice(book);
    this.originalPrice=Number(book.price);
    this.onSale=Boolean(book.onSale&&this.price<this.originalPrice);
    this.cover=book.cover
  }
}
class Order{
  constructor({
      id,
      userId,
      items,
      total,
      customer,
      status='Pending',
      date=new Date().toISOString()
    }){
    this.id=id||`CC-${Date.now().toString().slice(-7)}`;
    this.userId=userId;
    this.customer={
      name:customer.name,
      email:customer.email,
      phone:customer.phone||'',
      address:customer.address||''
    };
    this.customerName=customer.name;
    this.customerEmail=customer.email;
    this.items=items;
    this.total=Number(total);
    this.status=status;
    this.date=date
  }
}
const Store={
 read(key,
    fallback){
    try{
      if(key==='users')return JSON.parse(localStorage.getItem('users')||'null')||fallback;
      if(key==='currentUser')return JSON.parse(localStorage.getItem('currentUser')||'null')||fallback;
      const value=localStorage.getItem(`chapter-${key}`);
      return value?JSON.parse(value):fallback
    }
    catch{
      return fallback
    }
  },
 write(key,
    value){
    if(key==='users')localStorage.setItem('users',
      JSON.stringify(value));
    else if(key==='currentUser'){
      if(value)localStorage.setItem('currentUser',
        JSON.stringify({
            id:value.id,
            name:value.name,
            email:value.email,
            phone:value.phone||'',
            role:value.role
          }));
      else localStorage.removeItem('currentUser')
    }
    else localStorage.setItem(`chapter-${key}`,
      JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('store:update',
        {
          detail:{
            key
          }
        }));
    return value
  },
 books(){
    let books=this.read('books',
      null);
    if(!books){
      books=[...seedBooks,
      ...arabicSeed];
      this.write('books',
        books)
    }
    else{
      let changed=false;
      books=books.map(book=>{
          if(!book.language){
            changed=true;
            return{
              ...book,
              language:'en',
              onSale:book.id==='2',
              salePrice:book.id==='2'?Number((book.price*.8).toFixed(2)):null
            }
          }
          if(typeof book.onSale!=='boolean'||(book.onSale&&!(Number(book.salePrice)>0&&Number(book.salePrice)<Number(book.price)))){
            changed=true;
            const onSale=typeof book.onSale==='boolean'?book.onSale:book.id==='2';
            return{
              ...book,
              onSale,
              salePrice:onSale?Number((book.price*.8).toFixed(2)):null
            }
          }
          return book
        });
      const savedIds=new Set(books.map(book=>book.id));
      arabicSeed.forEach(book=>{
          if(!savedIds.has(book.id)){
            books.push(book);
            changed=true
          }
        });
      if(changed)this.write('books',
        books)
    }
    return books.map(book=>new Book(book))
  },
 saveBooks(books){
    return this.write('books',
      books.map(b=>({
            ...b
          })))
  },
 currentUser(){
    return this.read('currentUser',
      null)
  },
  user(){
    return this.currentUser()
  },
  users(){
    return this.read('users',
      [])
  },
  saveUsers(users){
    return this.write('users',
      users)
  },
  saveUser(user){
    return this.write('currentUser',
      user)
  },
 cart(){
    const user=this.currentUser();
    return new ShoppingCart(user?this.readUserData(`cart_${user.id}`,
        []):[])
  },
  saveCart(cart){
    const user=this.currentUser();
    if(!user)return false;
    localStorage.setItem(`cart_${user.id}`,
      JSON.stringify(cart.items));
    window.dispatchEvent(new CustomEvent('store:update',
        {
          detail:{
            key:'cart'
          }
        }));
    return cart.items
  },
 readUserData(key,
    fallback){
    try{
      return JSON.parse(localStorage.getItem(key)||'null')??fallback
    }
    catch{
      return fallback
    }
  },
 orders(){
    return this.read('orders',
      [])
  },
  saveOrders(orders){
    return this.write('orders',
      orders)
  },
 reset(){
    for(let i=localStorage.length-1;i>=0;i--){
      const key=localStorage.key(i);
      if(key==='users'||key==='currentUser'||key.startsWith('chapter-')||key.startsWith('cart_'))localStorage.removeItem(key)
    }
    location.reload()
  }
};
