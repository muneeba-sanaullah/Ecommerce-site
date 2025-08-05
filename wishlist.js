// ========== wishlist.js ==========

function renderWishlist() {
  const wishlist = getWishlist();
  const container = document.getElementById("wishlist-items");

  if (!container) return;
  container.innerHTML = "";

  if (wishlist.length === 0) {
    container.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  wishlist.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "d-flex align-items-center justify-content-between border-bottom py-3 wishlist-item";

    // Check if item is already in cart
    const cart = getCart();
    const inCart = cart.some(cartItem => cartItem.id === item.id);

    card.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${item.img}" width="70" class="rounded" />
        <div class="ms-3">
          <h6 class="mb-1">${item.title}</h6>
          <p class="small text-muted mb-1">${item.desc}</p>
          <p class="fw-bold mb-0">${item.price}</p>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button type="button" class="btn btn-outline-primary btn-sm move-to-cart-btn" onclick="moveToCart(${index})" ${inCart ? 'disabled' : ''}>Move to Cart</button>
        <button type="button" class="btn-close" aria-label="Remove" onclick="removeFromWishlist(${index})"></button>
      </div>
    `;
    // Style Move to Cart button if already in cart
    if (inCart) {
      setTimeout(() => {
        const btn = card.querySelector('.move-to-cart-btn');
        if (btn) {
          btn.classList.remove('btn-outline-primary');
          btn.classList.add('btn-success');
          btn.textContent = 'In Cart';
        }
      }, 0);
    }
    container.appendChild(card);
  });

  // Add Continue Shopping button
  const btnGroup = document.createElement('div');
  btnGroup.className = 'd-flex justify-content-end gap-2 mt-3';
  const continueBtn = document.createElement('a');
  continueBtn.href = 'products.html';
  continueBtn.className = 'btn btn-outline-primary';
  continueBtn.textContent = 'Continue Shopping';
  btnGroup.appendChild(continueBtn);
  container.appendChild(btnGroup);
}

function removeFromWishlist(index) {
  const wishlist = getWishlist();
  const removed = wishlist.splice(index, 1);
  setWishlist(wishlist);
  renderWishlist();
  updateWishlistBadge();
  if (removed && removed[0]) {
    showToast(`Removed: ${removed[0].title}`);
  }
}

// Move to Cart
function moveToCart(index) {
  const wishlist = getWishlist();
  const item = wishlist.splice(index, 1)[0];
  setWishlist(wishlist);
  updateWishlistBadge();
  if (item) {
    addToCart(item);
    showToast(`Moved to cart: ${item.title}`);
  }
  renderWishlist();
}

document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();
});
