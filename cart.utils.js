// ------------------------
// Cart Utilities
// ------------------------

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ------------------------
// Wishlist Utilities
// ------------------------

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function setWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// ------------------------
// Badge Updates
// ------------------------

function updateCartBadge() {
  const cartItems = getCart();
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const badge = document.querySelector("#cart-badge");
  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? "inline-block" : "none";
  }
}

function updateWishlistBadge() {
  const wishlistItems = getWishlist();
  const totalCount = wishlistItems.length;
  const badge = document.querySelector("#wishlist-badge");
  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? "inline-block" : "none";
  }
}

// Add to Cart / Wishlist (moved from index.js for global use)
function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  if (!existingItem) {
    cart.push({ ...product, quantity: 1 });
    setCart(cart);
    updateCartBadge();
    if (typeof disableAddedButtons === 'function') disableAddedButtons();
    if (typeof showToast === 'function') showToast("Added to cart!");
  }
}

function addToWishlist(product) {
  const wishlist = getWishlist();
  const existingItem = wishlist.find(item => item.id === product.id);
  if (!existingItem) {
    wishlist.push(product);
    setWishlist(wishlist);
    updateWishlistBadge();
    if (typeof disableWishlistButtons === 'function') disableWishlistButtons();
    if (typeof showToast === 'function') showToast("Added to wishlist!");
  }
}

function disableAddedButtons() {
  const cart = getCart();
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    const card = btn.closest(".card");
    const productId = card.querySelector("img").getAttribute("data-title");
    const inCart = cart.some(item => item.id === productId);
    if (inCart) {
      btn.disabled = true;
      btn.classList.remove("btn-outline-dark");
      btn.classList.add("btn-success");
    }
  });
}

function disableWishlistButtons() {
  const wishlist = getWishlist();
  document.querySelectorAll(".add-to-wishlist-btn").forEach(btn => {
    const card = btn.closest(".card");
    const productId = card.querySelector("img").getAttribute("data-title");
    const inWishlist = wishlist.some(item => item.id === productId);
    if (inWishlist) {
      btn.disabled = true;
      btn.classList.remove("btn-outline-danger");
      btn.classList.add("btn-danger");
    }
  });
}

function showToast(message) {
  const toastBody = document.getElementById("toast-body");
  const toastEl = document.getElementById("liveToast");
  if (toastBody && toastEl && window.bootstrap) {
    toastBody.textContent = message;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
}

// Utility to update all cart/wishlist buttons (cards, modals, details)
function updateAllCartWishlistButtons() {
  const cart = getCart();
  const wishlist = getWishlist();
  // Card buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    const card = btn.closest('.card');
    if (!card) return;
    const img = card.querySelector('img');
    if (!img) return;
    const productId = img.getAttribute('data-title');
    const inCart = cart.some(item => item.id === productId);
    btn.disabled = inCart;
    btn.classList.toggle('btn-success', inCart);
    btn.classList.toggle('btn-outline-dark', !inCart);
  });
  document.querySelectorAll('.add-to-wishlist-btn').forEach(btn => {
    const card = btn.closest('.card');
    if (!card) return;
    const img = card.querySelector('img');
    if (!img) return;
    const productId = img.getAttribute('data-title');
    const inWishlist = wishlist.some(item => item.id === productId);
    btn.disabled = inWishlist;
    btn.classList.toggle('btn-danger', inWishlist);
    btn.classList.toggle('btn-outline-danger', !inWishlist);
  });
  // Modal buttons
  const modalTitle = document.getElementById('quickViewTitle');
  if (modalTitle) {
    const productId = modalTitle.textContent;
    const cartBtn = document.querySelector('.add-to-cart-btn-modal');
    if (cartBtn) {
      const inCart = cart.some(item => item.id === productId);
      cartBtn.disabled = inCart;
      cartBtn.classList.toggle('btn-success', inCart);
      cartBtn.classList.toggle('btn-outline-dark', !inCart);
    }
    const wishlistBtn = document.querySelector('.add-to-wishlist-btn-modal');
    if (wishlistBtn) {
      const inWishlist = wishlist.some(item => item.id === productId);
      wishlistBtn.disabled = inWishlist;
      wishlistBtn.classList.toggle('btn-danger', inWishlist);
      wishlistBtn.classList.toggle('btn-outline-danger', !inWishlist);
    }
  }
  // Product details page
  const detailsCartBtn = document.getElementById('add-to-cart-details');
  if (detailsCartBtn) {
    const detailsId = detailsCartBtn.getAttribute('data-id') || (window.getProductIdFromURL && window.getProductIdFromURL());
    if (detailsId) {
      const inCart = cart.some(item => item.id === detailsId);
      detailsCartBtn.disabled = inCart;
      detailsCartBtn.classList.toggle('btn-success', inCart);
      detailsCartBtn.classList.toggle('btn-outline-dark', !inCart);
    }
  }
  const detailsWishlistBtn = document.getElementById('add-to-wishlist-details');
  if (detailsWishlistBtn) {
    const detailsId = detailsWishlistBtn.getAttribute('data-id') || (window.getProductIdFromURL && window.getProductIdFromURL());
    if (detailsId) {
      const inWishlist = wishlist.some(item => item.id === detailsId);
      detailsWishlistBtn.disabled = inWishlist;
      detailsWishlistBtn.classList.toggle('btn-danger', inWishlist);
      detailsWishlistBtn.classList.toggle('btn-outline-danger', !inWishlist);
    }
  }
}
