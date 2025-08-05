function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

function highlightActiveCategory(categories) {
  function updateHighlight() {
    const sectionOffsets = categories.map(category => {
      const section = document.getElementById(`${category}-section`);
      return section ? section.offsetTop : 0;
    });
    const scrollPos = window.scrollY + 120; // adjust for sticky nav height
    let activeIndex = 0;
    for (let i = 0; i < sectionOffsets.length; i++) {
      if (scrollPos >= sectionOffsets[i]) {
        activeIndex = i;
      }
    }
    document.querySelectorAll('#category-links button').forEach((btn, i) => {
      btn.classList.toggle('active', i === activeIndex);
    });
  }

  window.addEventListener('scroll', updateHighlight);
  // Also update highlight on click
  document.querySelectorAll('#category-links button').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#category-links button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function renderCategoryNavbar(categories) {
  const linksContainer = document.getElementById("category-links");
  linksContainer.innerHTML = "";
  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-dark btn-sm text-capitalize";
    btn.textContent = category;
    btn.onclick = () => {
      document.getElementById(`${category}-section`).scrollIntoView({ behavior: "smooth", block: "start" });
    };
    linksContainer.appendChild(btn);
  });
  highlightActiveCategory(categories);
}

let filteredProducts = allProducts.slice();

function renderCategoryFilter(categories) {
  const filter = document.getElementById('category-filter');
  if (!filter) return;
  filter.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    filter.appendChild(option);
  });
}

function filterAndRenderProducts() {
  const searchInput = document.getElementById('product-search');
  const categoryFilter = document.getElementById('category-filter');
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const selectedCategory = categoryFilter ? categoryFilter.value : '';
  // Filter by category first, then by search term
  let products = allProducts;
  if (selectedCategory) {
    products = products.filter(p => p.category === selectedCategory);
  }
  if (searchTerm) {
    const searchWords = searchTerm.split(/\s+/).filter(Boolean);
    products = products.filter(p => {
      const haystack = `${p.title} ${p.desc} ${p.id}`.toLowerCase();
      return searchWords.every(word => haystack.includes(word));
    });
  }
  filteredProducts = products;
  renderProductsByCategory(filteredProducts);
  if (typeof updateAllCartWishlistButtons === 'function') updateAllCartWishlistButtons();
}

function renderProductsByCategory(products = allProducts) {
  const container = document.getElementById("product-list");
  const heading = document.getElementById("category-heading");
  container.innerHTML = "";


  // Get unique categories from products
  const categories = Array.from(new Set(products.map(p => p.category)));
  // Only show category navbar if there are products
  if (products.length > 0) {
    renderCategoryNavbar(categories);
  } else {
    document.getElementById("category-links").innerHTML = "";
  }

  let anyProductRendered = false;
  categories.forEach(category => {
    // Create section for each category
    const productsInCategory = products.filter(p => p.category === category);
    if (productsInCategory.length === 0) return; // Skip empty categories
    const section = document.createElement("section");
    section.id = `${category}-section`;
    section.className = "mb-5";

    // Category heading with product count
    const catHeading = document.createElement("h3");
    catHeading.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} (${productsInCategory.length})`;
    catHeading.className = "mb-4 text-center";
    section.appendChild(catHeading);

    // Products row
    const row = document.createElement("div");
    row.className = "row g-4";
    productsInCategory.forEach(product => {
      const col = document.createElement("div");
      col.className = "col-6 col-md-4";
      col.innerHTML = `
  <div class="card h-100 shadow-sm fade-in">
    <img src="${product.img}" loading="lazy"
         class="card-img-top product-img"
         alt="${product.title}"
         data-id="${product.id}"
         data-title="${product.title}"
         data-desc="${product.desc}"
         data-price="${product.price}"
         data-img="${product.img}">
    <div class="card-body">
      <h5 class="card-title">${product.title}</h5>
      <p class="card-text text-muted">${product.desc}</p>
      <p class="fw-bold">${product.price}</p>
      <div class="d-flex justify-content-center gap-2">
        <button class="btn btn-sm btn-outline-dark rounded-pill add-to-cart-btn" title="Add to Cart"  data-id="${product.id}">
          <i class="bi bi-cart-plus"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger rounded-pill add-to-wishlist-btn" title="Add to Wishlist">
          <i class="bi bi-heart"></i>
        </button>
        <a class="btn btn-sm btn-outline-primary rounded-pill view-details-btn" title="View Details"
           href="product-details.html?id=${product.id}">
          <i class="bi bi-info-circle"></i> <span class="d-none d-lg-inline">View Details</span>
        </a>
      </div>
    </div>
  </div>
`;

      row.appendChild(col);
      anyProductRendered = true;
    });
    section.appendChild(row);
    container.appendChild(section);
  });
  // Show a message if no products match
  if (!anyProductRendered) {
    container.innerHTML = '<div class="alert alert-warning text-center">No products found.</div>';
  }
  heading.textContent = products.length === allProducts.length ? "All Products" : `Results (${products.length})`;
}

function scrollToCategorySection(category) {
  const section = document.getElementById(`${category}-section`);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProductsByCategory();
  if (typeof updateAllCartWishlistButtons === 'function') updateAllCartWishlistButtons();
  // Animate product cards
  setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach((el, i) => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(30px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.6s, transform 0.6s';
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, i * 100);
    });
  }, 100);
  const category = getCategoryFromURL();
  if (category) {
    setTimeout(() => scrollToCategorySection(category), 200);
  }

  // Add to Cart functionality for product cards
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    const card = button.closest('.card');
    const img = card.querySelector('img');
    const productId = img.getAttribute('data-id');
    // Disable button if already in cart
    const cart = getCart ? getCart() : [];
    if (cart.some(item => item.id === productId)) {
      button.disabled = true;
      button.classList.remove('btn-outline-dark');
      button.classList.add('btn-success');
    }
    button.addEventListener('click', () => {
      const product = {
        id: img.getAttribute('data-id'),
        title: img.getAttribute('data-title'),
        desc: img.getAttribute('data-desc'),
        price: img.getAttribute('data-price'),
        img: img.getAttribute('data-img'),
      };
      if (typeof addToCart === 'function') {
        addToCart(product);
      }
      button.disabled = true;
      button.classList.remove('btn-outline-dark');
      button.classList.add('btn-success');
    });
  });

  // Add to Wishlist functionality for product cards (if button exists)
  document.querySelectorAll('.add-to-wishlist-btn').forEach(button => {
    const card = button.closest('.card');
    const img = card.querySelector('img');
    const productId = img.getAttribute('data-title');
    // Disable button if already in wishlist
    const wishlist = getWishlist ? getWishlist() : [];
    if (wishlist.some(item => item.id === productId)) {
      button.disabled = true;
      button.classList.remove('btn-outline-danger');
      button.classList.add('btn-danger');
    }
    button.addEventListener('click', () => {
      const product = {
        id: img.getAttribute('data-title'),
        title: img.getAttribute('data-title'),
        desc: img.getAttribute('data-desc'),
        price: img.getAttribute('data-price'),
        img: img.getAttribute('data-img'),
      };
      if (typeof addToWishlist === 'function') {
        addToWishlist(product);
      }
      button.disabled = true;
      button.classList.remove('btn-outline-danger');
      button.classList.add('btn-danger');
    });
  });

  // Add Quick View functionality for product cards
  document.querySelectorAll('.quick-view-btn').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.card');
      const img = card.querySelector('img');
      if (typeof openQuickView === 'function') {
        openQuickView(img);
      }
    });
  });

  // Quick View modal cart/wishlist logic
  function getQuickViewProduct() {
    return {
      id: document.getElementById('quickViewTitle').textContent,
      title: document.getElementById('quickViewTitle').textContent,
      desc: document.getElementById('quickViewDesc').textContent,
      price: document.getElementById('quickViewPrice') ? document.getElementById('quickViewPrice').textContent : '',
      img: document.getElementById('quickViewImg').src
    };
  }

  function updateQuickViewButtons() {
    const productId = document.getElementById('quickViewTitle').textContent;
    // Cart button
    const cartBtn = document.querySelector('.add-to-cart-btn-modal');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartBtn) {
      const inCart = cart.some(item => item.id === productId);
      cartBtn.disabled = inCart;
      cartBtn.classList.toggle('btn-success', inCart);
      cartBtn.classList.toggle('btn-outline-dark', !inCart);
    }
    // Wishlist button
    const wishlistBtn = document.querySelector('.add-to-wishlist-btn-modal');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (wishlistBtn) {
      const inWishlist = wishlist.some(item => item.id === productId);
      wishlistBtn.disabled = inWishlist;
      wishlistBtn.classList.toggle('btn-danger', inWishlist);
      wishlistBtn.classList.toggle('btn-outline-danger', !inWishlist);
    }
  }

  // Patch openQuickView to update modal button state every time
  const origOpenQuickView = window.openQuickView;
  window.openQuickView = function(triggerElement) {
    origOpenQuickView(triggerElement);
    setTimeout(updateQuickViewButtons, 50);
  }

  // Modal add-to-cart logic (syncs with product cards)
  const cartBtn = document.querySelector('.add-to-cart-btn-modal');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      const product = getQuickViewProduct();
      if (typeof addToCart === 'function') {
        addToCart(product);
      }
      cartBtn.disabled = true;
      cartBtn.classList.remove('btn-outline-dark');
      cartBtn.classList.add('btn-success');
      // Also disable all matching product card cart buttons
      document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        const card = btn.closest('.card');
        const img = card.querySelector('img');
        if (img && img.getAttribute('data-title') === product.id) {
          btn.disabled = true;
          btn.classList.remove('btn-outline-dark');
          btn.classList.add('btn-success');
        }
      });
    });
  }
  // Modal add-to-wishlist logic (syncs with product cards)
  const wishlistBtn = document.querySelector('.add-to-wishlist-btn-modal');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      const product = getQuickViewProduct();
      if (typeof addToWishlist === 'function') {
        addToWishlist(product);
      }
      wishlistBtn.disabled = true;
      wishlistBtn.classList.remove('btn-outline-danger');
      wishlistBtn.classList.add('btn-danger');
      // Also disable all matching product card wishlist buttons
      document.querySelectorAll('.add-to-wishlist-btn').forEach(btn => {
        const card = btn.closest('.card');
        const img = card.querySelector('img');
        if (img && img.getAttribute('data-title') === product.id) {
          btn.disabled = true;
          btn.classList.remove('btn-outline-danger');
          btn.classList.add('btn-danger');
        }
      });
    });
  }

  // Populate category filter
  const categories = Array.from(new Set(allProducts.map(p => p.category)));
  renderCategoryFilter(categories);
  // Search/filter listeners
  const searchInput = document.getElementById('product-search');
  const categoryFilter = document.getElementById('category-filter');
  if (searchInput) searchInput.addEventListener('input', filterAndRenderProducts);
  if (searchInput) searchInput.addEventListener('change', filterAndRenderProducts);
  if (categoryFilter) categoryFilter.addEventListener('change', filterAndRenderProducts);
  // Prevent form submission from reloading the page
  const searchForm = document.getElementById('search-filter-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Remove focus from the input to trigger 'change' event if needed
      if (document.activeElement === searchInput) searchInput.blur();
      filterAndRenderProducts();
    });
  }
  // Initial render
  filterAndRenderProducts();
});

// ------------------------
// Quick View
// ------------------------
function openQuickView(triggerElement) {
  const title = triggerElement.getAttribute("data-title");
  const desc = triggerElement.getAttribute("data-desc");
  const price = triggerElement.getAttribute("data-price");
  const img = triggerElement.getAttribute("data-img");

  document.getElementById("quickViewTitle").textContent = title;
  document.getElementById("quickViewDesc").textContent = desc;
  document.getElementById("quickViewImg").src = img;
  if (document.getElementById("quickViewPrice")) {
    document.getElementById("quickViewPrice").textContent = price;
  }
  // Always update modal button state when opening
  if (typeof updateQuickViewButtons === 'function') {
    setTimeout(updateQuickViewButtons, 0);
  }
  const modal = new bootstrap.Modal(document.getElementById("quickViewModal"));
  modal.show();
}

function updateAllCartWishlistButtons() {
  // Cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    const card = button.closest('.card');
    const img = card.querySelector('img');
    const productId = img.getAttribute('data-id');

    // Disable if already in cart
    const cart = getCart();
    if (cart.some(item => item.id === productId)) {
      button.disabled = true;
      button.classList.remove('btn-outline-dark');
      button.classList.add('btn-success');
    }

    button.onclick = () => {
      const product = {
        id: img.getAttribute('data-id'),
        title: img.getAttribute('data-title'),
        desc: img.getAttribute('data-desc'),
        price: img.getAttribute('data-price'),
        img: img.getAttribute('data-img'),
      };
      addToCart(product);
      button.disabled = true;
      button.classList.remove('btn-outline-dark');
      button.classList.add('btn-success');
    };
  });

  // Wishlist buttons
  document.querySelectorAll('.add-to-wishlist-btn').forEach(button => {
    const card = button.closest('.card');
    const img = card.querySelector('img');
    const productId = img.getAttribute('data-id');

    // Disable if already in wishlist
    const wishlist = getWishlist();
    if (wishlist.some(item => item.id === productId)) {
      button.disabled = true;
      button.classList.remove('btn-outline-danger');
      button.classList.add('btn-danger');
    }

    button.onclick = () => {
      const product = {
        id: img.getAttribute('data-id'),
        title: img.getAttribute('data-title'),
        desc: img.getAttribute('data-desc'),
        price: img.getAttribute('data-price'),
        img: img.getAttribute('data-img'),
      };
      addToWishlist(product);
      button.disabled = true;
      button.classList.remove('btn-outline-danger');
      button.classList.add('btn-danger');
    };
  });
}
