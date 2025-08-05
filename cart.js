// ------------------------
// Add to Cart Logic
// ------------------------

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  setCart(cart);
  updateCartBadge();
}

// ------------------------
// Render Cart Page
// ------------------------

function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "d-flex align-items-center justify-content-between border-bottom py-3 cart-item";

    const priceValue = parseFloat(item.price.replace(/[^\d.]/g, ""));
    const itemTotal = priceValue * item.quantity;
    total += itemTotal;

    card.innerHTML = `
      <div class="d-flex align-items-center justify-content-between">
        <img src="${item.img}" width="70" />
        <div class="m-2">
          <h6 class="mb-1">${item.title}</h6>
          <p class="small text-muted">${item.desc}</p>
          <p class="fw-bold">${item.price}</p>
        </div>
      </div>
      <div class="d-flex align-items-center gap-3">
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-outline-secondary btn-sm" onclick="changeQty(${index}, -1)">-</button>
        <span id="cart-badge" class="badge bg-dark">${item.quantity}</span>
        <button class="btn btn-outline-secondary btn-sm" onclick="changeQty(${index}, 1)">+</button>
      </div>
      <button type="button" class="btn-close" aria-label="Close" onclick="removeProduct(${index})"></button>
      </div>
    `;

    container.appendChild(card);
  });

  //total price

  const totalDisplay = document.createElement("div");
  totalDisplay.className ="d-flex justify-content-end mt-3 fw-bold fs-5";
  totalDisplay.innerText = `Total: PKR ${total.toFixed(2)}`;
  container.appendChild(totalDisplay);

  // Button container

const btnGroup = document.createElement("div");
btnGroup.className = "d-flex justify-content-end gap-2 mt-3";

// Continue Shopping button

const continueBtn = document.createElement("a");
continueBtn.href = "index.html"; // it will take the user to the homepage
continueBtn.className = "btn btn-outline-primary";
continueBtn.textContent = "Continue Shopping";

// Clear Cart button
const clearBtn = document.createElement("button");
clearBtn.className = "btn btn-outline-danger";
clearBtn.textContent = "Clear Cart";
clearBtn.onclick = () => {
  if (confirm("Are you sure you want to clear your cart?")) {
    localStorage.removeItem("cart");
    updateCartBadge();
    renderCart();
    showToast("Cart cleared!");
  }
};

// Checkout button
const checkoutBtn = document.createElement("a");
checkoutBtn.className = "btn btn-success";
checkoutBtn.textContent = "Checkout";
checkoutBtn.href = "checkout.html";

// Append buttons
btnGroup.appendChild(continueBtn);
btnGroup.appendChild(clearBtn);
btnGroup.appendChild(checkoutBtn);
container.appendChild(btnGroup);
}

//Remove Product

function removeProduct(index) {
    const cart = getCart();
    const removed = cart.splice(index , 1);
    setCart(cart);
    renderCart();
    updateCartBadge();
    if (removed && removed[0]) {
      showToast(`Removed: ${removed[0].title}`);
    }
}

// ------------------------
// Quantity Change Handler
// ------------------------

function changeQty(index, delta) {
  const cart = getCart();

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1); // Remove if quantity goes to 0
  }

  setCart(cart);
  renderCart();
  updateCartBadge();
}

// ------------------------
// Toast on Cart Redirect
// ------------------------

function checkToastMessage() {
  const toastMsg = localStorage.getItem("toast");
  if (toastMsg) {
    showToast(toastMsg); // 🔔 Your toast function
    localStorage.removeItem("toast");
  }
}

// ------------------------
// On Page Load
// ------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Only call this in product/index pages (where navbar is fetched)
  // For cart.html, navbar should already be there
  if (document.getElementById("navbar")) {
    loadNavbarAndInitBadge();
  } else {
    updateCartBadge(); // If no dynamic navbar
  }

  if (document.getElementById("cart-items")) {
    renderCart();
  }

  checkToastMessage();
});
