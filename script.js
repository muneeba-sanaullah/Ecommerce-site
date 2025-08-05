// ========== index.js ==========


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

  // --- NEW: Update modal button state based on cart/wishlist ---
  const cartBtn = document.querySelector('.add-to-cart-btn-modal');
  const wishlistBtn = document.querySelector('.add-to-wishlist-btn-modal');
  // Use the same logic as in cart.utils.js
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  if (cartBtn) {
    const inCart = cart.some(item => item.id === title);
    cartBtn.disabled = inCart;
    cartBtn.classList.toggle('btn-success', inCart);
    cartBtn.classList.toggle('btn-outline-dark', !inCart);
  }
  if (wishlistBtn) {
    const inWishlist = wishlist.some(item => item.id === title);
    wishlistBtn.disabled = inWishlist;
    wishlistBtn.classList.toggle('btn-danger', inWishlist);
    wishlistBtn.classList.toggle('btn-outline-danger', !inWishlist);
  }
  // --- END NEW ---

  const modal = new bootstrap.Modal(document.getElementById("quickViewModal"));
  modal.show();
}

// ------------------------
// DOM Loaded Logic
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  updateWishlistBadge();
  if (typeof updateAllCartWishlistButtons === 'function') updateAllCartWishlistButtons();
  disableAddedButtons();
  disableWishlistButtons();

  // Add to Cart
  document.querySelectorAll(".add-to-cart-btn").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".card");
      const img = card.querySelector("img");
      const product = {
        id: img.getAttribute("data-title"),
        title: img.getAttribute("data-title"),
        desc: img.getAttribute("data-desc"),
        price: img.getAttribute("data-price"),
        img: img.getAttribute("data-img"),
      };
      addToCart(product);
      button.disabled = true;
      button.classList.remove("btn-outline-dark");
      button.classList.add("btn-success");
    });
  });

  // Add to Wishlist
  document.querySelectorAll(".add-to-wishlist-btn").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".card");
      const img = card.querySelector("img");
      const product = {
        id: img.getAttribute("data-title"),
        title: img.getAttribute("data-title"),
        desc: img.getAttribute("data-desc"),
        price: img.getAttribute("data-price"),
        img: img.getAttribute("data-img"),
      };
      addToWishlist(product);
      button.disabled = true;
      button.classList.remove("btn-outline-danger");
      button.classList.add("btn-danger");
    });
  });

  // Quick View modal cart/wishlist logic for homepage (featured products)
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
    if (cartBtn) {
      const cart = getCart ? getCart() : [];
      if (cart.some(item => item.id === productId)) {
        cartBtn.disabled = true;
        cartBtn.classList.remove('btn-outline-dark');
        cartBtn.classList.add('btn-success');
      } else {
        cartBtn.disabled = false;
        cartBtn.classList.add('btn-outline-dark');
        cartBtn.classList.remove('btn-success');
      }
    }
    // Wishlist button
    const wishlistBtn = document.querySelector('.add-to-wishlist-btn-modal');
    if (wishlistBtn) {
      const wishlist = getWishlist ? getWishlist() : [];
      if (wishlist.some(item => item.id === productId)) {
        wishlistBtn.disabled = true;
        wishlistBtn.classList.remove('btn-outline-danger');
        wishlistBtn.classList.add('btn-danger');
      } else {
        wishlistBtn.disabled = false;
        wishlistBtn.classList.add('btn-outline-danger');
        wishlistBtn.classList.remove('btn-danger');
      }
    }
  }

  // Update quick view buttons every time modal is opened
  const origOpenQuickView = window.openQuickView;
  window.openQuickView = function(triggerElement) {
    origOpenQuickView(triggerElement);
    setTimeout(updateQuickViewButtons, 50);
  }

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
});