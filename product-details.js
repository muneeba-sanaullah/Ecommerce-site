// ========== product-details.js ==========

document.addEventListener("DOMContentLoaded", () => {
  renderProductDetails();
  if (typeof updateAllCartWishlistButtons === 'function') updateAllCartWishlistButtons();
});

function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderProductDetails() {
  const productId = getProductIdFromURL();
  const container = document.getElementById("product-details");
  if (!productId || !container) {
    container.innerHTML = '<div class="alert alert-danger">Product not found.</div>';
    return;
  }
  const product = allProducts.find(p => p.id === productId);
  if (!product) {
    container.innerHTML = '<div class="alert alert-danger">Product not found.</div>';
    return;
  }
  container.innerHTML = `
    <div class="col-md-6 col-lg-5">
      <img src="${product.img}" alt="${product.title}" class="img-fluid rounded shadow-sm w-100 mb-4" style="max-height: 350px; object-fit: contain;">
    </div>
    <div class="col-md-6 col-lg-5">
      <h2>${product.title}</h2>
      <p class="text-muted">${product.desc}</p>
      <p class="fw-bold fs-4 mb-3">${product.price}</p>
      <div class="d-flex gap-2 mb-3">
        <button class="btn btn-outline-dark" id="add-to-cart-details" data-id="${product.id}"><i class="bi bi-cart-plus"></i> Add to Cart</button>
        <button class="btn btn-outline-danger" id="add-to-wishlist-details" data-id="${product.id}"><i class="bi bi-heart"></i> Add to Wishlist</button>
      </div>
      <a href="products.html" class="btn btn-link">Back to Products</a>
    </div>
  `;
  // Button logic
  const cartBtn = document.getElementById("add-to-cart-details");
  const wishlistBtn = document.getElementById("add-to-wishlist-details");
  if (typeof updateAllCartWishlistButtons === 'function') updateAllCartWishlistButtons();
  if (cartBtn) {
    cartBtn.onclick = () => {
      addToCart(product);
      showDetailsToast("Added to cart!");
      cartBtn.disabled = true;
      cartBtn.classList.remove("btn-outline-dark");
      cartBtn.classList.add("btn-success");
    };
  }
  if (wishlistBtn) {
    wishlistBtn.onclick = () => {
      addToWishlist(product);
      showDetailsToast("Added to wishlist!");
      wishlistBtn.disabled = true;
      wishlistBtn.classList.remove("btn-outline-danger");
      wishlistBtn.classList.add("btn-danger");
    };
  }
}

function showDetailsToast(message) {
  const toastBody = document.getElementById("details-toast-body");
  const toastEl = document.getElementById("details-toast");
  if (toastBody && toastEl && window.bootstrap) {
    toastBody.textContent = message;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
}
